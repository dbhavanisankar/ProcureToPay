function nestle_login()
 {  
	  var username = document.getElementById("email").value;
	  var pwd = document.getElementById("pwd").value; 
		
	  if((username == "techmahindra@org.in") && (pwd == "123")) 
	  {
		  
		  window.location="buyer-NestleFP.html"; 
	  } else {
		  alert("Enter the valid Username and Password");
	  }
	     return false;
 }
function supplier_login()
{  
	  var username = document.getElementById("email").value;
	  var pwd = document.getElementById("pwd").value; 
		
	  if((username == "Frank@supplier.in") && (pwd == "123")) 
	  {
		  
		  window.location="supplier-details.html"; 
	  } else {
		  alert("Enter the valid Username and Password");
	  }
	     return false;
}
 
function customs_login()
{  
	  var username = document.getElementById("email").value;
	  var pwd = document.getElementById("pwd").value; 
		
	  if((username == "Stephen@ymg.com") && (pwd == "123")) 
	  {
		  
		  window.location="customs-world.html"; 
	  } else {
		  alert("Enter the valid Username and Password");
	  }
	     return false;
}
 
function transport_login()
{  
	  var username = document.getElementById("email").value;
	  var pwd = document.getElementById("pwd").value; 
		
	  if((username == "Roghan@trans.in") && (pwd == "123")) 
	  {
		  
		  window.location="transport-PO.html"; 
	  } else {
		  alert("Enter the valid Username and Password");
	  }
	     return false;
}
 