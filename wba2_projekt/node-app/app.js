var express = require('express');
var bodyParser = require('body-parser');
var redis = require('redis')
var jsonParser = bodyParser.json();
var db = redis.createClient();
    
var app = express();

/*API*/
app.get('/', function(req, res){
  res.send('API für Songabstimmung');
});

/*User*/
/*User anlegen*/
app.post('/users', jsonParser, function(req, res){
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
                return res.status(401).json({message : "Username bereits vergeben."})
            }
            /*Erstellt neuen User in der Datenbank*/
            db.incr('userIDs', function(err, id){
                var user = req.body;
                user.groups=[];
                user.id=id;
                db.set('user:' + user.id, JSON.stringify(user), function(err, newUser){
                    /*neuer User wird als normaler Text zurückgegeben*/ 
                    res.status(201).json(user);
                });
            });
        });
    });
});

//User ausgeben
/*Problem: bei leerer Datenbank funktionierts nicht.*/
app.get('/users', function(req, res){
    /*db.exists('user:', function(err,rep){
    console.log(rep);
    if(rep==0){
        res.status(404).type('plain').send('Es ist kein User in der Datenbank vorhanden.');
    }
    else{*/
        db.keys('user:*', function(err, keys){
            db.mget(keys, function(err, users){
                users=users.map(function(user){
                    return JSON.parse(user);
                });
                res.json(users);
            });
        });
    //}
    //});   
});


//Einzelnen User bearbeiten
app.put('/users/:id', function(req,res){
    var id= req.params.id;
    db.exists('user:'+id,function(err,rep){
       if(rep==1){
           var updatedUser = req.body;
           updatedUser.id = id;
           db.set('user:' + id , JSON.stringify(updatedUser),function(err,rep){
               res.json(updatedUser);
           });
       }
        else res.status(404).type('plain').send('Der User mit der ID ' + req.params.id + ' ist nicht vorhanden.'); 
    });
});


/*Bestimmten User ausgeben*/
app.get('/users/:id', function(req, res){
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
app.delete('/users/:id', function(req, res){
    var id = req.params.id;
    db.exists('user:'+id, function(err,rep){
        if(!rep)res.status(404).type('plain').send('Es ist exitiert kein User mit der ID '+id);
        else{
           db.del('user:'+id ,function (err, ret) {
               res.status(204);
               res.send("User mit der ID" + req.params.id + ' erfolgreich gelöscht.');
           }); 
        }
    });  
});

/*Songs*/

/*Genres*/

/*Artists*/

/*Queue*/
app.listen(3000);
