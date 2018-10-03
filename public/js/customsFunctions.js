/* var poID;
var poDate;
var maxPoId; */

function onLoadCall()
{
	setDate();
	buttonDisable();
	showAllPODetails();
	reset();
}
function buttonDisable()
{	
	document.getElementById("settleButton").disabled = true;
	document.getElementById("btnGROk").disabled = true;
	document.getElementById("txt_GR_qty").disabled = true;
	
}
function showAllPODetails()
{
	
	document.getElementById("det").innerHTML="";
	$.ajax({ 
		url:"/query/GetAllPurchaseOrders/",
		type: "get",                   //Type of request, can be PUT,POST,GET,DELETE
	    dataType: "json",        //Type of data to be sent in the body.
	    contentType: "application/json",                   
		success:function(response){ 
			var data=JSON.stringify(response);	
			$.each(response, function(i, item) {
				var rowData = JSON.stringify(item) 
				//alert("rowData :"+rowData);
				var key = item.Record.po_id;
				if(key != undefined)
			{
			var tempCenter = "";
			var status = "";
			var image = "";
			tempF1="<div class='table-responsive'><br/><center><b style='margin-left:5%;'>Purchase Order List and Status</b><br/><br/>";
			tempF2 = "<div style='height: 2%;max-height: 300px;width: 72%;overflow-y: scroll;'><table id='gradient-style' class='table table-list-search' style='width:100%;'><thead><tr align='left' style='background-color: #ffffff;'><th></th><th>P.Order.No</th><th>Order Description</th><th>Date</th><th>Quantity</th><th>Goods Status</th><th></th></tr></thead><tbody>";
			tempFirst = tempF1 + tempF2;
			for(i = 0;i<response.length;i++){	
				var poOrder = JSON.stringify(key);
			if(response[i].Record.po_id){
				 if(response[i].Record.status == "not sent") {
					status = "Not Received" ;
					image = "<img style='width: 25px;' src='./images/Not_send.png'/>" ;
				 }	else {  
				 	 status = "Received";
				 	 image = "<img style='width: 25px;' src='./images/Received.png'/>";
				 }
	   var response_poid=response[i].Record.po_id;
				 	 tempCenter += "<tr align='left' style='background-color: #ffffff;'>" +
							"<td><input type='radio' name='showDetails' onChange='onChangebutEnb(\""+response_poid+"\",\""+response[i].Record.item_details+"\")'></td>"+ 
							 "<td>"+ response[i].Record.po_id +"</td>" + 
							 "<td>"+ response[i].Record.item_details +"</td>" + 			  
							 "<td>"+ response[i].Record.date +"</td>" + 
							 "<td>"+ response[i].Record.qty +"</td>" + 
							 "<td style= 'align: left;'>"+ status + "</td>" +
							 "<td>"+ image + "</td></tr>" ;
				}
											
	        }
	    }
		tempLast = "</tr></tbody></table></div></center></div>";
	document.getElementById("det").innerHTML=tempFirst + tempCenter + tempLast;	
			});	
	
		},
	    error: function(jqXHR, textStatus, errorThtrown) {
			console.log(textStatus);
	        }
   
});
		
}
function onChangebutEnb(poOrder) {	
	//alert("poOrders"+poOrder);
		$.ajax({ 
		url:"/query/GetPurchaseOrder/"+poOrder,
		type: "get",                   //Type of request, can be PUT,POST,GET,DELETE
	    dataType: "json",        //Type of data to be sent in the body.
	    contentType: "application/json",                   
		success:function(response){  
			$.each(response, function(i, item) {
				console.log("success");
				var rowData = JSON.stringify(item['Record']) 
				//console.log("rowData :" + rowData);
				billoflading = response[i].Record.billOflading;
				poe_Customs = response[i].Record.poe_Customs;
				invoice = response[i].Record.invoice;
				Quantity= response[i].Record.qty;
	//			alert("billoflading"+billoflading);
		if(billoflading == "Bill Of Lading Successful" && poe_Customs == "POE Customs Successful" && invoice == "Invoice Successful")
		{
			document.getElementById("txt_GR_qty").disabled = false;
			document.getElementById("btnGROk").disabled = false;
			 $('#btnGROk').click(function() {
				 var qtyg_txt_Value = document.getElementById("txt_GR_qty").value;
		//		 alert("text box value:"+qtyg_txt_Value);
			//	 alert("Quantity"+Quantity);
				if (qtyg_txt_Value <= parseInt(Quantity))
				{
						//alert("Quantity"+Quantity);
					var qty = parseInt(Quantity) * (0.75);
					if (qtyg_txt_Value>=qty)
					{
						alert("GNR generated successfully as quantity received is more than 70% of what was requested");
						document.getElementById("settleButton").disabled = false;
					}
					else{
						alert("GNR failed to generate as quantity received is less than 70% of what was requested");
					}
					
				}
				//alert("qtyValue"+qtygValue);
			 });
			
					
		}
			});
		},
		 error: function(jqXHR, textStatus, errorThtrown) {
			console.log(textStatus);
	        }
		});	
}


function reset()
{
	document.getElementById("selectpicker").value=document.getElementById("selectpicker").option[0];
	document.getElementById("rate").value="";
	document.getElementById("qty").value="";
	document.getElementById("select_qty").value="";	
}
function createPO()
{
	//alert("create po in side")
	var today = new Date();
	var dd = today.getDate();
	var monthNames = ["January", "Feburary", "March", "April", "May", "June",
		  "July", "August", "September", "October", "November", "December"
		];
	var d = new Date();
	var mon= monthNames[d.getMonth()];
	var mm = today.getMonth()+1; 
	var yyyy = today.getFullYear();
	var yy=d.getFullYear().toString().substr(-2);
	if(dd<10) 
	{
	    dd='0'+dd;
	} 
	if(mm<10) 
	{
	    mm='0'+mm;
	} 
	today = dd+' '+mon+ ''+yyyy;
	poDate = today;
	console.log("hi");
	var qtyValue = document.getElementById("select_qty").value;
	var avaQtyValue = document.getElementById("qty").value;
	var rate =document.getElementById("rate").value;
	var newPoId;
					
	//alert(qtyValue + " " +avaQtyValue);
	if(qtyValue > avaQtyValue)
		{
			alert("Please enter the quantity, which should be lesser or equal to Quantity available for Supplier");
			document.getElementById("select_qty").value = "";
		} else {
			//Getting supplier ID from dropdown list
			if(document.getElementById("selectpicker").value == "SupplierA")
			{
				supplierId = "8888"
			} else {
				supplierId = "7777"
			}
		//console.log("rate :" +rate);
		//console.log("supplierId :" +supplierId);
		//console.log("poDate :" +poDate);
		//console.log("qtyValue :" +qtyValue);
				var d = new Date();
				var date =dd+mm+yy;
         		var poOrdernumber= date+d.getMinutes()+d.getMilliseconds();
         	//alert("POOrder number"+poOrdernumber);
		//	alert("data send"+qtyValue);
			var json_blob = JSON.stringify({
		 "header" : {
			    "event_const" : "CNST_PURCHASE_ORDER",
			    "head_id" : "123"
			},
			"jsonblob" : {    
					
							 "po_id": "PO_"+poOrdernumber,
							 "supplier_id": supplierId,
							 "price_unit": rate,
							 "item_details": "coffee bean",
							 "item_id": "CFBEAN",
							 "date": poDate,
							 "status": "not sent",
							 "qty" : qtyValue
		    	 
					
			}
			
	});


		
		$.ajax({ 
	
		url:"/invoke",
	    type: "post",                   //Type of request, can be PUT,POST,GET,DELETE
	    dataType: "json",        //Type of data to be sent in the body.
	    contentType: "application/json",
		data: json_blob,                       
		success:function(response){
			
			if(response.status === "success")
			{
				console.log("success");
				
				}
		},
	    error: function(jqXHR, textStatus, errorThtrown) {
			console.log(textStatus);
	        }
	                                                                             
	
	  });
		}		
}
function setDate()
{
	//document.getElementById("c1VD").attributes("disabled","disabled");
	var today = new Date();
	var dd = today.getDate();
	var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
		  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
		];

		var d = new Date();
		var mon= monthNames[d.getMonth()];
		
	var mm = today.getMonth()+1; 
	var yyyy = today.getFullYear();
	if(dd<10) 
	{
	    dd='0'+dd;
	} 

	if(mm<10) 
	{
	    mm='0'+mm;
	} 
	today = mon+','+dd+' '+yyyy;	
	poDate = today;
	document.getElementById("date_set").innerHTML = today;
	
}

function showDetails()
{
	//alert("inside showdetails");
	var supplierId;
	document.getElementById("rate").value = "";
	document.getElementById("qty").value = "";
/*alert("----Take the values of Rate, Available quantity from Supplier DB----");*/
	
//alert("Onchange Function");
/* if(document.getElementById("selectpicker").value == "SupplierA")
	{
	//alert(document.getElementById("selectpicker").value);
	supplierId = "8888"
	}
else {
	//alert(document.getElementById("selectpicker").value);
	supplierId = "7777"
} */
supplierId=document.getElementById("selectpicker").value;
$.ajax({ 
		url:"/query/GetItemForSupplier/"+supplierId,
		type: "get",                   //Type of request, can be PUT,POST,GET,DELETE
	    dataType: "json",        //Type of data to be sent in the body.
	    contentType: "application/json",                   
		success:function(response){  			
			$.each(response, function(i, item) {
				var rowData = JSON.stringify(item['Record']);
				var price_unit = JSON.stringify(item['Record']['price_unit']);
				var quantity = JSON.stringify(item['Record']['quantity']);
				/* if(price_unit!= undefined && quantity!=undefined)
				{
				$("#rate").val(price_unit);
				$("#qty").val(quantity);
				} */
				//console.log("rowData :"+rowData);
				//console.log("price_unit :"+price_unit);
				//console.log("quantity :"+quantity);
				var price_unit1 = price_unit.split('"').join('');
				//console.log("aftr removing :" +price_unit1);
				var quantity1 = quantity.split('"').join('');
				//console.log("aftr removing :" +quantity1);
				document.getElementById("rate").value = price_unit1 ;
			    document.getElementById("qty").value = quantity1;	
					
					 });
			//var data1 = JSON.parse(JSON.parse(dataFromChain).result.message.replace(/[\[\]']/g,'' ));	
			
		},
	    error: function(jqXHR, textStatus, errorThtrown) {
			console.log(textStatus);
	        }
   });
}

function financeSettlementProcess()
{
	
 alert("Finance Settlement Process Initiated with the Bank!!!");	
 
}
function grReceived()
{
	
	var qtygValue = document.getElementById("txt_GR_qty").value;
	alert("text box value"+qtygValue);
	var json_blob = JSON.stringify({
		"header" : {
				"event_const" : "CNST_CreateGNR",
				"head_id" : 123
			},
			"jsonblob" : {
						"po_id":"PO_001",
						"qty":"10"
						 }
			});
		
	 
		
		$.ajax({ 
	
		url:"/invoke",
	            //Type of request, can be PUT,POST,GET,DELETE
	    dataType: "json",        //Type of data to be sent in the body.
	    contentType: "application/json",
		data: json_blob,                       
		success:function(response){
			console.log("response : " + response)
			 var dataFromChain = JSON.stringify(response);
			 console.log(" stringified response : " + dataFromChain);
			 var status = response.status;
			 console.log("status : " + status);
			 var msg = response.message;
			// console.log("msg : " + msg);
			 console.log("tmmmmmmm : " +JSON.parse(JSON.parse(dataFromChain).result.message))
			 var gnrgen= JSON.parse(JSON.parse(dataFromChain).result.message).isgenerated;
					alert("gnrGNR"+gnrGNR);	
			 if(gnrgen=="0")
			 {
			     alert("GNR failed to generate as quantity received is less than 70% of what was requested");
			     document.getElementById("settleButton").disabled = true;
			 }
			 else if(gnrgen=="1")
			 {
			    alert("GNR generated successfully as quantity received is more than 70% of what was requesteds");
			     document.getElementById("settleButton").disabled = false;
			 }
		},
	    error: function(jqXHR, textStatus, errorThtrown) {
			console.log(textStatus);
	        }
	                                                                            
	
	  });
	return false;
}