var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res) {
  res.render('customs-world', { title: 'Express' });
});

module.exports = router;
