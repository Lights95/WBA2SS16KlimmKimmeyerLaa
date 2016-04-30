var fs = require('fs');

/*Wo genau liegt der theoretische Unterschied in der Asynchronen und Synchronen Variante*/
/*var wolkenkratzer = JSON.parse(fs.readFile('wolkenkratzer.json'));*/

fs.readFile('wolkenkratzer.json', function (err, data) {
   if (err) {
       return console.error(err);
   }
   var wolkenkratzer = JSON.parse(data.toString());
   var wolkenkratzerAnzahl = wolkenkratzer.wolkenkratzer.length;

   for (var i= 0; i<wolkenkratzerAnzahl; i++) {
     console.log("Name: " + wolkenkratzer.wolkenkratzer[i].name);
     console.log("Stadt: " + wolkenkratzer.wolkenkratzer[i].stadt);
     console.log("Hoehe: " + wolkenkratzer.wolkenkratzer[i].hoehe + "m");
     console.log("--------------------");
   }
});
/*wolkenkratzer = JSON.parse(wolkenkratzer);

var wolkenkratzerAnzahl = wolkenkratzer.wolkenkratzer.length;

for (var i= 0; i<wolkenkratzerAnzahl; i++) {
  console.log("Name: " + wolkenkratzer.wolkenkratzer[i].name);
  console.log("Stadt: " + wolkenkratzer.wolkenkratzer[i].stadt);
  console.log("Hoehe: " + wolkenkratzer.wolkenkratzer[i].hoehe + "m");
  console.log("--------------------");
}*/
