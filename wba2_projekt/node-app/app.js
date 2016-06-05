var express        = require('express');
var bodyParser     = require('body-parser');

var app = express();
app.use(bodyParser.json());

app.use('/api', require('./routes'));

app.listen(3000);

module.exports.express = app;