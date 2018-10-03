var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res) {
  res.render('supplier-PODescription', { title: 'Express' });
});

module.exports = router;
