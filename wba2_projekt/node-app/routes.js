var express = require('express');
var router = express.Router();

//Routes angelegt
router.use('/password',require('./routes/password'));
router.use('/artists',require('./routes/artists'));
router.use('/queue',require('./routes/queue'));
router.use('/genres',require('./routes/genres'));
router.use('/songs',require('./routes/songs'));
module.exports = router;
