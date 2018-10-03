var poID;
$(function(){ /* to make sure the script runs after page load */

    $('a.read_more').click(function(event){ /* find all a.read_more elements and bind the following code to them */

        event.preventDefault(); /* prevent the a from changing the url */
        $(this).parents('.item').find('.more_text').show(); /* show the .more_text span */
        $(".read_more").hide();

    });
    
    $('.bckg').css("min-height", $(window).height());

});


$(document).ready(function(){
    $(".more_text").hide();
 
});

function btnDisable()
{
	document.getElementById("btn_billOfLading").disabled = true;
	document.getElementById("btn_poeClearance").disabled = true;
	document.getElementById("btn_genInvoice").disabled = true;	
}
function setDate()
{
	btnDisable();
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
	document.getElementById("date_set").innerHTML = today;
}

function showSupplierDetails()
{
	//alert("inside supplier details while loading");
	var supplierId = "8888";
	document.getElementById("cur_rate").value = "";
	document.getElementById("rev_rate").value = "";
	document.getElementById("qty").value = "";


	$.ajax({ 
		url:"/query/GetItemForSupplier/"+supplierId,
		type: "get",                   //Type of request, can be PUT,POST,GET,DELETE
	    dataType: "json",        //Type of data to be sent in the body.
	    contentType: "application/json",                   
		success:function(response){  
		
			$.each(response, function(i, item) {
				var rowData = JSON.stringify(response);
				//console.log("before item['Record']['quantity']"+item['Record']['quantity']);
				if(item['Record']['item']!=undefined)
				{
				//console.log("rowdata :"+rowData);
				var item1 = (item['Record']['item']);
				//console.log("item1 check"+item1);
				var price1 = (item['Record']['price_unit']);
				var qty1 = (item['Record']['quantity']);
				
				//console.log("quantity chck : " + qty1);
					document.getElementById("item").value = item1;
					document.getElementById("cur_rate").value = price1;
					document.getElementById("qty").value = qty1;
				}
					
			});
				
			
		},
	    error: function(jqXHR, textStatus, errorThtrown) {
			console.log(textStatus);
	        }
   });


}

function revisedPriceUpd()
{
	//alert("inside revised price");
	var supplierId = "8888";
	var qtyValue = document.getElementById("qty").value;
	var rev_price = document.getElementById("rev_rate").value;
	// var jsonBlob= {	"item_id":"CFBEAN",
					// "price_unit":rev_price,
					// "quantity" : qtyValue};

	// var jsonBlobUpd = JSON.stringify(jsonBlob);

	//console.log("item_id :" +item_id);
	console.log("rev_price :" +rev_price);
	console.log("qtyValue :" +qtyValue);
	
	 var json_blob = JSON.stringify({
		 "header" : {
			    "event_const" : "CNST_UPDATE_ITEMFOR_SUPPLIER",
			    "head_id" : "123"
			},
			"jsonblob" : {    
					"supplier_id":"8888",
				   "item_id":"CFBEAN",
				   "price_unit":rev_price
		    	 
					
			}
			
	});

  $.ajax({ 
	
		url:"/invoke",
	    type: "post",                   //Type of request, can be PUT,POST,GET,DELETE
	    dataType: "json",        //Type of data to be sent in the body.
	    contentType: "application/json",
		data: json_blob,                       
		success:function(response){
			console.log("success");
			if(response.status === "success")
			{
				//$.each(response, function(i, item) {
				var rowData1 = JSON.stringify(response) ;
				console.log("rowdata1 :" +rowData1);
				var parse = JSON.parse(rowData1);
				console.log("parse :" +parse);
				console.log("parse.status :" +parse.status);
				if(parse.status == "success"){
			         alert("Revised Price has been updated successfully!!!");
					 
		           } 	
					
					// });
			}
		},
	    error: function(jqXHR, textStatus, errorThtrown) {
			console.log(textStatus);
	        }
	                                                                             
	
	  });
	
//reset();	
return false;

}
/* 
table shown in supplier po page start here */
function showAllPODetails()
{
	//alert("inside showallPODetails");
	document.getElementById("det").innerHTML="";
	
	$.ajax({ 
		url:"/query/GetAllPurchaseOrders/",
		type: "get",                   //Type of request, can be PUT,POST,GET,DELETE
	    dataType: "json",        //Type of data to be sent in the body.
	    contentType: "application/json",                   
		success:function(response){ 
			console.log("suc");
			var data=JSON.stringify(response);	
			console.log("categories and subcategoryus:"+data);
			 // var key1 =  Object.keys(data.Record['Key']);
			 // console.log("key1 :" +key1);
			
			$.each(response, function(i, item) {
				//var rowData = JSON.stringify(item) 
				//console.log("rowData :"+rowData);
				//var dataFromChain = JSON.stringify(response);
				//console.log("response :"+response);
			//var poOrders = JSON.parse(JSON.parse(dataFromChain).result.message);
				var key = item.Record.po_id;
				console.log("key :"+key);
				console.log("key len :"+key.length);
				console.log("length :"+Object.keys(key));
				if(key != undefined)
							{
								
			//console.log("poorders :"+poOrders);
			var tempCenter = "";
			var status = "";
			var image = "";
			tempF1="<div class='table-responsive'><br/><center><b style='margin-left:5%;'>Purchase Order List and Status</b><br/><br/>";
			tempF2 = "<div style='height: 2%;max-height: 300px;width: 72%;overflow-y: scroll;'><table id='gradient-style' class='table table-list-search' style='width:100%;'><thead><tr align='left' style='background-color: #ffffff;'><th></th><th>P.Order.No</th><th>Order Description</th><th>Date</th><th>Quantity</th><th>Goods Status</th><th></th></tr></thead><tbody>";
			tempFirst = tempF1 + tempF2;
			//console.log("response.len :"+response.length);
			for(i = 0;i<response.length;i++){	
				var poOrder = JSON.stringify(key);
				console.log("key[i] :" +poOrder);
				console.log("dataa :"+response[i].Record.po_id );
			// if(item.Record.po_id){
			if(response[i].Record.po_id){
				 if(response[i].Record.status == "not sent") {
					status = "Not sent" ;
					/* image = "<img style='width: 25px;' src='./images/Not_send.png'/>" ; */
				 }	else {  
				 	 status = "Received";
				 	// image = "<img style='width: 25px;' src='./images/Received.png'/>";
				 }
	   var response_poid=response[i].Record.po_id;
				 	 tempCenter += "<tr align='left' style='background-color: #ffffff;'>" +
							"<td><input type='radio' name='showDetails' onChange='onChangebutEnb(\""+response_poid+"\")'></td>"+ 
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
	// tempLast = "</tr></tbody></table></div></center></div>";
	// document.getElementById("det").innerHTML=tempFirst + tempCenter + tempLast;	
					// $('#telemarketeruser').html(item['Record']['Login_Name']);
					// $('#telemarketerid').html(item['Record']['RTM_No']);
					
			
		},
	    error: function(jqXHR, textStatus, errorThtrown) {
			console.log(textStatus);
	        }
   
});
	}
/* 
ends here */
/**/
function onChangebutEnb(poOrder) {	
	//buttonDisable();
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
				console.log("rowData :" + rowData);
				//var len = JSON.stringify(item['Record']['status']);
				//console.log("length :"+len.length);
				//poOrder_id = JSON.stringify(item['Record']['po_id']);
				billoflading = response[i].Record.billOflading;
				poe_Customs = response[i].Record.poe_Customs;
				invoice = response[i].Record.invoice;
				//alert("billoflading"+billoflading);
		if(poe_Customs == "POE Customs Successful" )
		{
			document.getElementById("btn_poeClearance").disabled = false;
		}
		if(billoflading == "Bill Of Lading Successful" )	
		{
			document.getElementById("btn_billOfLading").disabled = false;	
		}
		if(poe_Customs == "POE Customs Successful"  && billoflading == "Bill Of Lading Successful" )
		{
			document.getElementById("btn_genInvoice").disabled = false;
		}
	$('#btn_genInvoice').click(function() {
			if ((poOrder!=undefined)&&(poOrder!=null)){
					var json_blob = JSON.stringify({

						"header" : {
							"event_const" : "CNST_UPDATE_INVOICE",
							"head_id" : 123
						},
						"jsonblob" : {
									"po_id":poOrder,
									"status":"sent",
									"invoice":"Invoice Successful"
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
				 alert("Invoice has been genrated succesfully!!!");
			
			}
		},
	    error: function(jqXHR, textStatus, errorThtrown) {
			console.log(textStatus);
	        }
	                                                                             
	
	  });
			  
	}
});
});
		}
		});
}

function buttonEnable(poOrder) {
	btnDisable();
	if(poOrder.poe_Customs == "poecustoms")
		{
			document.getElementById("btn_poeClearance").disabled = false;
		}
		if(poOrder.billOflading == "billoflading")	
		{
			document.getElementById("btn_billOfLading").disabled = false;	
		}
		if(poOrder.poe_Customs == "poecustoms" && poOrder.billOflading == "billoflading")
		{
			poID= poOrder.po_id;
			document.getElementById("btn_genInvoice").disabled = false;
		}
}

function openpdfBOL()
{
	
	window.open('/billoflading','_blank');	
}

function openpdfPOE()
{
	window.open('/POEClearance','_blank');
}
function openpdfInvoice()
{
	//window.open('/openpdfInvoice','_blank');
}
function onChangeDD()
{
	document.getElementById("det").innerHTML="";
	var val=document.getElementById("selectpicker").value;
	if(val=="Nestle")
		{
		var temp;
		temp='<div class="table-responsive"><br/><b style="margin-left:5%;">Purchase Order List & Status</b><br/><center><table id="gradient-style" class="table table-list-search" style="width:70%;"><thead><tr align="left" style="background-color: #ffffff;"><th>P.Order.No</th><th>Order Description</th><th>Date</th><th>Quantity</th><th>Status</th></tr></thead><tbody><tr align="left" class="style_prevu_kit" style="background-color: #ffffff;"><td style="text-color:#3973bf;"><a href="SupplierPODescription.html">684940</a></td><td>Coffee Beans</td><td>13/02/2017</td><td>20,000 kg</td><td>Not send <img src="./images/Not_send.png"/></td></tr></tbody></table></center></div>';
		document.getElementById("det").innerHTML=temp;
		}
	
}
function reset()
{
		document.getElementById("rev_rate").value="";	
}