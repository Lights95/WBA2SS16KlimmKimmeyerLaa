
      /*Connecting mit DienstnutzerAPI*/
      var socket = io.connect('http://localhost:8080');

      /*Anfordern der Daten*/
      socket.emit("getQueue");
      socket.emit("getSongs");

      /*Bei empfangen der Daten*/
      socket.on('resQueue', function(queue){
        document.getElementById("songsInQueue").innerHTML = queue.length
        displayQueue(queue);
      });

      socket.on('resSongs', function(songs){
        document.getElementById("songsInDB").innerHTML = songs.length;
        displaySongs(songs);
      });

      /*Sobald eine Meldung eingeht*/
      socket.on('resMeldung', function(msg){
        meldung(msg);
      });

      function displayQueue(data) {
        if (data.length == 0) document.getElementById("queue").innerHTML = '<section class="section--center" style="text-align: center;"><p>Zur Zeit keine Songs in der Warteliste!</p></section>';
        else {
          document.getElementById("queue").innerHTML = "";
          for (var i = 0; i < data.length; i++) {
            var note;
            if(i === 0) note = '(next Song!)';
            else note = '';
            var newQueueObject = document.createElement("section");
            newQueueObject.className = "section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp";
            newQueueObject.innerHTML =
            '<header class="section__play-btn mdl-cell mdl-cell--3-col-desktop mdl-cell--2-col-tablet mdl-cell--4-col-phone mdl-color--teal-100 mdl-color-text--white">' +
              '<i class="material-icons">play_circle_filled</i>'+
            '</header>'+
            '<div class="mdl-card mdl-cell mdl-cell--9-col-desktop mdl-cell--6-col-tablet mdl-cell--4-col-phone">'+
              '<div class="mdl-card__supporting-text">'+
                '<h4>#'+data[i].queueNumber+' '+data[i].title+' '+note+'</h4>'+
                'Interpret: '+data[i].artist+ ' <br>Genre: '+data[i].genre+
              '</div>'+
            '</div>';
            document.getElementById("queue").appendChild(newQueueObject);
          }
        }
      }


      function displaySongs(data) {
        if (data.length === 0) document.getElementById("songs").innerHTML = '<section class="section--center" style="text-align: center;"><p>Zur Zeit keine Songs in der Warteliste!</p></section>';
        else {
          document.getElementById("songs").innerHTML = "";
          for (var i = 0; i < data.length; i++) {
            var newSonglistObject = document.createElement("section");
            newSonglistObject.className = "section--center mdl-grid mdl-grid--no-spacing mdl-shadow--2dp";
            newSonglistObject.innerHTML =
            '<header class="section__play-btn mdl-cell mdl-cell--3-col-desktop mdl-cell--2-col-tablet mdl-cell--4-col-phone mdl-color--teal-100 mdl-color-text--white">' +
              '<i class="material-icons">play_circle_filled</i>'+
            '</header>'+
            '<div class="mdl-card mdl-cell mdl-cell--9-col-desktop mdl-cell--6-col-tablet mdl-cell--4-col-phone">'+
              '<div class="mdl-card__supporting-text">'+
                '<h4>#'+(i+1)+' '+data[i].title+'</h4>'+
                'Interpret: '+data[i].artist+ ' <br>Genre: '+data[i].genre+
              '</div>'+
              '<div class="mdl-card__actions">'+
                '<a href="#" class="mdl-button" onclick="addToQueue('+data[i].id+');">Zur Warteliste hinzufügen</a>'+
              '</div>'+
            '</div>';

            document.getElementById("songs").appendChild(newSonglistObject);
          }
        }
      }
      function addToQueue(id) {
        socket.emit("postQueue", id);
      }

      /*Um Meldungen zu machen*/
      function meldung(msg) {
        (function() {
          'use strict';
          window.counter = 0;
          var snackbarContainer = document.querySelector('#demo-toast-example');
            'use strict';
            var data = {message: msg};
            snackbarContainer.MaterialSnackbar.showSnackbar(data);
        }());
      }
