/************************************************************ 
COPY RIGHTS TO TECH MAHINDRA
************************************************************/

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var fs = require('fs');
var swig = require('swig');
var pdf = require('html-pdf');
var ejs= require('ejs');
var cookieParser = require('cookie-parser');
var expressSession= require('express-session');
var bodyParser = require('body-parser');
var util = require('util');
var cons = require('consolidate');
var crypto = require('crypto');
var formidable = require('formidable');
var routes = require('./routes/index');
var users = require('./routes/user');
var route = require('./route.js');
// for encryption of password
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = 'd6F3Efeq';


var app = express();
app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(cookieParser());
app.use(expressSession(
{secret:'string',
saveUninitialized:true,
resave:true}

));
var bodyParser = require('body-parser').json();
var env = process.env.NODE_ENV || 'development';


//var home_page =  require('./routes/login-trai');
var buyer_login =  require('./routes/buyer-login');
var buyer_nestleFP =  require('./routes/buyer-nestleFP');
var buyer_nestleFinancePO =  require('./routes/buyer-nestleFinancePO');
var buyer_PORecordDescription =  require('./routes/buyer-PORecordDescription');
var supplier_login =  require('./routes/supplier-login');
var supplier_details =  require('./routes/supplier-details');
var supplier_PO =  require('./routes/supplier-PO');
var supplier_PODescription =  require('./routes/supplier-PODescription');
var customs_login =  require('./routes/customs-login');
var customs_world =  require('./routes/customs-world');
var transport_login =  require('./routes/transport-login');
var transport_PO =  require('./routes/transport-PO');


app.locals.ENV = env;
app.locals.ENV_DEVELOPMENT = env === 'development';

// view engine setup

// app.set('views', path.join(__dirname, 'views'));

// app.set('view engine', 'ejs');


app.engine('html',cons.swig);

 

app.set('views', path.join(__dirname, 'views'));

 

app.set('view engine', 'html');


/* modifications for html */ 


	
// modification for session storage ends here


app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

//app.use('/login-trai',home_page);
app.use('/buyer-login.html',buyer_login);
app.use('/buyer-nestleFP.html',buyer_nestleFP);
app.use('/buyer-nestleFinancePO.html',buyer_nestleFinancePO);
app.use('/buyer-PORecordDescription.html',buyer_PORecordDescription);
app.use('/supplier-login.html',supplier_login);
app.use('/supplier-details.html',supplier_details);
app.use('/supplier-PO.html',supplier_PO);
app.use('/supplier-PODescription.html',supplier_PODescription);
app.use('/customs-login.html',customs_login);
app.use('/customs-world.html',customs_world);
app.use('/transport-login.html',transport_login);
app.use('/transport-PO.html',transport_PO);

app.use('/billoflading', express.static(__dirname + '/views/BillOfLading.pdf'));
app.use('/POEClearance', express.static(__dirname + '/views/POEClearance.pdf'));
app.use('/openpdfInvoice', express.static(__dirname + '/views/openpdfInvoice.pdf'));



app.get('/query/GetItemForSupplier/:arg1',function(req,res){
//  console.log("req: jax: ");
                 route.queryGetItemForSupplier(req,res);

})



app.get('/query/GetAllPurchaseOrders',function(req,res){

                 route.queryGetAllPurchaseOrders(req,res);
})

app.get('/query/GetPurchaseOrder/:arg1',function(req,res){
  //console.log("req: jax: "+req.params.arg1);
                 route.queryGetPurchaseOrder(req,res);

})
app.get('/query/CreateGNR/:arg1',function(req,res){
console.log("req: jax: "+req.params.arg1);
          route.queryCreateGNR(req,res);

})
/* app.get('/query/getOwnershipTransferDetails/:arg1',function(req,res){
  //console.log("req: jax: "+req.params.arg1);
                 route.querygetOwnershipTransferDetails(req,res);

})
app.get('/query/getReceiverDetails/:arg1',function(req,res){
  //console.log("req: jax: "+req.params.arg1);
                 route.querygetReceiverDetails(req,res);

}) */
app.post('/invoke',function(request,reply){
	route.invoke(request,reply);
})

//Code to generate pdf starts here
app.post('/createpdfForm', function (req, res) {
console.log("inside creste pdf form ajax");
if(req.body.par_flag=="pdf")
{
//function createPDF(req, res, next){
console.log("inside create PDF");
   var userData = req.body;
  console.log("Incoming Data", userData);

  var options = {
      height: "11in",
      width: "15in",
      type: "pdf",
      orientation: "portrait",
      border: {
        "top": "10mm",            // default is 0, units: mm, cm, in, px
        "right": "10mm",
        "bottom": "0mm",
        "left": "10mm"
      }
   };

   var ejsLoc = path.join(__dirname, './views/htmltry.ejs');
   var pdfLoc = path.join(__dirname, './pdf/Form22.pdf');

    res.render(ejsLoc, { "user" : userData }, function (err, HTML) {
      if(err){
       // return res.status(400).send(err);
   res.status(400)
      } else {
        console.log("HTML created for the user data");
		console.log("path of pdf is:"+pdfLoc);
		console.log("ejs file location:"+ejsLoc);
        pdf.create(html, options).toFile(pdfLoc, function (err, result) {
           if (err) {
              console.log("res.status"+res.status);
  res.status(400)
  // return res.status(400).send(err);
 
           } else {
             console.log("PDF created for the user data using the HTML template");
             res.status(200).send("PDF created successfully");
           }
       })
      }
    });
}
});



//Code to generate pdf ends here

if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}


/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        title: 'error'
    });
});

app.set('port', process.env.PORT || 3000);

var server = app.listen(app.get('port'), function() {

  console.log('Express server listening on port ' + server.address().port);

});


module.exports = app;
