var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res) {
	console.log("inside buyer log");
  res.render('buyer-nestleFinancePO', { title: 'Express' });
});

module.exports = router;
