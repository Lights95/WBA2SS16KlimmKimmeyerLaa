var express = require('express');
var redis = require('redis');
var Ajv = require('ajv');
var router = express.Router();
var db = redis.createClient();
var ajv = Ajv({allErrors: true});


/*Songsschema*/
var songSchema={
    'properties': {
        'id': {
            'type': 'integer',
            'maxProperties': 1
        },
        'name':{
            'type': 'string',
            'maxProperties': 3
        },
        'artist': {
            'type': 'integer',
            'maxProperties': 3
        },
        'genre' : {
            'type': 'integer',
            'maxProperties': 2
        },
        'year': {
            'type': 'integer',
            'maxProperties': 1
        }
    },
    'required': ['id', 'name', 'genre', 'artist']
};

var validate = ajv.compile(songSchema);



//Song erstellen
router.post('/', function(req, res){
    var valid = validate(req.body);
    if(!valid) return res.status(406).json({message: "Ungültiges Schema!"});
    /*Filtert alle Songs*/
    db.keys('song:*', function(err, keys){
        /*Gibt alle Songs aus der DB zurück*/
        db.mget(keys, function(err, songs){
            /*Überprüft, ob Variable einen Wert hat*/
            if(songs===undefined){
                songs =[];
            }
            /*Gibt neues Array zurück, welches alle Songs enthält*/
            songs=songs.map(function(song){
                return JSON.parse(song);
            });
            var gesetzt= false;

            /*Überprüft, ob der neue Songname vorhanden ist*/
            songs.forEach(function(song){
                if(song.title === req.body.title) {
                    gesetzt=true;
                }
            });


            if(gesetzt){
                return res.status(406).json({message : "Song bereits vorhanden."});
            }
            /*Erstellt neuen User in der Datenbank*/
            db.incr('songIDs', function(err, id){
                var song = req.body;
                song.artist=[];
                song.genre=[];
                song.id=id;
                db.set('song:' + song.id, JSON.stringify(song), function(err, newSong){
                    /*neuer Song wird als JSON Objekt zurückgegeben*/
                    res.status(201).json(song);
                });
            });
        });
    });
});

//Alle Songs ausgeben
router.get('/', function(req, res){
    db.keys('song:*', function(err,keys){
        if(err)res.status(404).type('plain').send('Error beim Auslesen.');
        else{
            db.mget(keys, function(err, songs){
                if(err)res.status(404).type('plain').send('Error beim Auslesen.');
                else{
                    songs=songs.map(function(song){
                        return JSON.parse(song);
                    });
                    res.status(200).json(songs);
                }
            });
        }
    });
});

//Song bearbeiten
router.put('/:id', function(req,res){
    var id= req.params.id;
    db.exists('song:'+id,function(err,rep){
       if(rep==1){
           var updatedSong = req.body;
           updatedSong.id = id;
           db.set('song:' + updatedSong.id , JSON.stringify(updatedSong),function(err,rep){
               res.status(201).json(updatedSong);
           });
       }
        else res.status(404).type('plain').send('Der Song mit der ID ' + req.params.id + ' ist nicht vorhanden.');
    });
});

//Bestimmten Song ausgeben
router.get('/:id', function(req, res){
   db.get('song:'+req.params.id, function(err,rep){
       if(rep){
           res.status(200).type('json').send(rep);
       }
       else{
           res.status(404).type('plain').send('Der Song mit der ID: ' + req.params.id +' ist nicht vorhanden.');
       }
   });
});

//Song löschen
router.delete('/:id', function(req, res){
    var id = req.params.id;
    db.exists('song:'+id, function(err,rep){
        if(!rep)res.status(404).type('plain').send('Es ist exitiert kein Song mit der ID '+id);
        else{
           db.del('song:'+id ,function (err, rep) {
               res.status(204).send('Song mit der ID' + req.params.id + ' erfolgreich gelöscht.');
           });
        }
    });
});
module.exports = router;
