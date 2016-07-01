var express = require('express');
var redis = require('redis');
var router = express.Router();
var db = redis.createClient();
var Ajv = require('ajv');
var ajv = Ajv({allErrors:true});
var async = require('asyncawait/async');
var await = require('asyncawait/await');


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
        'genreID':{
            'type': 'number',
            'maxProperties': 4
        }
    },
    'required': ['genreID']
};

var validate = ajv.compile(queueSchema);
var validate2 = ajv.compile(allowedSchema);

//neues Lied an der Queue anhängen
router.post('/', function(req, res){
    /*Filtert alle Songs*/
    var inQueue    = false;
    var allowed  = false;
    var queueEntry = {};
    var valid      = validate(req.body);
    
    if(!valid) return res.status(406).json({message: "Ungültiges Schema!"});
    
    db.get('song:' + req.body.id, function(err, ren){
            queueEntry.title  = JSON.parse(ren).title;
            queueEntry.artist = JSON.parse(ren).artist;
            queueEntry.genre  = JSON.parse(ren).genre;
            queueEntry.id     = req.body.id;
    });
    
   
    db.lrange('queue',0,100,function (err,songs){
        if(err) return res.status(404).type('plain').send('Error beim Auslesen.');

        songs=songs.map(function(song){
            return JSON.parse(song);
        });

        /*Überprüft, ob der neue Song vorhanden ist*/
        songs.forEach(function(song){
            if(song.id === queueEntry.id) {
                inQueue=true;
                console.log("vor Ende");
            }
        });
        
        db.keys('allowedGenres:*', function(err, keys){
            if(err) return res.status(404).type('plain').send('Error beim Auslesen.');
            db.mget(keys, function(err, genres){
                if(genres===undefined) genres=[];
                    genres=genres.map(function(genre){
                        return JSON.parse(genre);
                    });
                genres.forEach(function(genre){
                    console.log(genre.name);
                    console.log(queueEntry.genre);
                    if(queueEntry.genre === genre.name){
                        allowed=true;
                    }
                });
                
            if(!allowed){
                return res.status(403).json({message: 'Genre dieses Songs passt nicht zur Party.'});
            }

            else if(inQueue){
                return res.status(406).json({message : 'Der Song ist schon in der Queue.'});
            }
            else{
                db.incr('queueNumber',function(err, id){
                queueEntry.queueNumber = id;
                    /*Erstellt neuen Warteschlangeneintrag in der Datenbank*/
                    db.rpush('queue', JSON.stringify(queueEntry), function(err, newOrder){
                            /*neuer Song in der Warteschlange wird als JSON-Objekt zurückgegeben*/
                            return res.status(201).json(queueEntry);
                    });
                });
            }});
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
   
    
   
});

/*Updated die erlaubten Genres der Queue über eine Subressource*/
router.put('/allowedGenres', function(req, res){
    var valid = validate2(req.body);
    //Validierung
    if(!valid) return res.status(406).json({message: "Ungültiges Schema!"});
    var genreID = req.body.genreID;
    
     db.incr('allowedGenresID', function(err, id){                                
        var allowedGenres = {};
        allowedGenres.nr=id;
        
        db.get('genre:' + genreID , function(err, ren){
            allowedGenres.name = JSON.parse(ren).name;
            allowedGenres.genreID   = req.body.genreID;
            db.set('allowedGenres:' + allowedGenres.nr, JSON.stringify(allowedGenres),function(err,rep){
                res.status(201).json(allowedGenres);
            });
        });
    });
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
