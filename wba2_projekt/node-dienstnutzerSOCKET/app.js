var express = require('express');
var bodyParser = require('body-parser');
var jsonParser = bodyParser.json();
var mm = require('musicmetadata');

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
  console.log('Verbindung mit Webapp hergestellt!');

  /*Senden der Daten*/
  socket.on('getQueue', function(){
    sendQueue(socket);
  });

  socket.on('getSongs', function(){
    sendSongs(socket);
    sendSortedSongs(socket);
  });

  socket.on('getGenres', function(){
    sendGenres(socket);
  });

  socket.on('getArtists', function(){
    sendArtists(socket);
  });

  socket.on('getAllowedGenres', function(){
    sendAllowedGenres(socket);
  });

  socket.on('getPassword', function(){
    sendPassword(socket);
  });

  /*Verarbeite Daten*/
  socket.on('postQueue', function(data){
    postQueue(socket, data);
  });

  socket.on('postGenre', function(data){
    postGenre(socket, data);
  });

  socket.on('postArtist', function(data){
    postArtist(socket, data);
  });

  socket.on('postSong', function(data){
    postSong(socket, data);
  });

  socket.on('deleteSong', function(data){
    deleteSong(socket, data);
  });

  socket.on('deleteFirstQueueItem', function(){
    deleteFirstQueueItem(socket);
  });

  socket.on('putAllowedGenres', function(data){
    putAllowedGenres(socket, data);
  });

  socket.on('putPassword', function(data){
    putPassword(socket, data);
  });

  /* ClientSocket bei Verbindungsabbruch aus der Socket-Liste entfernen */
  socket.on('disconnect', function(){
    console.log("Verbindung mit Webapp abgebrochen!");
    clientSockets.splice(clientSockets.indexOf(socket),1);
  });
});



httpServer.listen(port);

/*API Functions*/
function sendPassword(socket) {
  var options = {
      host: 'localhost',
      port: 3000,
      path: '/api/password',
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
  };

  var externalRequest = http.request(options, function(externalResponse){
    console.log('Verbindung mit Webservice hergestellt!');
    externalResponse.on('data', function(chunk){
      var pwdata = JSON.parse(chunk);
      socket.emit("resPassword",pwdata);
    });
  });
  externalRequest.end();
}


function sendQueue(socket) {
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
    console.log('Verbindung mit Webservice hergestellt!');
    externalResponse.on('data', function(chunk){
      var queuedata = JSON.parse(chunk);
      socket.emit("resQueue",queuedata);
    });
  });
  externalRequest.end();
}

function sendGenres(socket) {
  var options = {
      host: 'localhost',
      port: 3000,
      path: '/api/genres',
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
  };

  var externalRequest = http.request(options, function(externalResponse){
    console.log('Verbindung mit Webservice hergestellt!');
    if (externalResponse.statusCode === 200) {
      externalResponse.on('data', function(chunk){
        var genredata = JSON.parse(chunk);
        socket.emit("resGenres", genredata);
      });
    }
  });
  externalRequest.end();
}

function sendSongs(socket) {
  var options = {
      host: 'localhost',
      port: 3000,
      path: '/api/songs',
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
  };

  var externalRequest = http.request(options, function(externalResponse){
    console.log('Verbindung mit Webservice hergestellt!');
    if (externalResponse.statusCode === 200) {
      externalResponse.on('data', function(chunk){
        var songdata = JSON.parse(chunk);
        socket.emit("resSongs",songdata);
      });
    }
  });
  externalRequest.end();
}

function sendSortedSongs(socket) {
  var options = {
      host: 'localhost',
      port: 3000,
      path: '/api/songs/validSongs',
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
  };

  var externalRequest = http.request(options, function(externalResponse){
    console.log('Verbindung mit Webservice hergestellt!');
    if (externalResponse.statusCode === 200) {
      externalResponse.on('data', function(chunk){
        var songdata = JSON.parse(chunk);
        socket.emit("resFilteredSongs",songdata);
      });
    }
  });
  externalRequest.end();
}

function sendArtists(socket) {
  var options = {
      host: 'localhost',
      port: 3000,
      path: '/api/artists',
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
  };

  var externalRequest = http.request(options, function(externalResponse){
    console.log('Verbindung mit Webservice hergestellt!');
    if (externalResponse.statusCode === 200) {
      externalResponse.on('data', function(chunk){
        var songdata = JSON.parse(chunk);
        socket.emit("resArtists",songdata);
      });
    }
  });
  externalRequest.end();
}

function sendAllowedGenres(socket) {
  var options = {
      host: 'localhost',
      port: 3000,
      path: '/api/queue/allowedGenres',
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
  };

  var externalRequest = http.request(options, function(externalResponse){
    console.log('Verbindung mit Webservice hergestellt!');
    if (externalResponse.statusCode === 200) {
      externalResponse.on('data', function(chunk){
        var genredata = JSON.parse(chunk);
        console.log(genredata);
        socket.emit("resAllowedGenres", genredata);
      });
    }
    if (externalResponse.statusCode === 204) {
      console.log("ok but empty");
      var genredata = [];
      socket.emit("resAllowedGenres", genredata);
    }
  });
  externalRequest.end();
}

function postQueue(socket, data) {
  var options = {
      host: 'localhost',
      port: 3000,
      path: '/api/queue',
      method: 'POST',
      headers: {
        "content-type": "application/json",
      }
  };

  var externalRequest = http.request(options, function(externalResponse){
    console.log('Verbindung mit Webservice hergestellt!');
    externalResponse.setEncoding('utf8');
    if (externalResponse.statusCode === 201) {
      externalResponse.on('data', function(chunk){
        var chunkdata = JSON.parse(chunk);
        sendMeldung(socket, "Zur Warteliste hinzugefügt");

        /*jedem Client die neue Queue senden*/
        clientSockets.forEach(function(clientSocket) {
          sendQueue(clientSocket);
        });
      });
    }
    else if(externalResponse.statusCode === 403){
        sendMeldung(socket, "Falsches Genre");
    }
    else if(externalResponse.statusCode === 406){
        sendMeldung(socket, "Dieser Song ist bereits in der Queue!")
    }
    else sendMeldung(socket, "Fehler: "+externalResponse.statusCode);
    externalResponse.on('error', function(e) {
      sendMeldung(socket, "Error: "+e);
    });
  });
  externalRequest.write('{"id": '+data+'}');
  externalRequest.end();
}

function postGenre(socket, data) {
  var options = {
      host: 'localhost',
      port: 3000,
      path: '/api/genres',
      method: 'POST',
      headers: {
        "content-type": "application/json",
      }
  };

  var externalRequest = http.request(options, function(externalResponse){
    console.log('Verbindung mit Webservice hergestellt!');
    externalResponse.setEncoding('utf8');
    if (externalResponse.statusCode === 201) {
      externalResponse.on('data', function(chunk){
        var chunkdata = JSON.parse(chunk);
        sendMeldung(socket, "Genre hinzugefügt");

        /*jedem Client die neue Queue senden*/
        clientSockets.forEach(function(clientSocket) {
          sendGenres(clientSocket);
        });
      });
    }
    else if(externalResponse.statusCode === 406) sendMeldung(socket, "Genre bereits vorhanden.");
    else sendMeldung(socket, "Fehler: "+externalResponse.statusCode);
    externalResponse.on('error', function(e) {
      sendMeldung(socket, "Error: "+e);
    });
  });
  externalRequest.write('{"name": "'+data+'"}');
  externalRequest.end();
}

function postArtist(socket, data) {
  var options = {
      host: 'localhost',
      port: 3000,
      path: '/api/artists',
      method: 'POST',
      headers: {
        "content-type": "application/json",
      }
  };

  var externalRequest = http.request(options, function(externalResponse){
    console.log('Verbindung mit Webservice hergestellt!');
    externalResponse.setEncoding('utf8');
    if (externalResponse.statusCode === 201) {
      externalResponse.on('data', function(chunk){
        var chunkdata = JSON.parse(chunk);
        sendMeldung(socket, "Artist hinzugefügt");

        /*jedem Client die neue Queue senden*/
        clientSockets.forEach(function(clientSocket) {
          sendArtists(clientSocket);
        });
      });
    }
    else if(externalResponse.statusCode === 406) sendMeldung(socket, "Dieser Artist ist bereits vorhanden!");
    else sendMeldung(socket, "Fehler: "+externalResponse.statusCode);
    externalResponse.on('error', function(e) {
      sendMeldung(socket, "Error: "+e);
    });
  });
  externalRequest.write('{"name": "'+data+'"}');
  externalRequest.end();
}

function deleteSong(socket, data) {
  var options = {
      host: 'localhost',
      port: 3000,
      path: '/api/songs/'+data,
      method: 'DELETE'
  };
  var externalRequest = http.request(options, function(externalResponse){
    console.log('Verbindung mit Webservice hergestellt!');
    externalResponse.setEncoding('utf8');
    if (externalResponse.statusCode === 204) {
      sendMeldung(socket, "Song gelöscht");

      /*jedem Client die neue Queue senden*/
      clientSockets.forEach(function(clientSocket) {
        sendSongs(clientSocket);
        sendSortedSongs(clientSocket);
      });
    }
    else sendMeldung(socket, "Fehler: "+externalResponse.statusCode);
    externalResponse.on('error', function(e) {
      sendMeldung(socket, "Error: "+e);
    });
  });
  externalRequest.end();
}

function postSong(socket, data) {
  var options = {
      host: 'localhost',
      port: 3000,
      path: '/api/songs',
      method: 'POST',
      headers: {
        "content-type": "application/json",
      }
  };

  var externalRequest = http.request(options, function(externalResponse){
    console.log('Verbindung mit Webservice hergestellt!');
    externalResponse.setEncoding('utf8');
    if (externalResponse.statusCode == 201) {
      externalResponse.on('data', function(chunk){
        var chunkdata = JSON.parse(chunk);
        sendMeldung(socket, "Song hinzugefügt");

        /*jedem Client die neue Queue senden*/
        clientSockets.forEach(function(clientSocket) {
          sendSongs(clientSocket);
          sendSortedSongs(clientSocket);
        });
      });
    }
    else if(externalResponse.statusCode === 406) sendMeldung(socket, "Dieser Song ist bereits vorhanden!")
    else sendMeldung(socket, "Fehler: "+externalResponse.statusCode);
    externalResponse.on('error', function(e) {
      sendMeldung(socket, "Error: "+e);
    });
  });
  externalRequest.write('{"title": "'+data.title+'", "artist": '+data.artistID+', "genre": '+data.genreID+' }');
  externalRequest.end();
}

function putAllowedGenres(socket, data) {
  var options = {
    host: 'localhost',
    port: 3000,
    path: '/api/queue/allowedGenres',
    method: 'PUT',
    headers: {
      "content-type": "application/json",
    }
  };

  var externalRequest = http.request(options, function(externalResponse){
    console.log('Verbindung mit Webservice hergestellt!');
    externalResponse.setEncoding('utf8');
    if (externalResponse.statusCode === 201) {
      externalResponse.on('data', function(chunk){
        var chunkdata = JSON.parse(chunk);
        sendMeldung(socket, "Genres geändert");
        /*jedem Client die neuen Erlaubten Genres senden*/
        clientSockets.forEach(function(clientSocket) {
          sendAllowedGenres(clientSocket);
        });
      });
    }
    else if(externalResponse.statusCode === 409) sendMeldung(socket, "Zu viele Genres ausgewählt");
    else sendMeldung(socket, "Fehler: " + externalResponse.statusCode);
    externalResponse.on('error', function(e) {
      sendMeldung(socket, "Error: "+e);
    });
  });
  externalRequest.write('{"genreID":['+ data +']}');
  externalRequest.end();
}


function putPassword(socket, data) {
  var options = {
    host: 'localhost',
    port: 3000,
    path: '/api/password',
    method: 'PUT',
    headers: {
      "content-type": "application/json",
    }
  };

  var externalRequest = http.request(options, function(externalResponse){
    console.log('Verbindung mit Webservice hergestellt!');
    externalResponse.setEncoding('utf8');
    if (externalResponse.statusCode === 201) {
      externalResponse.on('data', function(chunk){
        var chunkdata = JSON.parse(chunk);
        sendMeldung(socket, "Passwort geändert");
      });
    }
    else if(externalResponse.statusCode === 406) sendMeldung(socket, "Bitte mindestens 6 Zeichen");
    else sendMeldung(socket, "Fehler: " + externalResponse.statusCode);
    externalResponse.on('error', function(e) {
      sendMeldung(socket, "Error: "+e);
    });
  });
  externalRequest.write('{"pass": "'+ data +'"}');
  externalRequest.end();
}



function deleteFirstQueueItem(socket) {
  var options = {
      host: 'localhost',
      port: 3000,
      path: '/api/queue',
      method: 'DELETE'
  };
  var externalRequest = http.request(options, function(externalResponse){
    console.log('Verbindung mit Webservice hergestellt!');
    externalResponse.setEncoding('utf8');
    if (externalResponse.statusCode === 204) {
      sendMeldung(socket, "Song wird gespielt");

      /*jedem Client die neue Queue senden*/
      clientSockets.forEach(function(clientSocket) {
        sendQueue(clientSocket);
      });
    }
    else sendMeldung(socket, "Fehler: "+externalResponse.statusCode);
    externalResponse.on('error', function(e) {
      sendMeldung(socket, "Error: "+e);
    });
  });
  externalRequest.end();
}



function sendMeldung(socket, meldung) {
  socket.emit("resMeldung",meldung);
}
