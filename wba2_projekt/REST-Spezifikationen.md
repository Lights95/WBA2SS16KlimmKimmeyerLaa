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



# Doku vom Service - Ressourcen
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

Anwendungslogik: User kann nur Songs ausgeben, die zum jeweiligen Partygenre passen

am Anfang nichts anderes passendes gefunden, erstmal so implementiert und dann kam uns die idee blablalbla und haben wir dann umgesetzt

Funktionalität aus Zeitmangel: Nutzersystem, Kleinigkeiten...


Begriffe benutzen : Datenmodellierung, synchrone Interaktion, asynchrone Interaktion

mehr Zusammenarbeit am gleichen Projekt

