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
|          /genre         |   GET   |             Liste, aller Genres            |     text/plain     |  application/json  |
|                         |   POST  |            Erstellt neues Genre            |  application/json  |  application/json  |
|                         |  DELETE |              Löscht Musikgenre             |     text/plain     |     text/plain     |
|                         |   PUT   |           Ändern des Musikgenres           |  application/json  |  application/json  |
|    /user/{:id}/class    |   GET   |         Liste, aller Nutzerklassen         |     text/plain     |  application/json  |
| /user/{:id}/class/{:id} |  DELETE |             Löscht Nutzerklasse            |     text/plain     |     text/plain     |
|                         |   POST  |         Erstellt neue Nutzerklasse         |  application/json  |  application/json  |
|                         |   PUT   |             Ändert Nutzerklasse            |  application/json  |  application/json  |
|         /artists        |   GET   |          Liste, aller Interpreten          |     text/plain     |  application/json  |
|                         |   PUT   |              Ändert Interpret              |  application/json  |  application/json  |
|                         |  DELETE |             Löscht Interpreten             |     text/plain     |     text/plain     |
|                         |   POST  |         Erstellt neuen Interpreten         |  application/json  |  application/json  |
|          /queue         |   GET   |         Zeigt komplette Warteliste         |     text/plain     |  application/json  |
|                         |   POST  |    Fügt neues Lied der Warteliste hinzu    |  application/json  |  application/json  |
|       /queue/:{id}      |   PUT   |       Ändert Lied aus der Warteliste       |  application/json  |  application/json  |
|                         |  DELETE |       Löscht Lied aus der Warteliste       |     text/plain     |     text/plain     |