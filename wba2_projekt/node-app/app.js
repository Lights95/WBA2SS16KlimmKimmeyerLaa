var express = require('express');
var bodyParser = require('body-parser');
var redis = require('redis')
var jsonParser = bodyParser.json();
var db = redis.createClient();
    
var app = express();

var user = [
  {name: "Johannes", id : 0},
  {name: "Marvin", id : 1},
  {name: "Lena", id : 2}
]


app.get('/', function(req, res){
  res.send('API für Songabstimmung');
});

/*User*/
/*User anlegen*/
app.post('/users', jsonParser, function(req, res){
    db.keys('user:*', function(err, keys){
        db.mget(keys, function(err, users){
            if(users===undefined){
                users =[];
            }
            users=users.map(function(user){
                return JSON.parse(user);
            });
            var gesetzt= false;
            users.forEach(function(user){
                if(user.name === req.body.name) gesetzt=true;
            });
            if(gesetzt){
                return res.status(401).json({message : "Username bereits vergeben."})
            }
            db.incr('userIDs', function(err, id){
                var user = req.body();
                user.id= id;
                user.groups= [];
                db.set('user:' + user.id, JSON.stringify(user), function(err, newUser){
                    res.type('plain').json(user);
                });
            });
        });
    });
});


app.get('/users', function(req, res){
  res.status(200).json(user);
});

app.get('/users/:id', function(req, res){
  var userID = req.params.id;

  if (userID < user.length && user[userID].name != 0) {
    res.status(200).json(user[userID]);
  }
  else res.status(404).end();
});

app.delete('/users/:id', function(req, res){
  var userID = req.params.id;

  if (userID < user.length && user[userID].name != 0) {
    user[userID] = {"name": 0, id: userID};
    res.status(200).type('plain').send('Removed!');
  }
  else res.status(404).end();
});

/*Songs*/

/*Genres*/

/*Artists*/

/*Queue*/
app.listen(3000);
