var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res) {
	console.log("inside buyer-PORecordDescription");
  res.render('buyer-PORecordDescription', { title: 'Express' });
});

module.exports = router;
