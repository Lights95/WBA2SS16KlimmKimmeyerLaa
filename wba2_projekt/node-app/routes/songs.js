//Einbindung der Module

var express = require('express');
var redis = require('redis');
var Ajv = require('ajv');
var router = express.Router();
var db = redis.createClient();
var ajv = Ajv({allErrors: true});
var async = require('async');


/*Songsschema*/
var songSchema={
    'properties': {
        'title':{
            'type': 'string',
            'maxProperties': 1,
            'minLength': 2
        },
        'artist': {
            'type': 'integer',
            'maxProperties': 1
        },
        'genre' : {
            'type': 'integer',
            'maxProperties': 1
        }
    },
    'required': ['title', 'artist', 'genre']
};

//Validierungsvariable
var validate = ajv.compile(songSchema);

/*Song erstellen: evtl. das ganze mit Sets lösen und falls das Genre oder der Artist nicht vorhanden ist, diesen neu Posten.*/
router.post('/', function(req, res){

    //Validierung
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

            /*Überprüft, ob der neue Songname schon vorhanden ist*/
            songs.forEach(function(song){
                if(song.title === req.body.title) {
                    gesetzt=true;
                }
            });

            if(gesetzt){
                return res.status(406).json({message : "Song bereits vorhanden."});
            }

            var song={};
            song.title=req.body.title;
            db.get('artist:' +req.body.artist, function(err,rep){
                if(rep){
                    song.artist=JSON.parse(rep).name;
                }

            db.get('genre:' +req.body.genre, function(err, ren){
                if(ren){
                    song.genre= JSON.parse(ren).name;
                }


            /*Erstellt neuen Song in der Datenbank*/
            db.incr('songIDs', function(err, id){
                song.id=id;
                db.set('song:' + song.id, JSON.stringify(song), function(err, newSong){
                    /*neuer Song wird als JSON Objekt zurückgegeben*/
                    res.status(201).json(song);
                });
            });
            });
            });
        });
    });
});

//Alle Songs ausgeben
router.get('/', function(req, res){
  if(req.query.genre){
    
  }
  else{
    db.keys('song:*', function(err,keys){
        if(err)res.status(404).type('plain').send('Error beim Auslesen oder Datenbank leer.');
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
  }


});

//Song bearbeiten- Dieser Funktion wurde nicht viel Beachtung geschenkt, funktioniert evtl nur begrenzt, da momentan noch nicht verwendet
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
           console.log(rep);
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
