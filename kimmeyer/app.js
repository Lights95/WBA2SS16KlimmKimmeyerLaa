var fs = require('fs');
fs.readFile("wolkenkratzer.json", function(err,data){
    if(err){
        return console.error(err);
    }
    var wolkenkratzer= JSON.parse(data.toString());
    var anzahlWk =wolkenkratzer.wolkenkratzer.length;
    for(i=0; i<anzahlWk;i++){
        console.log("Name: "  + wolkenkratzer.wolkenkratzer[i].name);
        console.log("Stadt: " + wolkenkratzer.wolkenkratzer[i].stadt);
        console.log("Hoehe: " + wolkenkratzer.wolkenkratzer[i].hoehe + "m");
        console.log("--------------------");   
    }
    
    
})