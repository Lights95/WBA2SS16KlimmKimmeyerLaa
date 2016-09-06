var express = require('express');
var redis = require('redis');
var router = express.Router();
var db = redis.createClient();
var Ajv = require('ajv');
var ajv = Ajv({allErrors:true});
var async = require('async');


//Queue ist vom Datentyp List

/*Queue, vom Dienstnutzer wird nur ID empfangen und anschließend wird diese über einen get- Befehl als Song gespeichert*/
var queueSchema={
  'properties': {
    'id': {
      'type': 'number',
      'maxProperties': 1
    }
  },
  'required': ['id']
};

// Schema für allowedGenres - ID empfangen, als Genre gespeichert
var allowedSchema={
  'properties':{
    'genreID':{
      'type': 'array',
      'maxItems': 4,
      'items': {
        'type': "integer"
      }
    }
  },
  'required': ['genreID']
};

var validate = ajv.compile(queueSchema);
var validate2 = ajv.compile(allowedSchema);

//neues Lied an der Queue anhängen
router.post('/', function(req, res){
  var inQueue    = false;
  var allowed  = false;
  var queueEntry = {};
  var valid      = validate(req.body);

  if(!valid) return res.status(406).json({message: "Ungültiges Schema!"});


  async.series([

    //Holt das Songobjekt als komplettes Objekt heran, bis auf die Songid und speichert dies in Songentry
    function(callback){
      db.get('song:' + req.body.id, function(err, ren){
        queueEntry.title  = JSON.parse(ren).title;
        queueEntry.artist = JSON.parse(ren).artist;
        queueEntry.genre  = JSON.parse(ren).genre;
        queueEntry.id     = req.body.id;

        callback();
      });
    },
    //Gibt die ersten 10 Einträge der queue zurück - Ab hier wird geguckt, ob der Song schon in der Queue ist
    function(callback){
      db.lrange('queue',0,10,function (err,songs){
        if(err) return res.status(404).type('plain').send('Error beim Auslesen.');
        //speichert Einträge als neues Array in songs, geparst
        songs=songs.map(function(song){
          return JSON.parse(song);
        });


        /*Überprüft, ob der neue Song vorhanden ist*/
        async.each(songs, function(song, callback){
          if(song.id === queueEntry.id) {
            inQueue=true;
            callback();
          }
          else return callback();
        });
        callback();
        //Bis hierhin wird geguckt, ob der Song schon in der Queue ist
      });
    },
    //Aufgrund der Callbackhölle, ist das ganze sehr verschachtelt aufgebaut worden - Ab hier wird überprüft, ob das Genre des Songs erlaubt ist.
    function(callback){
      db.keys('allowedGenres:*', function(err, keys){
        if(err) return res.status(404).type('plain').send('Error beim Auslesen.');
        db.mget(keys, function(err, genres){
          if(genres===undefined) genres=[];
          genres=genres.map(function(genre){
            return JSON.parse(genre);
          });

          async.each(genres, function(genre, callback){
            if(queueEntry.genre === genre.name){
              allowed=true;
              callback();
            }else return callback();
          });
          callback();
        });
      });
    },
    function(err){
      if(!allowed){
        return res.status(403).json({message: 'Genre dieses Songs passt nicht zur Party.'});
      }
      else if(inQueue){
        return res.status(406).json({message : 'Der Song ist schon in der Queue.'});
      }
      else{
        //queueNumber jedes Mal erhöht
        db.incr('queueNumber',function(err, id){
          queueEntry.queueNumber = id;
          /*Erstellt neuen Warteschlangeneintrag in der Datenbank*/
          db.rpush('queue', JSON.stringify(queueEntry), function(err, newOrder){
            /*neuer Song in der Warteschlange wird als JSON-Objekt zurückgegeben*/
            return res.status(201).json(queueEntry);
          });
        });
      }
    }]);
  });

  //Warteschlange ausgeben

router.get('/', function(req, res){
  db.lrange('queue', 0, 100, function(err, songs){
    if(err)res.status(404).type('plain').send('Error beim Auslesen oder Datenbank leer.');
    else{
      songs=songs.map(function(song){
        return JSON.parse(song);
      });
      res.status(200).json(songs);
    }
  });
});

  //gehörten Song entfernen
  //Entfernt den Song der "First In" ist. Das soll das Hören des Musikstückes simulieren
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

  /*Updated die erlaubten Genres der Queue über eine Subressource*/
router.put('/allowedGenres', function(req, res){
  //entfernt nicht gewählte Genres
  db.keys('allowedGenres:*', function(err, res){
  //del kann nur auf nicht leere Elemente durchgeführt werden
    if(res.length!==0 )db.del(res);
    else if(err) console.log("no Genres");
  });

  //aGID wird gelöscht, damit die Werte wieder von vorne starten
  db.exists('aGID', function(err, res){
    if(res===1)db.del('aGID');
  });

  var valid = validate2(req.body);
  //Validierung
  if(!valid) return res.status(409).json({message: "Ungültiges Schema!"});
  var genreID = req.body.genreID;
  var allowedGenres = [];

  //async, um der Callbackhölle zu entkommen, nächste function wird erst ausgeführt, wenn die neuen Genres alle hinzugefügt wurden
  async.each(genreID, function(id, callback){
    if(id === null)return("Error für das Element");
    db.get("genre:" + id, function(err, res){
      if(err||res === null) return callback();
      allowedGenres.push(JSON.parse(res));
      callback();
    });
  },  function(err){
    //zweites mal der Callbackhölle entkommen
      async.each(allowedGenres, function(genre, callback){
        db.incr('aGID', function(err,id){
          db.set('allowedGenres:' + id , JSON.stringify(genre),function(err,rep){
            callback();
          });
        });
      }, function(err){
        if(err)res.status(406);
        else res.status(201).json(allowedGenres);
      });
  });
});

router.get('/allowedGenres', function(req,res){
  db.keys('allowedGenres:*', function(err,keys){
    if(err)res.status(404).type('plain').send('No Content');
    else{
      db.mget(keys, function(err, aG){
        if(err)res.status(204).type('plain').send('No Content');
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


    //funktioniert nicht in Webanwendung, da vom Dienstnutzer nicht richtig reagiert wird --> 2.Projektphase

    /*Löscht ein erlaubtes Genre der Queue mit einer bestimmten ID, wenn dieses Genre nicht bereits nicht vorhanden ist.
    wird nicht benötigt*/
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
