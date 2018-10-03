//*** (IMPORTS STARTS ) ****
var update = require('./invoke.js');
var query = require('./query.js');
//***  IMPORTS ENDS ****
exports.invoke = function (request,reply) {
	console.log('the function='+request.body.header.event_const);
	var header = request.body.header.event_const;
	var jsonblob = request.body.jsonblob;
	console.log("Header value:"+header);
	var fnName;
	if(header === "CNST_PURCHASE_ORDER"){
		console.log("In route js entered and stored CreatePurchaseOrder function");
		fnName = "CreatePurchaseOrder";
	}
	if(header === "CNST_CREATEITEMS"){
        console.log("In route js entered and stored CreateItems function");
        fnName = "CreateItems";
	}
	if(header === "CNST_UPDATE_ITEMFOR_SUPPLIER"){
		console.log("In route js entered and stored UpdateItemForSupplier function");
		fnName = "UpdateItemForSupplier";
	}
	if(header == "CNST_UPDATE_BILLOFLADING"){
        console.log("In route js entered UpdateBillOfLading function");
        var fnName = "UpdateBillOfLading";
    }
	if(header == "CNST_UPDATE_POE_CUSTOMS"){
        console.log("In route js entered update POE Customs function");
        var fnName = "UpdatePoECustoms";
    }
	if(header == "CNST_UPDATE_INVOICE"){
        console.log("In route js entered update Invoice function");
        var fnName = "UpdateInvoice";
    } 
	//if(header == "CNST_CreateGNR"){
      //  console.log("In route js entered update Invoice function");
        //var fnName = "CreateGNR";
    //}
	console.log("Function name at Routes layer:"+fnName);
	update.invokeSDK(fnName,jsonblob,reply);
}

// ***  ( QUERY SDK METHODS STARTS ) ***//      
exports.queryGetAllPurchaseOrders = function (request,reply) {
	var fnName = "GetAllPurchaseOrders";
	console.log("Routing "+fnName+ " contract");
	query.querySDK(fnName, request, reply);
}
exports.queryGetPurchaseOrder = function (request,reply) {
  var fnName = "GetPurchaseOrder";
  query.querySDK(fnName, request, reply);
}
exports.queryGetItemForSupplier = function (request,reply) {
	var fnName = "GetItemForSupplier";
	//var fnName = "ListAllTransactionEvent";
	query.querySDK(fnName, request, reply);
}
 exports.queryCreateGNR = function (request,reply) {
      var fnName = "CreateGNR";
      query.querySDK(fnName, request, reply);
} 
exports.querygetVehicleDetails_EngineNo = function (request,reply) {
    var fnName = "getVehicleDetails_EngineNo";
    query.querySDK(fnName, request, reply);
    }
exports.querygetOwnershipTransferDetails = function (request,reply) {
    var fnName = "getOwnershipTransferDetails";
    query.querySDK(fnName, request, reply);
    }
exports.querygetReceiverDetails = function (request,reply) {
    var fnName = "getReceiverDetails";
    query.querySDK(fnName, request, reply);
    }











