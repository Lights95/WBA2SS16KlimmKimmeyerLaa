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

   var wolkenkratzer_sortiert = {};

   wolkenkratzer_sortiert.wolkenkratzer = wolkenkratzer.wolkenkratzer.sort(function (a, b) {
      if (a.hoehe > b.hoehe) {
        return 1;
      }
      if (a.hoehe < b.hoehe) {
        return -1;
      }
      // a must be equal to b
      return 0;
  });

  fs.writeFile('wolkenkratzer_sortiert.json', JSON.stringify(wolkenkratzer_sortiert, null, 2),  function(err) {
     if (err) {
         return console.error(err);
     }
     console.log("Geschrieben!");
     for (i= 0; i<wolkenkratzerAnzahl; i++) {
       console.log("Name: "  + chalk.red(wolkenkratzer_sortiert.wolkenkratzer[i].name));
       console.log("Stadt: " + chalk.blue(wolkenkratzer_sortiert.wolkenkratzer[i].stadt));
       console.log("Hoehe: " + chalk.green(wolkenkratzer_sortiert.wolkenkratzer[i].hoehe + "m"));
       console.log("--------------------");
     }
  });
});
