//Einbindung der Module Express, Redis und ajv

var express = require('express');
var redis = require('redis');
var router = express.Router();
var db = redis.createClient();
var Ajv = require('ajv');
var ajv = Ajv({allErrors: true});



/*Schema der einzelnen Datentypen wird am Anfang festgelegt: Schema wird direkt überprüft, da wir von nur korrekten Eingaben in der Datenbank ausgehen */

var artistSchema={
    'properties': {
        'name':{
            'type': 'string',
            //Zunächst nur 1 Artist, es dürften aber durchaus mehrere sein
            'maxProperties': 1
        },
        /* Genres, welche ein Artist spielt, werden über die ID übergeben, beim Speichern eines neuen Artists wird diese dann aus der Genre- Datenbank geholt oder was noch nicht implementiert wurde, wird es als Genre neu erstellt. */

        'genres':{
            'items':[
                {'type': 'number'},
                {'maxItems': 1},
                {'uniqueItems': true}
            ]
        }
    },
    'required': ['name']
};

// Variable zur Überprüfung der Schemas
var validate = ajv.compile(artistSchema);

/*Artists*/
router.post('/', function(req, res){

    //Validierung des JSON- Objekts, welches über den Dienstnutzer gesendet wird. Abbruch bei falschem Schema
    var valid = validate(req.body);
    if(!valid) return res.status(406).json({message: "Ungültiges Schema!"});

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

            //Variable zur Überprüfung, ob der neue Artist vorhanden ist.
            var gesetzt= false;

            /*Überprüft, ob der neue Artist vorhanden ist*/
            artists.forEach(function(artist){
                if(artist.name === req.body.name) {
                    gesetzt=true;
                }
            });

            //Abbruch, falls Artist vorhanden ist
            if(gesetzt){
                return res.status(409).json({message : "Artist bereits vorhanden."});
            }

            var artist = {};
            artist.name=req.body.name;
                db.get('genre:' +req.body.genre, function(err, ren){
                    if(ren){
                        artist.genre= JSON.parse(ren).name;
                    }
                });
            /*Erstellt neuen Artist in der Datenbank:
            1.) ID wird automatisch generiert und bei jedem Eintrag inkrementiert
            2.) Nach der ID des Genres wird in den Genres gesucht, wenn nichts gefunden wird, wird das Genre in Zukunft neu erstellt
            3.) Datenbankeintrag wird erstellt */
            db.incr('artistIDs', function(err, id){
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


// Query- Request für Artist fehlt

module.exports = router;
