
var express = require ('express');
var app= express();
var bodyParser = require('body-parser');
var mysql  = require('mysql');
 var dbconn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'blockactivity'
}); 


var hfc = require('fabric-client');
var path = require('path');
var util = require('util');
exports.queryblockSDK = function (fnName,par_txnId,reply,blockjson) {
    var func_name = fnName;
    
    console.log ("Function name received:"+func_name + " transaction id received to block activity:"+par_txnId);
  
    var options = {
        wallet_path: path.join(__dirname, './creds'),
        user_id: 'PeerAdmin',
        channel_id: 'mychannel',
        chaincode_id: 'Nestle',
        network_url: 'grpc://192.168.99.100:7051',
    };
    var channel = {};
    var client = null;
    Promise.resolve().then(() => {
       console.log("Create a client and set the wallet location");
    client = new hfc();
    return hfc.newDefaultKeyValueStore({ path: options.wallet_path });
    }).then((wallet) => {
        console.log("Set wallet path, and associate user ", options.user_id, " with application");
    client.setStateStore(wallet);
    return client.getUserContext(options.user_id, true);
    }).then((user) => {
        console.log("Check user is enrolled, and set a query URL in the network");
    if (user === undefined || user.isEnrolled() === false) {
        console.error("User not defined, or not enrolled - error");
    }
    channel = client.newChannel(options.channel_id);
    channel.addPeer(client.newPeer(options.network_url));
    return;
    }).then(() => {
    console.log("Query Function to be called....");
    var transaction_id = client.newTransactionID();
  
    
    if(func_name === "trackblockactivity"){

        return channel.queryTransaction(par_txnId)

       
   }
  
    	
    }).then((query_responses) => {


    //	console.log(util.inspect(query_responses, false, null)) //uncomment to check the entire json response for transaction
	var txnid = query_responses.transactionEnvelope.payload.header.channel_header.tx_id;
	var version = query_responses.transactionEnvelope.payload.header.channel_header.version;
	var timestamp = query_responses.transactionEnvelope.payload.header.channel_header.timestamp;
	var txn_type  = query_responses.transactionEnvelope.payload.header.channel_header.type;
	var payload =  blockjson;
	console.log("blockjson",blockjson);
	//var abcRwset = query_responses.transactionEnvelope.payload.data.actions[0].payload.action.proposal_response_payload.extension.results.ns_rwset
   // .find(rwset => rwset.namespace === 'trai');

	//var blockNumber = abcRwset.rwset.reads[0].version.block_num;

	blockNumber ="";
	var urlencodedParser = bodyParser.urlencoded({ extended: false })

	app.use(express.static('public'));

	var db_list = {type:"INVOKE",txn_id: txnid,chaincode_id : "Nestle",payload: payload,version : version,bc_timestamp : timestamp,txn_type : txn_type, deployments: "0" ,invocations:"1",block_id:blockNumber }
	    dbconn.query('insert into blocks set?',db_list); 

	  // console.log("Insertion done in Blockchain");
	   console.log("************************TRANSACTION LOG STARTS*********************************************");
	   console.log("Block Id: "+ blockNumber);
	   console.log("Type : ","INVOKE");
	   console.log("Transaction ID : ", txnid);
	   console.log("Chaincode ID : ","Nestle");
	   console.log("Payload : ", payload);
	  // console.log("Version : ",version);
	   console.log("Transaction Time stamp : ", timestamp);
	 //  console.log("Transaction Type : ", txn_type);
	   console.log("************************TRANSACTION LOG ENDS**********************************************");


	
	if (!query_responses.length) {
		console.log("No payloads were returned from query");
    } else {
    	console.log("Query result count = ", query_responses.length)
    }
    if (query_responses[0] instanceof Error) {
    	console.error("error from query = ", query_responses[0]);
    }
  
    }).catch((err) => {
    	console.error("Caught Error", err);
    	reply.send ("Caught Error", err);
    });
}
