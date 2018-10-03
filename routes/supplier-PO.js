var express = require('express');
var router = express.Router();

/* GET home page. */

router.get('/', function(req, res) {
console.log("inside index.js");
  res.render('supplier-PO', { title: 'Express' });
});

module.exports = router;
