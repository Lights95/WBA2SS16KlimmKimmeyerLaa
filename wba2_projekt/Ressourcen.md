|     Ressource     	| Methode 	|                  Semantik                 	| content-type (req) 	| content-type (res) 	|
|:-----------------:	|:-------:	|:-----------------------------------------:	|:------------------:	|:------------------:	|
| /user             	| GET     	| Liste, aller vorhandenen Benutzer         	| text/html          	|        text/html            	|
| /user/:id         	| POST    	| Erstellt neuen User mit ID                	|                    	|                    	|
|                   	| GET     	| Gibt Benutzer mit ID aus                  	|                    	|                    	|
|                   	| DELETE  	| Löscht Benutzer mit bestimmter ID         	|                    	|                    	|
| /songs            	| GET     	| Liste, aller Songs                        	|                    	|                    	|
| /songs/:id        	| GET     	| Gibt Infos über die ID bestimmten Song an 	|                    	|                    	|
|                   	| POST    	| Fügt neuen Song hinzu                     	|                    	|                    	|
|                   	| DELETE  	| Löscht bestimmten Song                    	|                    	|                    	|
| /songs/name/genre 	| GET     	| Liste, aller Songs von bestimmten Genre   	|                    	|                    	|
|                   	| POST    	| Erstellt neues Genre                      	|                    	|                    	|
|                   	| DELETE  	| Löscht Musikgenre                         	|                    	|                    	|
| /user/:id/class   	| GET     	| Liste, aller Nutzerklassen                	|                    	|                    	|
|                   	| DELETE  	| Löscht Nutzerklasse                       	|                    	|                    	|
|                   	| POST    	| Erstellt neue Nutzerklasse                	|                    	|                    	|