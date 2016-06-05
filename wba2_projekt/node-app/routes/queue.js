var express = require('express');
var redis = require('redis');
var router = express.Router();
var db = redis.createClient();

/*Queue*/
//neues Lied an der Queue anhängen
router.post('/', function(req, res){
    /*Filtert alle Songs*/
    db.keys('queue:*', function(err, keys){
        /*Gibt alle Songs aus der Warteschlange zurück*/
        db.mget(keys, function(err, songs){
            /*Überprüft, ob Variable einen Wert hat*/
            if(songs===undefined){
                songs =[];
            }
            /*Gibt Array zurück, mit allen Songs, die in der Warteschlange ind*/
            songs=songs.map(function(song){
                return JSON.parse(song);
            });
            var inQueue= false;
            
            /*Überprüft, ob der neue Nutzername vorhanden ist*/
            songs.forEach(function(song){
                if(song.title === req.body.title) {
                    inQueue=true;
                }
            });
            
            
            if(inQueue){
                return res.status(401).json({message : "Der Song ist schon in der Queue."})
            }
            /*Erstellt neuen User in der Datenbank*/
            db.incr('queueNumber', function(err, queueNumber){
                var song = req.body;
                song.queueNumber=queueNumber;
                db.set('queue:' + song.queueNumber, JSON.stringify(song), function(err, newOrder){
                    /*neuer Song in der Warteschlange wird als JSON-Objekt zurückgegeben*/ 
                    res.status(201).json(song);
                });
            });
        });
    });
});

//Warteschlange ausgeben
/*Problem: bei leerer Datenbank funktionierts nicht.*/
router.get('/', function(req, res){
    db.keys('queue:*', function(err,keys){
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

//Song aus der Queue löschen
router.delete('/:queueNumber', function(req, res){
    var queueNumber = req.params.queueNumber;
    db.exists('queue:'+queueNumber, function(err,rep){
        if(!rep)res.status(404).type('plain').send('Es ist exitiert kein Song in der Warteschlange mit der Nummer '+queueNumber);
        else{
           db.del('queue:'+queueNumber ,function (err, rep) {
               res.status(204).send('Song aus der Warteschlange erfolgreich gelöscht.');
           }); 
        }
    });  
});

module.exports = router;