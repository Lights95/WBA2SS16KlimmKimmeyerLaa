var express = require('express');
var redis = require('redis');
var Ajv = require('ajv');
var router = express.Router();
var db = redis.createClient();
var ajv = Ajv({allErrors: true});

/*User*/

var userSchema={
    'properties': {
        'id': {
            'type': 'number',
            'maxProperties': 1
        },
        'name': {
            'type': 'string',
            maxProperties: 1
        },
        'group':{
            'type': 'string',
            'maxProperties': 1
        }
    },
    'required': ['id', 'name', 'group']
};


/*User anlegen*/
router.post('/', function(req, res){
    var valid = validate(req.body);
    if(!valid) return res.status(406).json({message: "Ungültiges Schema!"});
    /*Filtert alle User*/
    db.keys('user:*', function(err, keys){
        /*Gibt alle User aus der DB zurück*/
        db.mget(keys, function(err, users){
            /*Überprüft, ob Variable einen Wert hat*/
            if(users===undefined){
                users =[];
            }
            /*Gibt neues Array an User zurück, welches alle User enthält*/
            users=users.map(function(user){
                return JSON.parse(user);
            });
            var gesetzt= false;

            /*Überprüft, ob der neue Nutzername vorhanden ist*/
            users.forEach(function(user){
                if(user.name === req.body.name) {
                    gesetzt=true;
                }
            });


            if(gesetzt){
                return res.status(406).json({message : "Username bereits vergeben."});
            }
            /*Erstellt neuen User in der Datenbank*/
            db.incr('userIDs', function(err, id){
                var user = req.body;
                user.groups=[];
                user.id=id;
                db.set('user:' + user.id, JSON.stringify(user), function(err, newUser){
                    /*neuer User wird als JSON Objekt zurückgegeben*/
                    res.status(201).json(user);
                });
            });
        });
    });
});

//User ausgeben
router.get('/', function(req, res){
    db.keys('user:*', function(err,keys){
        if(err)res.status(404).type('plain').send('Error beim Auslesen oder Datenbank leer.');
        else{
            db.mget(keys, function(err, users){
                if(err)res.status(404).type('plain').send('Error beim Auslesen oder Datenbank leer.');
                else{
                    users=users.map(function(user){
                        return JSON.parse(user);
                    });
                    res.status(200).json(users);
                }
            });
        }
    });
});

//Einzelnen User bearbeiten
router.put('/:id', function(req,res){
    var id= req.params.id;
    db.exists('user:'+id,function(err,rep){
       if(rep==1){
           var updatedUser = req.body;
           updatedUser.id = id;
           db.set('user:' + updatedUser.id , JSON.stringify(updatedUser),function(err,rep){
               res.json(updatedUser);
           });
       }
        else res.status(404).type('plain').send('Der User mit der ID ' + req.params.id + ' ist nicht vorhanden.');
    });
});


/*Bestimmten User ausgeben*/
router.get('/:id', function(req, res){
   db.get('user:'+req.params.id, function(err,rep){
       if(rep){
           res.type('json').send(rep);
       }
       else{
           res.status(404).type('plain').send('Der User mit der ID: ' + req.params.id +' ist nicht vorhanden.');
       }
   });
});

//User löschen
router.delete('/:id', function(req, res){
    var id = req.params.id;
    db.exists('user:'+id, function(err,rep){
        if(!rep)res.status(404).type('plain').send('Es ist exitiert kein User mit der ID '+id);
        else{
           db.del('user:'+id ,function (err, rep) {
               res.status(204).send("User mit der ID" + req.params.id + ' erfolgreich gelöscht.');
           });
        }
    });
});
module.exports = router;
