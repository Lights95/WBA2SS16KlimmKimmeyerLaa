var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var ejs = require('ejs');
var fs = require('fs');
var http = require('http');

var app = express();

app.get('/queue', jsonParser, function(req, res){
  fs.readFile('./queue.ejs', {encoding:"utf-8"}, function(err, filestring){
    if (err) {
      throw err;
    }
    else {
      var options = {
          host: 'localhost',
          port: 3000,
          path: '/api/queue',
          method: 'GET',
          headers: {
            accept: 'application/json'
          }
      };

      var externalRequest = http.request(options, function(externalResponse){
        console.log('Connected');
        externalResponse.on('data', function(chunk){
          var queuedata = JSON.parse('{ "queue": '+chunk+'}');
          console.log(queuedata);
          var html = ejs.render(filestring, queuedata);
          res.setHeader('content-type', 'text/html');
          res.writeHead(200);
          res.write(html);
          res.end();

        });
      });

      externalRequest.end();
    }
  });
});

app.listen(3001, function(){
  console.log("Server listens on Port 3001");
});


//Bausteine
/*
fs.readFile('./templates/foo.ejs', {encoding:"utf-8"}, function(err, filestring){
  if (err) {
    throw err;
  }
  var html = ejs.render(filestring, data);
});

var options = {
    host: 'localhost',
    port: 3000,
    path: '/api',
    method: 'GET',
    headers: {
      accept: 'application/json'
    }
};


// GET Request
var x = http.request(options,function(res){
  console.log("Connected");
  res.on('data', function(chunk) {
    //Verarbeite Response6
    console.log('Body: ' +chunk);
  });
});

// wenn http.request verwendet wird muss immer ein end(); kommen
x.end();*/
