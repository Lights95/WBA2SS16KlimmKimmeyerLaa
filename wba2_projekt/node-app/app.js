var express = require('express');
var redis =require('redis');
var bodyParser = require('body-parser');
var db = redis.createClient();       

db.del('queue');
db.del('queueNumber');
db.del('allowedGenres');

var app = express();
app.use(bodyParser.json());

app.use('/api', require('./routes'));

app.post('/', function(req,res){
    var allowedGenres = req.body;
    db.set('allowedGenres:', JSON.stringify(allowedGenres),function(err,rep){
        res.status(201).json(allowedGenres);
    });
});

app.listen(3000);

module.exports.express = app;