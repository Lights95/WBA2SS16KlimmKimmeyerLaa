var express = require('express');
var redis = require('redis');
var router = express.Router();
var db = redis.createClient();
var Ajv = require('ajv');
var ajv = Ajv({allErrors: true});

/*Schema Artist*/
var artistSchema={
    'properties': {
        'id': {
            'type': 'number',
            'maxProperties': 1
        },
        'name':{
            'type': 'string',
            'maxProperties': 3
        },
        'genres': {'type': 'number'}
    },
    'required': ['id', 'name', 'genres']
};

var validate = ajv.compile(artistSchema);

/*Artists*/
router.post('/', function(req, res){
    /*Filtert alle Artists*/
    db.keys('artist:*', function(err, keys){
        /*Gibt alle Artists aus der DB zurück*/
        db.mget(keys, function(err, artists){
            /*Überprüft, ob Variable einen Wert hat*/
            if(artists===undefined){
                artists =[];
            }
            /*Gibt neues Array an artists zurück, welches alle Artists enthält*/
            artists=artists.map(function(artist){
                return JSON.parse(artist);
            });
            var gesetzt= false;

            /*Überprüft, ob der neue Artist vorhanden ist*/
            artists.forEach(function(artist){
                if(artist.name === req.body.name) {
                    gesetzt=true;
                }
            });


            if(gesetzt){
                return res.status(409).json({message : "Artist bereits vorhanden."});
            }
            /*Erstellt neuen Artist in der Datenbank*/
            db.incr('artistIDs', function(err, id){
                var artist = req.body;
                artist.genre=[];
                artist.id=id;
                db.set('artist:' + artist.id, JSON.stringify(artist), function(err, newArtist){
                    /*neuer Artist wird als JSON Objekt zurückgegeben*/
                    res.status(201).json(artist);
                });
            });
        });
    });
});

//Artists ausgeben
router.get('/', function(req, res){
    db.keys('artist:*', function(err,keys){
        if(err)res.status(404).type('plain').send('Error beim Auslesen.');
        else{
            db.mget(keys, function(err, artists){
                if(err)res.status(404).type('plain').send('Error beim Auslesen.');
                else{
                    artists=artists.map(function(artist){
                        return JSON.parse(artist);
                    });
                    res.status(200).json(artists);
                }
            });
        }
    });
});


//Einzelnen Artist bearbeiten
router.put('/:id', function(req,res){
    var id= req.params.id;
    db.exists('artist:'+id,function(err,rep){
       if(rep==1){
           var updatedArtist = req.body;
           updatedArtist.id = id;
           db.set('artist:' + updatedArtist.id , JSON.stringify(updatedArtist),function(err,rep){
               res.status(200).json(updatedArtist);
           });
       }
        else res.status(404).type('plain').send('Der Artist mit der ID ' + req.params.id + ' ist nicht vorhanden.');
    });
});


/*Bestimmten Artist ausgeben*/
router.get('/:id', function(req, res){
   db.get('artist:'+req.params.id, function(err,rep){
       if(rep){
           res.status(200).type('json').send(rep);
       }
       else{
           res.status(404).type('plain').send('Der Artist mit der ID: ' + req.params.id +' ist nicht vorhanden.');
       }
   });
});

//Artist löschen
router.delete('/:id', function(req, res){
    var id = req.params.id;
    db.exists('artist:'+id, function(err,rep){
        if(!rep)res.status(404).type('plain').send('Es ist exitiert kein Artist mit der ID '+id);
        else{
           db.del('artist:'+id ,function (err, rep) {
               res.status(204).send('Artist mit der ID' + req.params.id + ' erfolgreich gelöscht.');
           });
        }
    });
});

module.exports = router;
