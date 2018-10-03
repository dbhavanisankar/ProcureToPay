var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res) {
	console.log("inside nestlefp");
  res.render('buyer-NestleFP', { title: 'Express' });
});

module.exports = router;
