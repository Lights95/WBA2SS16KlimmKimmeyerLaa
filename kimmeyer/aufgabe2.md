#WBA2- XML

1. Erklären Sie die Unterschiede geläufiger Standards für Zeichensätze im Web!
2. Erklären Sie das Konzept von Auszeichnungssprachen (Markup Languages)!
3. Was versteht man unter Marshalling?
4. Erklären Sie die Rolle und Bedeutung von Schemasprachen für den Datenaustausch im Web!
5. Erklären Sie den Unterschied zwischen Wohlgeformtheit und Gültigkeit von XML Dokumenten!
6. Was ist ein Element in einem XML Dokument?
7. Erklären Sie das Konzept der namespaces!
8. Erklären Sie den folgenden regulären Ausdruck recipe (title,date,ingredient *,preparation,comment?,  nutrition,related*)!
9. Entwerfen Sie eine XML Sprache für Fahranweisungen. Als Beispiel für Fahranweisungen mag driving.txt dienen. Auch wenn grob-granulare Lösungen möglich sind, sollte hier eine fein-granulare Lösung entwickelt werden, damit eine automatische Verarbeitung etwa durch einen "Navigationsasssistenten" möglich wäre. Konvertieren Sie driving.txt in die von Ihnen entwickekte XML Sprache!
10. Entwerfen Sie eine Schemasprache für die in der vorigen Aufgabe entwickelte XML Sprache!
11. Schreiben Sie ein gültiges Instanzdokument für das Schema movies.xsd, das jedes deklarierte Element mindestens einmal verwendet!
12. Betrachten Sie die XML Schema Definition der Sprache XSLT 2.0 (Auch wenn eine Auseinandersetzung mit der Sprache XSLT in diesem Kapitel sinnvoll wäre, ist ein Verständnis von XSLT zur Bearbeitung der Übungsaufgabe nicht erforderlich)!
	- Erklären Sie die Definition des comment Elements inklusive der Typen auf die die Definition Bezug nimmt!
	- Erklären Sie das Inhaltsmodell des function Elements! 

	
**1.)**

ASCII --> keine Umlaute	 
EASCII --> Sonderzeichen verschiedener Sprachen

bezieht sich auf einzelne Sprachen, unterscheiden sich in Codelänge(bis zu 32 bit) um auf verschiedene kulturelle Sprachen zuzugreifen. Heutzutage wird Unicode verwendet. Unterscheidet sich in den möglichen Darstellungen.

**2.)**
System zur Annotation von Texten, bei dem Annotation und Text von einander unterschieden werden können

- verschiedene Markupsprachen
 	- Präsentations Markup -> das hier
 	- Prozedurale Markup -> an Verarbeitung(Formatieren: Zeilenabstände)
 	- Deskriptive Markup -> was ist ein Stück Text(Überschrift, Text, etc.), Trennung von deskriptiven Auszeichnung und gleichzeitig Formatierung


**Weitere Wichtige Inhalte**

XML --> mächtigste Weg um zu beschreiben

kann andere Sprachen definieren - Metasprache
mit jeglichen SChriftzeichen verfassbar


wohlgeformtheit: 
	
- es gibt nur ein Wurzelelement
- nichtleere Elemente: öffnendes und schließendes Element
- Attributwerte durch ' oder " eingeschlossen
- Elemente, die nicht Wurzel sind von umgehenden umschlossen sein
- alle Zeichen entsprechen Zeichensatz

Ersatzdarstellungen, falls ein Zeichen das XML auslöst

- unstrukturiert: Videos, Bilder
- strukturiert: Daten mit Bedeutung, Daten in Datenbanken
- Form der Struktur von XML wählbar
- Namen nicht weltweit eindeutig
- Überladung von Namen -> Namensräume

Eigenen Namensraum:

- Präfix definieren
- Präfix an URI binden
- nur eindeutiger Name sein
- foo auf URI festlegen(XHTML)
- XHTML Tags durch foo:HTMLTAG definiert


**3.)**
Marshalling: Objekte werden in XML umgewandelt und wieder in ein Objekt zurückgewandelt.

Umwandlung von strukturierten oder elementaren Daten in ein Format das die Übermittlung an andere Prozesse ermöglicht.

**4.)**

**5.)**
Wohlgeformt: syntaktisch korrekt, hält sich an die Regeln, während gültig eher Validierbarkeit ggü. der DTD Regeln beschreibt

**6.)**
Jedes Element ist ein Teilbaum

**7.)**
Eigenen Namensraum:

- Präfix definieren
- Präfix an URI binden
- nur eindeutiger Name sein
- foo auf URI festlegen(XHTML)
- XHTML Tags durch foo:HTMLTAG definiert

Ordnet festgelegte Tags eindeutig zu

**8.)**
Wurzel: recipe
Elemente: title, date, ingredient(mehrere Instanzen), preparation, comment(muss nicht vorhanden sein), nutrition, related(mehrere Instanzen)

**9.)-12.)** extra Dokument

