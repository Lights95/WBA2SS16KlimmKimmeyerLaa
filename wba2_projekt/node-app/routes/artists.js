//Einbindung der Module Express, Redis und ajv

var express = require('express');
var redis = require('redis');
var router = express.Router();
var db = redis.createClient();
var Ajv = require('ajv');
var ajv = Ajv({allErrors: true});
var async = require('async');



/*Schema der einzelnen Datentypen wird am Anfang festgelegt: Schema wird direkt überprüft, da wir von nur korrekten Eingaben in der Datenbank ausgehen */

var artistSchema={
    'properties': {
        'name':{
            'type': 'string',
            //Zunächst nur 1 Artist, es dürften aber ab der 2. Projektphase durchaus mehrere sein
            'maxProperties': 1,
            'minLength': 2
        },
        /* Genres, welche ein Artist spielt, werden über die ID übergeben, beim Speichern eines neuen Artists wird diese dann aus der Genre- Datenbank geholt oder was noch nicht implementiert wurde, wird es als Genre neu erstellt. --> Einbindung in der 2. Projektphase*/

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
    //Variable zur Überprüfung, ob der neue Artist vorhanden ist.
    var gesetzt= false;

    /*Erstellt ein Array aus Keys für alle Artists aus der DB*/
    async.series([
    function(callback){
    db.keys('artist:*', function(err, keys){
        /*Gibt alle Artists aus der DB zurück*/
        db.mget(keys, function(err, artists){
            /*Überprüft, ob das Array gefüllt ist, falls nicht ist das Array "artists" leer*/
            if(artists===undefined){
                artists =[];
            }

            /*Gibt neues Array an artists zurück, welches alle Artists enthält*/
            artists=artists.map(function(artist){
                return JSON.parse(artist);
            });

            /*Überprüft, ob der neue Artist vorhanden ist*/
            async.each(artists, function(artist, callback){
                if(artist.name === req.body.name) {
                    gesetzt=true;
                    callback();
                }else{
                return callback();}
            });
            callback();
        });
    });
  }] ,function(err){
    //Abbruch, falls Artist vorhanden ist
    if(gesetzt){
      return res.status(406).json({message : "Artist bereits vorhanden."});
    }
    var artist = {};
    artist.name=req.body.name;
    /*Erstellt neuen Artist in der Datenbank:
    1.) ID wird automatisch generiert und bei jedem Eintrag inkrementiert
    2.) Datenbankeintrag wird erstellt */
    db.incr('artistIDs', function(err, id){
      artist.id=id;
      db.set('artist:' + artist.id, JSON.stringify(artist), function(err, newArtist){
        /*neuer Artist wird als JSON Objekt zurückgegeben*/
        res.status(201).json(artist);
      });
    });
  });
});

//Artists ausgeben
router.get('/', function(req, res){
    //Alle Keys die einen Artist enthalten, werden zurückgegeben
    db.keys('artist:*', function(err,keys){
        //Fehler, wenn Datenbank leer ist --> wird in der zweiten Projektphase korrigiert
        if(err)res.status(404).type('plain').send('Error beim Auslesen oder Datenbank leer.');
        else{
            //Values, werden wieder in einem Array gespeichert, falls kein Fehler vorhanden ist
            db.mget(keys, function(err, artists){
                //Bei Fehlern Abbruch
                if(err)res.status(404).type('plain').send('Error beim Auslesen oder Datenbank leer.');
                else{
                    //Alle Keys werden mit ihren Values in einem neuen Array artists gespeichert
                    artists=artists.map(function(artist){
                        return JSON.parse(artist);
                    });
                    //gibt das Array artists als json Objekt zurück
                    res.status(200).json(artists);
                }
            });
        }
    });
});

//Einzelnen Artist bearbeiten - Dieser Funktion wurde nicht viel Beachtung geschenkt, funktioniert evtl nur begrenzt, da momentan noch nicht verwendet
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


/*Bestimmten Artist ausgeben - Dieser Funktion wurde nicht viel Beachtung geschenkt, funktioniert evtl nur begrenzt, da momentan noch nicht verwendet*/
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
    //Speichern der ID vom Request in der Variable id
    var id = req.params.id;
    //überprüft ob der Eintrag in der Datenbank vorhanden ist
    db.exists('artist:'+id, function(err,rep){
        if(!rep)res.status(404).type('plain').send('Es ist exitiert kein Artist mit der ID '+id);
        else{
            //Löscht Artist aus der Datenbank
           db.del('artist:'+id ,function (err, rep) {
               res.status(204).send('Artist mit der ID' + req.params.id + ' erfolgreich gelöscht.');
           });
        }
    });
});




module.exports = router;
