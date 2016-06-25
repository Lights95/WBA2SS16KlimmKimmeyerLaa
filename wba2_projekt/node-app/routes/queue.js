var express = require('express');
var redis = require('redis');
var router = express.Router();
var db = redis.createClient();

/*Queue*/
//neues Lied an der Queue anhängen
router.post('/', function(req, res){
    /*Filtert alle Songs*/
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
                    return res.status(406).json({message: 'Songs von diesem Genre werden nicht abgespielt'});
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

        if(inQueue){
            return res.status(406).json({message : 'Der Song ist schon in der Queue.'});
        }

        /*Überprüft, ob der neue Nutzername vorhanden ist*/
        songs.forEach(function(song){
            if(song.title === req.body.title) {
                inQueue=true;
            }
        });

        /*Erstellt neuen User in der Datenbank*/
        db.incr('queueNumber', function(err, queueNumber){
            var song = req.body;
            song.queueNumber=queueNumber;
            db.rpush('queue', JSON.stringify(song), function(err, newOrder){
                /*neuer Song in der Warteschlange wird als JSON-Objekt zurückgegeben*/
                 res.status(201).json(song);
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

module.exports = router;
