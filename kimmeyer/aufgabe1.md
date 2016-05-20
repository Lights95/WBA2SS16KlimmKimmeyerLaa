    1 Die die fünf wesentlichen Elemente des frühen Web, die immer noch die Kernelemente des modernen Web sind!
	2	Beschreiben Sie Vor- und Nachteile von Browser-basierten Anwendungen im Vergleich zu installierten Anwedungen!
	3	Was versteht man unter dem Begriff Request for Comments (RFC)?
	4	Was versteht man unter dem Client/Server Paradigma der Interaktion? Wie ist es vom peer-to-peer Paradigma abzugrenzen?
	5	Beschreiben Sie Aufbau und Rolle des Uniform Ressource Locator!
	6	Was versteht man unter dem Begriff Ressource?
	7	Was versteht man unter URL, URN, URI?
	8	Was ist die Rolle und sind die Vorteile des Domain Name System?
	9	Beschreiben Sie die wesentlichen Schritte des domain name address resolution process!
	10	Wie viele request Operationen werden zum Anzeigen einer einzelnen Web Seite ausgeführt?
	11	Erklären Sie den Unterschied zwischen statischen und dynamischen Web Seiten!
	12	Erklären sie die Begriffe Anwendungslogik und Präsentationslogik!
	13	Erklären Sie das Konzept der HTTP Status Codes!
	14	Was versteht man unter einem Servlet?

1)
Uniform Resource Locator - eindeutige Identifikation einer Ressource
HTTP - HyperText Transfer Protocol —> Ablauf Anfragen und Antworten
Software Programm, das auf HTTP Anfragen antworten kann
HTML - HyperText Markup Language um Dokumente zu veröffentlichen
Browser - sendet HTTP Requests und kann HTML darstellen

2)
+erreichbar von jedem mit dem Internet verbundenen Gerät
+benutzbar mit verschiedenen Zugriffssystemen und Browsern
+nur Server Software muss geupdatet werden, nichts bei Clients
+Speicher auf dem Server —> geringere Sicherheitsbedenken gegenüber lokalem Speicher
- man braucht zwingend eine Internetverbindung(nicht immer vorhanden)
-manche Websiten sehen auf verschiedenen Browsern nicht richtig aus
-Einschränkungen beim Zugriff auf das ausführende System kann zu Problemen mit dem Installieren von Software und Hardware führen. 

3)RFC - Request for Comments
Hier werden Richtlinien für das Internet festgehalten.

4)Client- Server Model
Server 24h am Tag online
Client stellt Requests und gibt Responses zurück
Request - Response
Peer to Peer:
direkter Austausch zwischen zwei Computern
jeder Computer—> Client und Server
keiner muss den ganzen Tag online sein

Client Server Modell vergibt eindeutige Rollen

5)URL - Uniform Resource Locator
Protocol - Domain - Path - Query - String - Fragment
Wird benötigt damit der Server weiß wo er nach der Datei gucken muss - identifiziert die Position von Ressourcen

6) Ressource
Alles was Identität hat, in dem Sinne, dass es eine Quelle für Beschreibungen über sich sein kann. (wikipedia)

7)URL - Uniform Resource Locator
URI - Uniform Resource Identifier
URN- Uniform Resource Name

8)wandelt IP - Adressen in Namen umgewandelt
geht von rechts nach links —> von Top- Level domain runter
man kann alles mit Name ansprechen und braucht keine IP - Adressen mehr

9)
1. Domain wird aufgerufen - im Cacheserver wird überprüft ob die IP - Adresse für den Namen schon da ist+
2. DNS Resolver wird verwendet um IP - Adresse rauszufinden, hier ebenfalls cache 
3. muss DNS- Server nach Hilfe fragen, überprüft ob IP Adresse im lokalen DNS Server aufgelöst ist
4. muss andere DNS Server fragen, große Redundanz, daher viele Alternativen
5. DNS Server findet die Antwort nicht, wird an Top Level Server weitergegeben
6. wenn TLD server auch keine Antwort hat, Root name server 
7. nach erhalten der TLD Server Adresse —> TLD Server wird nach Domain gefragt, dieser besitzt die Adresse aufgrund des domain registration process
8. userlokaler DNS Server kann jetzt den DNS Server nach der IP Adresse fragen, Namenauflösung wird in Cache gespeichert
9.browser erhält vermutlich richtige IP Adresse oder erhält eine Fehlermeldung
10. Anfrage an Webserver kann gestellt werden

10) steht nirgendwo

11)statisch: feste seiten, sehen für alle User gleich aus
dynamisch: Inhalt wird dynamisch erstellt, Programme auf Server am Laufen

12)Anwendungslogik: alles mit Funktion
Präsentationslogik: Wie sieht etwas aus, Präsentationsmerkmale wie Schrift, Farbe etc.

13)HTTP Codes geben Rückmeldung über Anfrage
2## Erfolgreich
3## Weiterleitungen 
4## Client Errors
5## Server Errors

14) JAVA Klassen, deren Instanzen auf Webserver Anfragen von Clients bekommen und beantworten
