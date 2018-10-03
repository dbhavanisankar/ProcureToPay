	
 function onLoadCall()
	{
		document.getElementById("btn_BOL").disabled = true;
		setDate();
		
	}
	function setDate()
	{
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

	function showAllPODetails()
	{
		document.getElementById("det").innerHTML="";
	var val=document.getElementById("selectpicker").value;
	//var po_id="PO_003";
	if(val=="Nestle")
		{
		//alert("inside showallPODetails");
	document.getElementById("det").innerHTML="";
	
	$.ajax({ 
		url:"/query/GetAllPurchaseOrders/",
		type: "get",                   //Type of request, can be PUT,POST,GET,DELETE
	    dataType: "json",        //Type of data to be sent in the body.
	    contentType: "application/json",                   
		success:function(response){ 
			var data=JSON.stringify(response);	
			$.each(response, function(i, item) {
				var key = item.Record.po_id;
				if(key != undefined)
				{		
			var tempCenter = "";
			var status = "";
			//var image = "";
			tempF1="<div class='table-responsive'><br/><center><b style='margin-left:5%;'>Purchase Order List and Status</b><br/><br/>";
			tempF2 = "<div style='height: 2%;max-height: 300px;width: 72%;overflow-y: scroll;'><table id='gradient-style' class='table table-list-search' style='width:100%;'><thead><tr align='left' style='background-color: #ffffff;'><th></th><th>P.Order.No</th><th>Order Description</th><th>Date</th><th>Quantity</th><th>Goods Status</th><th></th></tr></thead><tbody>";
			tempFirst = tempF1 + tempF2;
			//console.log("response.len :"+response.length);
			for(i = 0;i<response.length;i++){	
				var poOrder = JSON.stringify(key);
				//console.log("key[i] :" +poOrder);
				//console.log("dataa :"+response[i].Record.po_id );
			// if(item.Record.po_id){
			if(response[i].Record.po_id){
				 if(response[i].Record.status == "not sent") {
					status = "Not sent" ;
					/* image = "<img style='width: 25px;' src='./images/Not_send.png'/>" ; */
				 }	else {  
				 	 status = "Sent";
				 	// image = "<img style='width: 25px;' src='./images/Received.png'/>";
				 }
	   var response_poid=response[i].Record.po_id;
				 	 tempCenter += "<tr align='left' style='background-color: #ffffff;'>" +
							"<td><input type='radio'name='showDetails' onChange='onChangebutEnb(\""+response_poid+"\")'></td>"+ 
							 "<td>"+ response[i].Record.po_id +"</td>" + 
							 "<td>"+ response[i].Record.item_details +"</td>" + 			  
							 "<td>"+ response[i].Record.date +"</td>" + 
							 "<td>"+ response[i].Record.qty +"</td>" + 
							 "<td style= 'align: left;'>"+ status + "</td>" ;
							// "<td>"+ image + "</td></tr>" ;
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
}
	function onChangebutEnb(poOrder) {
		//poID = poOrder.po_id;
		//alert("poid in onchangfe end button :"+poOrder);
		document.getElementById("btn_BOL").disabled = false;
		$('#btn_BOL').click(function() {
			if ((poOrder!=undefined)&&(poOrder!=null)){
        //var selValue = $('input[name=showDetails]:checked').val(); 
      //  alert("selValue in side button click event"+poOrder);
		
		var jsonBlob=JSON.stringify({
							"header" : {
								"event_const" : "CNST_UPDATE_BILLOFLADING",
								"head_id" : 123
							},
							"jsonblob" : {
										"po_id":poOrder,
										"billOflading":"Bill Of Lading Successful"
										 }
							
					});
				$.ajax({ 
         		
           		url:"/invoke",
           	    type: "post",                   //Type of request, can be PUT,POST,GET,DELETE
           	    dataType: "json",        //Type of data to be sent in the body.
           	    contentType: "application/json",
           		data: jsonBlob,                       
           		success:function(response){
						console.log("data  :"+response);
						//var t = JSON.parse(response);	
						//console.log("response"+t);
						var dataFromChain = JSON.stringify(response);
						console.log("dataFromChain:"+JSON.parse(dataFromChain).status);
						var status = JSON.parse(dataFromChain).status;
			if(status == "success")
			{
			 alert("Generated Bill of Lading succesfully!!!");
			
			}
					
           		},
           	    error: function(jqXHR, textStatus, errorThtrown) {
           			console.log("fg " +textStatus);
           	        }
           	                                                                             
           	
           	  });
	
		$.ajax({url: "/createpdfForm",type:'POST',data: {type: 'viewform',OrderNumber: poOrder ,par_flag: "pdf"} , success: function(result){
					//alert(result);
			 	 	if (result){
			 		var pdf = "./Form22.pdf";
			 		$("#btn_billOfLading").attr("href", pdf);
			      }	
			  
			}
		 
		/*  $("#price").val(85000);
		//alert("data"+response);
	}, */
			 
			//alert("data"+response);
		,
	    error: function(jqXHR, textStatus, errorThtrown) {
			console.log(textStatus);
	        }
	                                                                             

	  });			
					
			}
		});
		//return(poOrder);
	}
	