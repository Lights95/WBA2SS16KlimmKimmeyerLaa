var express = require('express');
var router = express.Router();

//Routes angelegt
router.use('/users',require('./routes/users'));
router.use('/artists',require('./routes/artists'));
router.use('/queue',require('./routes/queue'));
router.use('/genres',require('./routes/genres'));
router.use('/songs',require('./routes/songs'));

module.exports = router;
