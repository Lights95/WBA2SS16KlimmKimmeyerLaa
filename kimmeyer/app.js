//Importieren der Module
var fs = require('fs');
var chalk = require('chalk')


//Einlesen der wolkenkratzer datei
fs.readFile("wolkenkratzer.json", function(err,data){
    //Verhalten bei Error
    if(err){
        return console.error(err);
    }
    //Verhalten bei Inhalt
    var wolkenkratzer= JSON.parse(data.toString());
    //Länge des Arrays
    var anzahlWk =wolkenkratzer.wolkenkratzer.length;
    /** for(i=0; i<anzahlWk;i++){
        console.log("Name: "  + chalk.blue(wolkenkratzer.wolkenkratzer[i].name));
        console.log("Stadt: " + chalk.red(wolkenkratzer.wolkenkratzer[i].stadt));
        console.log("Hoehe: " + chalk.green(wolkenkratzer.wolkenkratzer[i].hoehe + "m"));
        console.log("--------------------");   
    }  **/

//erzeugen neuer Variable, für sortierte Daten
var wolkenkratzer_sortiert ={};

//Sortierung    
wolkenkratzer_sortiert.wolkenkratzer = wolkenkratzer.wolkenkratzer.sort(function(wka, wkb){
    if(wka.hoehe< wkb.hoehe){
       return -1;
    } 
    if(wka.hoehe > wkb.hoehe){
        return 1;
    }
    return 0;
});
    
//Ausgeben der Datei    
fs.writeFile('wolkenkratzer_sortiert.json', JSON.stringify(wolkenkratzer_sortiert), function(err) {
    if (err) {
        return console.error(err);
    }
    for (i= 0; i<anzahlWk; i++) {
        console.log("Name: "  + chalk.blue(wolkenkratzer_sortiert.wolkenkratzer[i].name));
        console.log("Stadt: " + chalk.red(wolkenkratzer_sortiert.wolkenkratzer[i].stadt));
        console.log("Hoehe: " + chalk.green(wolkenkratzer_sortiert.wolkenkratzer[i].hoehe + "m"));
        console.log("--------------------");
    }
    });
});