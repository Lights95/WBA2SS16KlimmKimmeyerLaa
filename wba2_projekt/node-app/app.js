var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

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
app.get('/user', function(req, res){
  res.status(200).json(user);
});

app.post('/user', jsonParser, function(req, res){
  user.push(req.body);

  var userID = user.length-1;
  user[userID].id = user.length-1;
  res.type('plain').send('Added!');
});

app.get('/user/:id', function(req, res){
  var userID = req.params.id;

  if (userID < user.length && user[userID].name != 0) {
    res.status(200).json(user[userID]);
  }
  else res.status(404).end();
});

app.delete('/user/:id', function(req, res){
  var userID = req.params.id;

  if (userID < user.length && user[userID].name != 0) {
    user[userID] = {"name": 0, id: userID};
    res.status(200).type('plain').send('Removed!');
  }
  else res.status(404).end();
});

app.listen(3000);
