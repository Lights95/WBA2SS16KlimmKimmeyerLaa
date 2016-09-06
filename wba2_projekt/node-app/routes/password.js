var express = require('express');
var redis = require('redis');
var Ajv = require('ajv');
var router = express.Router();
var db = redis.createClient();
var ajv = Ajv({allErrors: true});

/*Songsschema*/
var passwordSchema={
    'properties': {
        'pass':{
            'type': 'string',
            'minLength': 6
        }
    },
    'required': ['pass']
};

//Validierungsvariable
var validate = ajv.compile(passwordSchema);

router.put('/', function(req, res){
  var valid = validate(req.body);
  if(!valid) return res.status(406).json({message: "Ungültiges Schema!"});
  var pass = req.body;
    db.set('password:' + "admin" , JSON.stringify(pass), function(err,rep){
      if(err) res.status(400).mess("Something went wront");
      else res.status(201).json(pass);
    });
});

router.get('/', function(req, res){
  db.get('password:'+ "admin", function(err,rep){
      if(rep){
          res.status(200).type('json').send(rep);
      }
      else{
        var pass={"pass":"HALLOHA"};
        db.set('password:' + "admin" , JSON.stringify(pass), function(err,rep){
          if(err) res.status(400).mess("Something went wront");
          else res.status(201).json(pass);
        });
      }
  });
});







module.exports = router;
