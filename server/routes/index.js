var router = require('express').Router();
var path = require('path');

router.get('/', function(req, res, next) {
  res.send('hello');
})

module.exports = router;