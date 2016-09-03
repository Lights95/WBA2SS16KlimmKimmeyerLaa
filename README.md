# MUSIQUEUE

Webbasierte Anwendungen 2 - Verteilte Systeme SS16

Dieses Wiki dokumentiert die Arbeiten der Studenten:

* Marvin Klimm
* Johannes Kimmeyer
* Lena Laaser

Betreuer sind:

* Sheree Saßmannshausen
* Jorge Pereira

##Projektidee

###"Musiqueue - Die Partyplaylist"
Niklas feiert gerne Partys, doch er findet es doof, dass er immer die Songs die der DJ auswählt hören muss. Er selbst veranstaltet demnächst auch eine Party, möchte das ganze aber lieber anders handhaben. Seine Idee ist es, dass jeder sich ein bestimmtes Lied wünschen kann und das ganze dann automatisch in die Playlist eingefügt wird.
Zudem würde er sich gerne im Nachhinein die Playlist des Abends angucken, um neue Musik für sich zu finden.  

###Problem:
Niklas möchte gerne ein System haben, mit Hilfe dessen er sich und seinen Gästen die Möglichkeit gibt, sich Songs zu wünschen. Doppelte Lieder oder Lieder, die schon einmal gespielt wurden, sollen dabei selbst verständlich ignoriert werden. Es ist Niklas aber auch noch sehr wichtig dabei, dass er immer noch die Entscheidungsgewalt besitzt, welche Lieder gespielt werden.

##Starten der Webanwendung, des Servers und des Clients
1.) */wba2_projekt/node-app/* : 

redis-server starten, bitte im node-app Ordner unter Verwendung einer nicht leeren Datenbank(dump.rdb wird mitgegeben)

2.) */wba2_projekt/node-app/* :  
node app.js starten  
3.) */wba2_projekt/node-dienstnutzerSOCKET/* :  
node app.js starten  
4.) *Browser* :  
http://localhost:8080/ aufrufen
