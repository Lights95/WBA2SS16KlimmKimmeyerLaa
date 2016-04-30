var fs = require('fs');
var chalk = require('chalk');

fs.readFile('wolkenkratzer.json', function (err, data) {
   if (err) {
       return console.error(err);
   }
   var wolkenkratzer = JSON.parse(data.toString());
   var wolkenkratzerAnzahl = wolkenkratzer.wolkenkratzer.length;

   for (var i= 0; i<wolkenkratzerAnzahl; i++) {
     console.log("Name: "  + chalk.red(wolkenkratzer.wolkenkratzer[i].name));
     console.log("Stadt: " + chalk.blue(wolkenkratzer.wolkenkratzer[i].stadt));
     console.log("Hoehe: " + chalk.green(wolkenkratzer.wolkenkratzer[i].hoehe + "m"));
     console.log("--------------------");
   }
});
