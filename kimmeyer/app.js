var fs = require('fs');
var chalk = require('chalk')
fs.readFile("wolkenkratzer.json", function(err,data){
    if(err){
        return console.error(err);
    }
    var wolkenkratzer= JSON.parse(data.toString());
    var anzahlWk =wolkenkratzer.wolkenkratzer.length;
    /** for(i=0; i<anzahlWk;i++){
        console.log("Name: "  + chalk.blue(wolkenkratzer.wolkenkratzer[i].name));
        console.log("Stadt: " + chalk.red(wolkenkratzer.wolkenkratzer[i].stadt));
        console.log("Hoehe: " + chalk.green(wolkenkratzer.wolkenkratzer[i].hoehe + "m"));
        console.log("--------------------");   
    }  **/


var wolkenkratzer_sortiert ={};

wolkenkratzer_sortiert.wolkenkratzer = wolkenkratzer.wolkenkratzer.sort(function(wka, wkb){
    if(wka.hoehe< wkb.hoehe){
       return -1;
    } 
    if(wka.hoehe > wkb.hoehe){
        return 1;
    }
    return 0;
});
    
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