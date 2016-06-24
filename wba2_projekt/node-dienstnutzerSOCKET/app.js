var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();

var fs = require('fs');
var http = require('http');

var app = express();
var httpServer = require('http').Server(app);
var io = require('socket.io')(httpServer);

var port = process.env.PORT || 8080;

app.use(express.static(__dirname + '/public'));

var clientSockets = [];

//io.set('origin', '*'); //Bei Problemen mit CORS

io.on('connection', function(socket){

  /* ClientSocket der Socket-Liste hinzufügen*/
  clientSockets.push(socket);
  console.log('Verbindung hergestellt!');




  socket.on('message', function(data){
    console.log(data);

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
        var queuedata = JSON.parse(chunk);
        socket.send(queuedata);
      });
    });

    externalRequest.end();

    /* Nachricht, die von einem CLient kommt, an alle anderen CLients weierreichen */
    /*
    clientSockets.forEach(function(clientSocket) {
      clientSocket.send(data);
    });*/
  });





  /* ClientSocket bei Verbindungsabbruch aus der Socket-Liste entfernen */
  socket.on('disconnect', function(){
    console.log("Verbindung abgebrochen!");
    clientSockets.splice(clientSockets.indexOf(socket),1);
  });
});



httpServer.listen(port);
