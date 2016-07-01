# Dokumentation

Webbasierte Anwendungen 2 - Verteilte Systeme SS16

Dieses Wiki dokumentiert die Arbeiten der Studenten:

* Marvin Klimm
* Johannes Kimmeyer
* Lena Laaser

Betreuer sind:

* Sheree Saßmannshausen
* Jorge Pereira


###Inhaltsverzeichnis
1. Projektidee
	2. Expose
	3. Ziel
	2. Vorgehensweise
2. Dienstgeber
	3. Ressourcen
	4. Anwendungslogik und Datenhaltung
	5. Geplante Funktionalitäten
6. Dienstnutzer
	7. Use - Cases
	7. Anwendungslogik und Datenhaltung
	8. Präsentationslogik
	9. Asynchrone Implementierung
	10. Geplante Funktionalitäten
11. Fazit
12. Arbeitsmatrix
13. Verwendete Ressourcen und Quellen


## 1.1) Projektidee

###"Musiqueue - Die Partyplaylist"
Niklas feiert gerne Partys, doch er findet es doof, dass er immer die Songs die der DJ auswählt hören muss. Er selbst veranstaltet demnächst auch eine Party, möchte das ganze aber lieber anders handhaben. Seine Idee ist es, dass jeder sich ein bestimmtes Lied wünschen kann und das ganze dann automatisch in die Playlist eingefügt wird.
Zudem würde er sich gerne im Nachhinein die Playlist des Abends angucken, um neue Musik für sich zu finden.  

###Problem:
Niklas möchte gerne ein System haben, mit Hilfe dessen er sich und seinen Gästen die Möglichkeit gibt, sich Songs zu wünschen. Doppelte Lieder oder Lieder, die schon einmal gespielt wurden, sollen dabei selbst verständlich ignoriert werden. Es ist Niklas aber auch noch sehr wichtig dabei, dass er immer noch die Entscheidungsgewalt besitzt, welche Lieder gespielt werden.

## 1.2.) Ziel
Als Ziel haben wir uns ein intaktes System vorgestellt. Wir legten zunächst mehrere Funktionen fest, welche wir auf jeden Fall umsetzten wollten. Dazu gehörten:

* Funktion 1
* Funktion 2
* Funktion 3

## 1.3.) Vorgehensweise
Bei der Suche nach einer geeigneten Projektidee, sammelten wir mehrere Ideen und jeder entschied sich für ein Expose was er der Gruppe anschließend vorstellte. Mit unseren Betreuern entschieden wir uns schließlich für die "*musiqueue*", da hier viel Kommunikation zwischen mehreren Clients und einem Server stattfindet.

Bei der Festlegung der Ressourcen haben wir uns an der Idee orientiert und uns für die später formulierten REST- Spezifikationen entschieden.

Den Dienstgeber und Dienstanbieter wurde dann in Einzelarbeit entwickelt, während die Teammitglieder dabei waren, das ganze nachzuvollziehen. In weiteren Schritten kommunizierten wir dann sehr viel, da ein sehr großer Zusammenhang zwischen beiden vorhanden war. Und klärten uns über unklare Passagen gegenseitig auf und kamen schließlich zu einem übereinstimmenden Ergebnis.

In der nächsten Phase werden wir uns daran setzen, die fehlenden Funktionen zusammen zu entwickeln...

## 2.1.)Ressourcen

|        Ressource        | Methode |                  Semantik                  | content-type (req) | content-type (res) |
|:-----------------------:|:-------:|:------------------------------------------:|:------------------:|:------------------:|
|          /users         |   GET   |      Liste, aller vorhandenen Benutzer     |     text/plain     |  application/json  |
|                         |   POST  |         Erstellt neuen User mit ID         |  application/json  |  application/json  |
|       /users/{:id}      |   GET   |          Gibt Benutzer mit ID aus          |     text/plain     |  application/json  |
|                         |  DELETE |      Löscht Benutzer mit bestimmter ID     |     text/plain     |     text/plain     |
|                         |   PUT   |           Ändern eines Benutzers           |  application/json  |  application/json  |
|          /songs         |   GET   | Liste, aller Songs, Interpreten und Genres |     text/plain     |  application/json  |
|                         |   POST  |            Fügt neuen Song hinzu           |     text/plain     |  application/json  |
|       /songs/{:id}      |   GET   |  Gibt Infos über die ID bestimmten Song an |  application/json  |  application/json  |
|                         |  DELETE |           Löscht bestimmten Song           |     text/plain     |     text/plain     |
|                         |   PUT   |             Ändern eines Songs             |  application/json  |  application/json  |
|          /genres        |   GET   |             Liste, aller Genres            |     text/plain     |  application/json  |
|                         |   POST  |            Erstellt neues Genre            |  application/json  |  application/json  |
|                         |  DELETE |              Löscht Musikgenre             |     text/plain     |     text/plain     |
|                         |   PUT   |           Ändern des Musikgenres           |  application/json  |  application/json  |
|    /users/{:id}/class    |   GET   |         Liste, aller Nutzerklassen         |     text/plain     |  application/json  |
| /users/{:id}/class/{:id} |  DELETE |             Löscht Nutzerklasse            |     text/plain     |     text/plain     |
| /users/{:id}/class                        |   POST  |         Erstellt neue Nutzerklasse         |  application/json  |  application/json  |
|                         |   PUT   |             Ändert Nutzerklasse            |  application/json  |  application/json  |
|         /artists        |   GET   |          Liste, aller Interpreten          |     text/plain     |  application/json  |
|                         |   PUT   |              Ändert Interpret              |  application/json  |  application/json  |
|                         |  DELETE |             Löscht Interpreten             |     text/plain     |     text/plain     |
|                         |   POST  |         Erstellt neuen Interpreten         |  application/json  |  application/json  |
|          /queue         |   GET   |         Zeigt komplette Warteliste         |     text/plain     |  application/json  |
|                         |   POST  |    Fügt neues Lied der Warteliste hinzu    |  application/json  |  application/json  |
|                         |  DELETE |       Löscht Lied aus der Warteliste       |     text/plain     |     text/plain     |



Definition der Ressourcen:

Zunächst die logischen Ressourcen überlegt, die notwendig waren zur Gestaltung unseres Programmes:

* songs
* genres
* queue

Ergänzung von weiteren sinnvollen Ressourcen:

* artists
* users

Wir haben überlegt, die Artist Ressource als Attribut in Songs reinzunehmen, damit man aber später mehr Möglichkeiten hat, haben wir es als einzelne Ressource angelegt. Nutzersystem wird klein gehalten, aber vorhanden, damit nicht jeder mit dem System Mist machen kann.

* Keine Löschung mehr einer kompletten Ressource....
* keine Löschung einzelner ID in Queue für normalnutzer
* einzelne Ressourcen rausgenommen
* Delete: Löschoperationen
* Get: Ausgabe
* Put, etc. : logisch

Anwendungslogik:
User kann nur Songs ausgeben, die zum jeweiligen Partygenre passen

am Anfang nichts anderes passendes gefunden, erstmal so implementiert und dann kam uns die idee blablalbla und haben wir dann umgesetzt

Funktionalität aus Zeitmangel: Nutzersystem, Kleinigkeiten...


Begriffe benutzen : Datenmodellierung, synchrone Interaktion, asynchrone Interaktion

mehr Zusammenarbeit am gleichen Projekt

## 2.3) Geplante Funktionalitäten  
* Zufällige Fortführung der Queue, falls kein Input kommt
* Je nach Genre passende Vorschläge zum einreihen
* resistentes Speichern der Playlist eines Abends

##3) Dienstnutzer

###3.1) Grundlegende Idee
Der Dienstnutzer wurde als weiteres node-Package implementiert. Dieser soll in Echtzeit mit dem Server asynchron komunizieren können. Dies dient besonders dazu allen Clients, die vom Dienstnutzer gebrauch machen immer die aktuellen Informationen bereitzustellen. Das heißt konkret, dass Veränderungen in der View ohne manuelle Aktualisierung dargestellt werden sollen.

Dazu haben wir das Package socket.io zur Hilfe genommen. Socket.io bietet unserer Anwendung die Möglichkeit ohne Intervallabfragen stets die aktuellen Informationen bereitstellen zu können.
Durch socket.io werden neben der HTTP Verbindung vom Browser zum Dienstnutzer Websockets auf Basis von TCP aufgebaut. Da Websockets teilweise unterschiedlich in Browsern implementiert sind hilft das auf Framework socket.io.

In unserem Szenario laufen zur Zeit Dienstnutzer(Port 8080) und Dienstgeber(Port 3000) lokal auf dem Rechner. Beide müssen natürlich zur Nutzung unserer Anwendung laufen. Um die View des Dienstnutzer zu erreichen ruft man diesen üblicherweise auf Port 8080 über den Browser auf.
Der Dienstnutzer übermittelt, dann das Grundlegende HTML Dokument (index.html). Daneben werden noch weitere JavaScript Dateien übermittelt. Diese bieten die Viewfunktionalitäten um Daten an den Dienstnutzer zu übermitteln, sowie Daten von diesem in der View darzustellen.

Bei Funktionsaufrufen von Sockets reagiert der Dienstnutzer darauf und baut eine HTTP Verbindung zum Dienstgeber auf. Sobald die Daten vom Dienstgeber den Dienstnutzer erreichen werden diese weiter zu View gegeben und von der View dargestellt.

###3.2) Funktionen des Dienstnutzers

###3.3) Funktionen der Dienstnutzer View

####3.3.1) Listener
Sobald eine socket Verbindung besteht stehen dem socket folgende Methoden zu Verfügung. Diese kann er über `socket.emit('listenername', data)` erreichen.

*Beispiele:*

```
/* ClientSocket der Socket-Liste hinzufügen*/
clientSockets.push(socket);
console.log('Verbindung mit Webapp hergestellt!');

/*Senden der Daten*/
socket.on('getSongs', function(){
	sendSongs(socket);
});

/*Verarbeite Daten*/
socket.on('postSong', function(data){
	postSong(socket, data);
});
```

##4) Fazit
##5) Arbeitsmatrix
