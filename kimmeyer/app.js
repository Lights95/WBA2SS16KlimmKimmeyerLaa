var fs = require('fs');
var chalk = require('chalk')
fs.readFile("wolkenkratzer.json", function(err,data){
    if(err){
        return console.error(err);
    }
    var wolkenkratzer= JSON.parse(data.toString());
    var anzahlWk =wolkenkratzer.wolkenkratzer.length;
    for(i=0; i<anzahlWk;i++){
        console.log("Name: "  + chalk.blue(wolkenkratzer.wolkenkratzer[i].name));
        console.log("Stadt: " + chalk.red(wolkenkratzer.wolkenkratzer[i].stadt));
        console.log("Hoehe: " + chalk.green(wolkenkratzer.wolkenkratzer[i].hoehe + "m"));
        console.log("--------------------");   
    }
    
    
})