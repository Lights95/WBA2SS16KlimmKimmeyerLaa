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
                    /*neuer User wird als JSON Objekt zurückgegeben*/ 
                    res.status(201).json(user);
                });
            });
        });
    });
});

//User ausgeben
/*Problem: bei leerer Datenbank funktionierts nicht.*/
app.get('/users', function(req, res){
    db.exists('user:', function(err,rep){
    if(err){
        res.status(404).type('plain').send('Es ist kein User in der Datenbank vorhanden.');
    }
    else{
        db.keys('user:*', function(err, keys){
            db.mget(keys, function(err, users){
                users=users.map(function(user){
                    return JSON.parse(user);
                });
                res.json(users);
            });
        });
    }
    });   
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
           db.del('user:'+id ,function (err, rep) {
               res.status(204).send("User mit der ID" + req.params.id + ' erfolgreich gelöscht.');
           }); 
        }
    });  
});

/*Songs*/

//Song erstellen
app.post('/songs', jsonParser, function(req, res){
    /*Filtert alle Songs*/
    db.keys('song:*', function(err, keys){
        /*Gibt alle Songs aus der DB zurück*/
        db.mget(keys, function(err, songs){
            /*Überprüft, ob Variable einen Wert hat*/
            if(songs===undefined){
                songs =[];
            }
            /*Gibt neues Array zurück, welches alle Songs enthält*/
            songs=songs.map(function(song){
                return JSON.parse(song);
            });
            var gesetzt= false;
            
            /*Überprüft, ob der neue Songname vorhanden ist*/
            songs.forEach(function(song){
                if(song.name === req.body.name) {
                    gesetzt=true;
                }
            });
            
            
            if(gesetzt){
                return res.status(401).json({message : "Song bereits vorhanden."})
            }
            /*Erstellt neuen User in der Datenbank*/
            db.incr('songIDs', function(err, id){
                var song = req.body;
                song.artist=[];
                song.genre=[];
                song.id=id;
                db.set('song:' + song.id, JSON.stringify(song), function(err, newSong){
                    /*neuer Song wird als JSON Objekt zurückgegeben*/ 
                    res.status(201).json(song);
                });
            });
        });
    });
});

//Alle Songs ausgeben
app.get('/songs', function(req, res){
    db.exists('song:', function(err,rep){
    if(err){
        res.status(404).type('plain').send('Es ist kein Song in der Datenbank vorhanden.');
    }
    else{
        db.keys('song:*', function(err, keys){
            db.mget(keys, function(err, songs){
                songs=songs.map(function(song){
                    return JSON.parse(song);
                });
                res.json(songs);
            });
        });
    }
    });   
});

//Song bearbeiten
app.put('/songs/:id', function(req,res){
    var id= req.params.id;
    db.exists('song:'+id,function(err,rep){
       if(rep==1){
           var updatedSong = req.body;
           updatedSong.id = id;
           db.set('song:' + id , JSON.stringify(updatedSong),function(err,rep){
               res.json(updatedSong);
           });
       }
        else res.status(404).type('plain').send('Der Song mit der ID ' + req.params.id + ' ist nicht vorhanden.'); 
    });
});+

//Bestimmten Song ausgeben
app.get('/songs/:id', function(req, res){
   db.get('song:'+req.params.id, function(err,rep){
       if(rep){
           res.type('json').send(rep);
       }
       else{
           res.status(404).type('plain').send('Der Song mit der ID: ' + req.params.id +' ist nicht vorhanden.');
       }
   });
});

//Song löschen
app.delete('/songs/:id', function(req, res){
    var id = req.params.id;
    db.exists('song:'+id, function(err,rep){
        if(!rep)res.status(404).type('plain').send('Es ist exitiert kein Song mit der ID '+id);
        else{
           db.del('song:'+id ,function (err, rep) {
               res.status(204).send('Song mit der ID' + req.params.id + ' erfolgreich gelöscht.');
           }); 
        }
    });  
});   


/*Genres*/
app.post('/genres', jsonParser, function(req, res){
    /*Filtert alle Genres*/
    db.keys('genre:*', function(err, keys){
        /*Gibt alle Genres aus der DB zurück*/
        db.mget(keys, function(err, genres){
            /*Überprüft, ob Variable einen Wert hat*/
            if(genres===undefined){
                genres =[];
            }
            /*Gibt neues Array an User zurück, welches alle User enthält*/
            genres=genres.map(function(genre){
                return JSON.parse(genre);
            });
            var gesetzt= false;
            
            /*Überprüft, ob der neue Nutzername vorhanden ist*/
            genres.forEach(function(genre){
                if(genre.name === req.body.name) {
                    gesetzt=true;
                }
            });
            
            
            if(gesetzt){
                return res.status(401).json({message : "Genre bereits vorhanden."})
            }
            /*Erstellt neues Genre in der Datenbank*/
            db.incr('genreID', function(err, id){
                var genre = req.body;
                genre.groups=[];
                genre.id=id;
                db.set('genre:' + genre.id, JSON.stringify(genre), function(err, newGenre){
                    /*neues Genre wird als JSON Objektzurückgegeben*/ 
                    res.status(201).json(genre);
                });
            });
        });
    });
});

//Genre ausgeben
/*Problem: bei leerer Datenbank funktionierts nicht.*/
app.get('/genres', function(req, res){
    db.exists('genre:', function(err,rep){
    if(err){
        res.status(404).type('plain').send('Es ist kein Genre in der Datenbank vorhanden.');
    }
    else{
        db.keys('genre:*', function(err, keys){
            db.mget(keys, function(err, genres){
                genres=genres.map(function(genre){
                    return JSON.parse(genre);
                });
                res.json(genres);
            });
        });
    }
    });   
});


//Einzelnes Genre bearbeiten
app.put('/genres/:id', function(req,res){
    var id= req.params.id;
    db.exists('genre:'+id,function(err,rep){
       if(rep==1){
           var updatedGenre = req.body;
           updatedGenre.id = id;
           db.set('genre:' + id , JSON.stringify(updatedGenre),function(err,rep){
               res.json(updatedGenre);
           });
       }
        else res.status(404).type('plain').send('Das Genre mit der ID ' + req.params.id + ' ist nicht vorhanden.'); 
    });
});


/*Bestimmtes Genre ausgeben*/
app.get('/genres/:id', function(req, res){
   db.get('genre:'+req.params.id, function(err,rep){
       if(rep){
           res.type('json').send(rep);
       }
       else{
           res.status(404).type('plain').send('Das Genre mit der ID: ' + req.params.id +' ist nicht vorhanden.');
       }
   });
});

//Genre löschen
app.delete('/genres/:id', function(req, res){
    var id = req.params.id;
    db.exists('genre:'+id, function(err,rep){
        if(!rep)res.status(404).type('plain').send('Es ist exitiert kein Genre mit der ID '+id);
        else{
           db.del('genre:'+id ,function (err, rep) {
               res.status(204).send('Genre mit der ID' + req.params.id + ' erfolgreich gelöscht.');
           }); 
        }
    });  
});

/*Artists*/
app.post('/artists', jsonParser, function(req, res){
    /*Filtert alle Artists*/
    db.keys('artist:*', function(err, keys){
        /*Gibt alle Artists aus der DB zurück*/
        db.mget(keys, function(err, artists){
            /*Überprüft, ob Variable einen Wert hat*/
            if(artists===undefined){
                artists =[];
            }
            /*Gibt neues Array an artists zurück, welches alle Artists enthält*/
            artists=artists.map(function(artist){
                return JSON.parse(artist);
            });
            var gesetzt= false;
            
            /*Überprüft, ob der neue Artist vorhanden ist*/
            artists.forEach(function(artist){
                if(artist.name === req.body.name) {
                    gesetzt=true;
                }
            });
            
            
            if(gesetzt){
                return res.status(401).json({message : "Artist bereits vorhanden."})
            }
            /*Erstellt neuen Artist in der Datenbank*/
            db.incr('artistIDs', function(err, id){
                var artist = req.body;
                artist.genre=[];
                artist.id=id;
                db.set('artist:' + artist.id, JSON.stringify(artist), function(err, newArtist){
                    /*neuer Artist wird als JSON Objekt zurückgegeben*/ 
                    res.status(201).json(artist);
                });
            });
        });
    });
});

//Artists ausgeben
/*Problem: bei leerer Datenbank funktionierts nicht.*/
app.get('/artists', function(req, res){
    db.exists('artist:', function(err,rep){
    if(err){
        res.status(404).type('plain').send('Es ist kein Artist in der Datenbank vorhanden.');
    }
    else{
        db.keys('artist:*', function(err, keys){
            db.mget(keys, function(err, artists){
                artists=artists.map(function(artist){
                    return JSON.parse(artist);
                });
                res.json(artists);
            });
        });
    }
    });   
});


//Einzelnen Artist bearbeiten
app.put('/artists/:id', function(req,res){
    var id= req.params.id;
    db.exists('artist:'+id,function(err,rep){
       if(rep==1){
           var updatedArtist = req.body;
           updatedArtist.id = id;
           db.set('artist:' + id , JSON.stringify(updatedArtist),function(err,rep){
               res.json(updatedArtist);
           });
       }
        else res.status(404).type('plain').send('Der Artist mit der ID ' + req.params.id + ' ist nicht vorhanden.'); 
    });
});


/*Bestimmten Artist ausgeben*/
app.get('/artists/:id', function(req, res){
   db.get('artist:'+req.params.id, function(err,rep){
       if(rep){
           res.type('json').send(rep);
       }
       else{
           res.status(404).type('plain').send('Der Artist mit der ID: ' + req.params.id +' ist nicht vorhanden.');
       }
   });
});

//Artist löschen
app.delete('/artists/:id', function(req, res){
    var id = req.params.id;
    db.exists('artist:'+id, function(err,rep){
        if(!rep)res.status(404).type('plain').send('Es ist exitiert kein Artist mit der ID '+id);
        else{
           db.del('artist:'+id ,function (err, rep) {
               res.status(204).send('Artist mit der ID' + req.params.id + ' erfolgreich gelöscht.');
           }); 
        }
    });  
});


/*Queue*/
//neues Lied an der Queue anhängen
app.post('/queue', jsonParser, function(req, res){
    /*Filtert alle Songs*/
    db.keys('queue:*', function(err, keys){
        /*Gibt alle Songs aus der Warteschlange zurück*/
        db.mget(keys, function(err, songs){
            /*Überprüft, ob Variable einen Wert hat*/
            if(songs===undefined){
                songs =[];
            }
            /*Gibt Array zurück, mit allen Songs, die in der Warteschlange ind*/
            songs=songs.map(function(song){
                return JSON.parse(song);
            });
            var inQueue= false;
            
            /*Überprüft, ob der neue Nutzername vorhanden ist*/
            songs.forEach(function(song){
                if(song.name === req.body.name) {
                    inQueue=true;
                }
            });
            
            
            if(inQueue){
                return res.status(401).json({message : "Der Song ist schon in der Queue."})
            }
            /*Erstellt neuen User in der Datenbank*/
            db.incr('queueNumber', function(err, queueNumber){
                var song = req.body;
                song.queueNumber=queueNumber;
                db.set('queue:' + song.queueNumber, JSON.stringify(song), function(err, newOrder){
                    /*neuer Song in der Warteschlange wird als JSON-Objekt zurückgegeben*/ 
                    res.status(201).json(song);
                });
            });
        });
    });
});

//Warteschlange ausgeben
/*Problem: bei leerer Datenbank funktionierts nicht.*/
app.get('/queue', function(req, res){
    db.exists('queue:', function(err,rep){
    if(5===0){
        res.status(404).type('plain').send('Es ist kein Song in der Warteschlange vorhanden.');
    }
    else{
        db.keys('queue:*', function(err, keys){
            db.mget(keys, function(err, songs){
                songs=songs.map(function(song){
                    return JSON.parse(song);
                });
                res.status(200).json(songs);
            });
        });
    }
    });   
});

//Song aus der Queue löschen
app.delete('/songs/:queueNumber', function(req, res){
    var queueNumber = req.params.queueNumber;
    db.exists('queue:'+id, function(err,rep){
        if(!rep)res.status(404).type('plain').send('Es ist exitiert kein Song in der Warteschlange mit der Nummer '+queueNumber);
        else{
           db.del('queue:'+queueNumber ,function (err, rep) {
               res.status(204).send('Song aus der Warteschlange erfolgreich gelöscht.');
           }); 
        }
    });  
});
        
app.listen(3000);
