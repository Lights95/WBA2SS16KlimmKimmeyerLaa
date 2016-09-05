var express = require('express');
var redis =require('redis');
var bodyParser = require('body-parser');
var db = redis.createClient();


//Wir möchten bei jeder Anwendung mit einer leeren Queue starten
db.del('queue');
db.del('queueNumber');

var app = express();
app.use(bodyParser.json());

app.use('/api', require('./routes'));

app.listen(3000);

module.exports.express = app;
