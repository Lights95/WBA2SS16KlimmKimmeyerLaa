var express = require('express');
var redis = require('redis');
var router = express.Router();
var db = redis.createClient();
var Ajv = require('ajv');
var ajv = Ajv({allErrors:true});


/*Queue*/
var queueSchema={
    'properties': {
        'id': {
            'type': 'number',
            'maxProperties': 1
        }
    },
    'required': ['id']
};

var allowedSchema={
    'properties':{
        'id':{
            'type': 'number',
            'maxProperties': 4
        }
    },
    'required': ['id']
};

var validate = ajv.compile(queueSchema);
var validate2 = ajv.compile(allowedSchema);

//neues Lied an der Queue anhängen
router.post('/', function(req, res){
    /*Filtert alle Songs*/
    var unAllowed = false;
    var valid = validate(req.body);
    if(!valid) return res.status(406).json({message: "Ungültiges Schema!"});
    db.keys('allowedGenres:*', function(err, keys){
        if(err) return res.status(404).type('plain').send('Error beim Auslesen.');
        db.mget(keys, function(err, genres){
            if(genres===undefined) genres=[];
                genres=genres.map(function(genre){
                    return JSON.parse(genre);
                });
            genres.forEach(function(genre){
                //vorher war !(req.body.genre === genre.allowedGenres)
                if((req.body.genre !== genre.allowedGenres) || (req.body.genre===undefined)){
                    unAllowed=true;
                }
            });
        });
    });

    db.lrange('queue',0,100, function(err,songs){
        if(err) return res.status(404).type('plain').send('Error beim Auslesen.');

        console.log("test");
        songs=songs.map(function(song){
            return JSON.parse(song);
        });
        var inQueue= false;
        
        if(unAllowed){
            return res.status(403).json({message: 'Genre dieses Songs passt nicht zur Party.'});
        }

        /*Überprüft, ob der neue Song vorhanden ist*/
        songs.forEach(function(song){
            if(song.title === req.body.title) {
                inQueue=true;
            }
        });
        
        if(inQueue){
            return res.status(406).json({message : 'Der Song ist schon in der Queue.'});
        }

        /*Erstellt neuen User in der Datenbank*/
        db.incr('queueNumber', function(err, queueNumber){
            var songID = req.body;
            song.queueNumber=queueNumber;
            db.rpush('queue', JSON.stringify(songID), function(err, newOrder){
                /*neuer Song in der Warteschlange wird als JSON-Objekt zurückgegeben*/
                 res.status(201).json(songID);
            });
        });
    });
});

//Warteschlange ausgeben
router.get('/', function(req, res){
    db.lrange('queue', 0, 100, function(err, songs){
        if(err)res.status(404).type('plain').send('Error beim Auslesen.');
        else{
            songs=songs.map(function(song){
                return JSON.parse(song);
            });
            res.status(200).json(songs);
        }
    });
});

//gehörten Song entfernen
router.delete('/', function(req, res){
    db.llen('queue', function(err,rep){
        if(rep===0)res.status(404).type('plain').send('Es ist exitiert kein Song in der Warteschlange');
        else{
           db.lpop('queue' ,function (err, rep) {
               res.status(204).send('Song aus der Warteschlange erfolgreich gelöscht.');
           });
        }
    });
});

//Verwendung von allowedGenres als Subressource zur Primärressource Queue

router.post('/allowedGenres', function(req,res){
    //Validierung
    var valid = validate2(req.body);
    if(!valid) return res.status(406).json({message: "Ungültiges Schema!"});
    db.incr('allowedGenresID', function(err, id){                                
        var allowedGenres = req.body;
        allowedGenres.id=id;
        db.set('allowedGenres:' + allowedGenres.id, JSON.stringify(allowedGenres),function(err,rep){
            res.status(201).json(allowedGenres);
        });
    });
});

/*Updated die erlaubten Genres der Queue über eine Subressource*/
router.put('/allowedGenres', function(req, res){
    var id = req.body;
});

router.get('/allowedGenres', function(req,res){
   db.keys('allowedGenres:*', function(err,keys){
        if(err)res.status(404).type('plain').send('Error beim Auslesen.');
        else{
            db.mget(keys, function(err, aG){
                if(err)res.status(404).type('plain').send('Error beim Auslesen.');
                else{
                    aG=aG.map(function(genre){
                        return JSON.parse(genre);
                    });
                    res.status(200).json(aG);
                }
            });
        }
    }); 
});


/*Löscht ein erlaubtes Genre der Queue mit einer bestimmten ID, wenn dieses Genre nicht bereits nicht vorhanden ist.*/
router.delete('/allowedGenres/:id' , function(req,res){
    var id = req.params.id;
    db.exists('genre:'+id, function(err,rep){
        if(!rep)res.status(404).type('plain').send('Dieses Genre ist bereits nicht erlaubt'+id);
        else{
           db.del('genre:'+id ,function (err, rep) {
               res.status(204).send('Genre mit der ID' + req.params.id + ' ist nun nicht mehr erlaubt.');
           });
        }
    });  
});

//Zufällige Fortführung fehlt noch

module.exports = router;
