/*
GetAllPurchaseOrders
GetPOForSupplier
GetPurchaseOrder
CreatePurchaseOrder
GetItemForSupplier
CreateItems
UpdateItemForSupplier
UpdateBillOfLading
UpdatePoECustoms
UpdateInvoice
*/

package main

import (
	"bytes"
	"strconv"
	"encoding/json"
	"fmt"
	"github.com/hyperledger/fabric/core/chaincode/shim"
	pb "github.com/hyperledger/fabric/protos/peer"
)

// Procure2Pay will implement the processes
type Procure2Pay struct {
}

type purchaseOrder struct {
	POID         string  `json:"po_id"`
	SupplierID   string  `json:"supplier_id"`
	Quantity     string  `json:"qty"`
	PriceUnit    string  `json:"price_unit"`
	Item         string  `json:"item_details"`
	ItemID       string  `json:"item_id"`
	Date         string  `json:"date"`
	Status       string  `json:"status"`
	PoECustoms   string  `json:"poe_Customs"`
	BillOfLading string  `json:"billOflading"`
	Invoice      string  `json:"invoice"`
}

type item struct {
	Key          string  `json:"key"`
	SupplierID   string  `json:"supplier_id"`
	ItemID       string  `json:"item_id"`
	Item         string  `json:"item"`
	Quantity     string  `json:"quantity"`
	PriceUnit    string  `json:"price_unit"`
}

type gnrMessage struct {
	Generated string    `json:"isgenerated"`
	Msg       string `json:"message"`
}

//GetAllPurchaseOrders change
func (t *Procure2Pay) GetAllPurchaseOrders(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var err error
	
	
		//fetch data from couch db starts here
		//var prefcategory = null
		queryString := fmt.Sprintf("{\"selector\":{\"po_id\":{\"$ne\": \"%s\"}}}", "null")
		queryResults, err := getQueryResultForQueryString(stub, queryString)
		//fetch data from couch db ends here
	
		if err != nil {
			fmt.Printf("Unable to read list of purchase orders : %s\n", err)
			return shim.Error(err.Error())
			//return nil, err
		}
	
		fmt.Printf("list of purchase orders : %v\n", queryResults)
	
		return shim.Success(queryResults)
		//return bytesRead, nil
}


// GetPOForSupplier gets the list of the PO for a Supplier
func (t *Procure2Pay) GetPOForSupplier(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	var err error
	
	fmt.Println("Entering get PO For Supplier")

	if (len(args) < 1) {
		fmt.Println("Invalid number of arguments\n")
		return shim.Error(err.Error())
	}

	//fetch data from couch db starts here
	var supplier_ID = args[0]
	queryString := fmt.Sprintf("{\"selector\":{\"supplier_id\":{\"$eq\": \"%s\"}}}",supplier_ID)
	queryResults, err := getQueryResultForQueryString(stub, queryString)
	//fetch data from couch db ends here

	if err != nil {
		fmt.Printf("Unable to read the list of PO for Supplier ID : %s\n", err)
		return shim.Error(err.Error())
		//return nil, err
	}
	
	fmt.Printf("list of PO for Supplier ID : %v\n", queryResults)
	
	return shim.Success(queryResults)
	//return bytesRead, nil
}


// GetPurchaseOrder gets the details of the PO
func (t *Procure2Pay) GetPurchaseOrder(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	var err error
	
	fmt.Println("Entering GetPurchaseOrder")

	if (len(args) < 1) {
		fmt.Println("Invalid number of arguments\n")
		return shim.Error(err.Error())
	}

	//fetch data from couch db starts here
	var po_id = args[0]
	queryString := fmt.Sprintf("{\"selector\":{\"po_id\":{\"$eq\": \"%s\"}}}",po_id)
	queryResults, err := getQueryResultForQueryString(stub, queryString)
	//fetch data from couch db ends here

	if err != nil {
		fmt.Printf("Unable to read the PO for PO ID : %s\n", err)
		return shim.Error(err.Error())
		//return nil, err
	}
	
	fmt.Printf("list of PO for PO ID : %v\n", queryResults)
	
	return shim.Success(queryResults)
	//return bytesRead, nil
}

// CreatePurchaseOrder creates/updates the PO
func (t *Procure2Pay) CreatePurchaseOrder(stub shim.ChaincodeStubInterface, args []string) pb.Response {

    var objpurchaseOrder purchaseOrder
	var objitem item
	var err error
	
	fmt.Println("Entering CreatePurchaseOrder")

	if len(args) < 1 {
		fmt.Println("Invalid number of args")
		return shim.Error(err.Error())
	}

	fmt.Println("Args [0] is : %v\n", args[0])

	//unmarshal customerInfo data from UI to "customerInfo" struct
	err = json.Unmarshal([]byte(args[0]), &objpurchaseOrder)
	if err != nil {
		fmt.Printf("Unable to unmarshal CreatePurchaseOrder input purchaseOrder: %s\n", err)
		return shim.Error(err.Error())
		}

	fmt.Println("purchase order object PO ID variable value is : %s\n", objpurchaseOrder.POID)
	fmt.Println("purchase order object PO ID variable value is : %s\n", objpurchaseOrder.Quantity)

	// Data insertion for Couch DB starts here 
	transJSONasBytes, err := json.Marshal(objpurchaseOrder)
	err = stub.PutState(objpurchaseOrder.POID, transJSONasBytes)
	// Data insertion for Couch DB ends here

	//unmarshal LoanTransactions data from UI to "LoanTransactions" struct
	err = json.Unmarshal([]byte(args[0]), &objitem)
	if err != nil {
		fmt.Printf("Unable to unmarshal CreatePurchaseOrder input purchaseOrder: %s\n", err)
		return shim.Error(err.Error())
		}

	fmt.Println("item object Item ID variable value is : %s\n", objitem.ItemID)

	// Data insertion for Couch DB starts here 
	transJSONasBytesLoan, err := json.Marshal(objitem)
	err = stub.PutState(objitem.ItemID, transJSONasBytesLoan)
	// Data insertion for Couch DB ends here

	fmt.Println("Create Purchase Order Successfully Done")

	if err != nil {
		fmt.Printf("\nUnable to make transevent inputs : %v ", err)
		return shim.Error(err.Error())
		//return nil,nil
	}
	return shim.Success(nil)
}

//GetItemForSupplier gets the details of the item
func (t *Procure2Pay) GetItemForSupplier(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	var err error
	
	fmt.Println("Entering GetPurchaseOrder")

	if (len(args) < 1) {
		fmt.Println("Invalid number of arguments\n")
		return shim.Error(err.Error())
	}

	//fetch data from couch db starts here
	var supplier_ID = args[0]
	queryString := fmt.Sprintf("{\"selector\":{\"supplier_id\":{\"$eq\": \"%s\"}}}",supplier_ID)
	queryResults, err := getQueryResultForQueryString(stub, queryString)
	//fetch data from couch db ends here

	if err != nil {
		fmt.Printf("Unable to read the PO for PO ID : %s\n", err)
		return shim.Error(err.Error())
		//return nil, err
	}
	
	fmt.Printf("list of PO for PO ID : %v\n", queryResults)
	
	return shim.Success(queryResults)
	//return bytesRead, nil
}

//CreateItems creates the items
func (t *Procure2Pay) CreateItems(stub shim.ChaincodeStubInterface, args []string) pb.Response {

	var objitem item	
	var err error

	fmt.Println("Entering CreateItems")

	if (len(args) < 1) {
		fmt.Println("Invalid number of args")
		return shim.Error(err.Error())
		//return nil, errors.New("Expected atleast one arguments for initiate Transaction")
	}

	fmt.Println("Args [0] is : %v\n",args[0])
	
	//unmarshal item data from UI to "item" struct
	err = json.Unmarshal([]byte(args[0]), &objitem)
	if err != nil {
		fmt.Printf("Unable to unmarshal CreateItem input item: %s\n", err)
		return shim.Error(err.Error())
		//return nil, nil
	}

	fmt.Println("item object ItemID variable value is : %s\n",objitem.ItemID);
	
		// Data insertion for Couch DB starts here 
		transJSONasBytes, err := json.Marshal(objitem)
		err = stub.PutState(objitem.ItemID, transJSONasBytes)
		// Data insertion for Couch DB ends here 

		fmt.Println("Create items Successfully Done")	
	
		if err != nil {
				fmt.Printf("\nUnable to make transevent inputs : %v ", err)
				return shim.Error(err.Error())
				//return nil,nil
			}
	return shim.Success(nil)
	//return nil, nil
}

// UpdateItemForSupplier updates the Item
func (t *Procure2Pay) UpdateItemForSupplier(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var obj_uiitem item
	var obj_bcitem item
	var err error

	fmt.Println("Entering UpdateItemForSupplier")

	if (len(args) < 1) {
		fmt.Println("Invalid number of args")
		return shim.Error(err.Error())
		//return nil,nil
	}

	err = json.Unmarshal([]byte(args[0]), &obj_uiitem)
    if err != nil {
		fmt.Printf("Unable to marshal  createTransaction input UpdateTransaction : %s\n", err)
		return shim.Error(err.Error())
		//return nil, nil
	}

	fmt.Println("\n refno variable value is : ",obj_uiitem.SupplierID); 

	// code to get data from blockchain using dynamic key starts here
	var bytesread []byte	
	bytesread, err = stub.GetState(obj_uiitem.SupplierID)
	err = json.Unmarshal(bytesread, &obj_bcitem)
	// code to get data from blockchain using dynamic key ends here

	fmt.Printf("\nobj_bcitem : %s ", obj_bcitem)
	
	obj_bcitem.SupplierID=obj_uiitem.SupplierID
	obj_bcitem.ItemID=obj_uiitem.ItemID
	//obj_bcitem.Item=obj_uiitem.Item
	//obj_bcitem.Quantity=obj_uiitem.Quantity
	obj_bcitem.PriceUnit=obj_uiitem.PriceUnit

	// Data insertion for Couch DB starts here 
	transJSONasBytes, err := json.Marshal(obj_bcitem)
	err = stub.PutState(obj_uiitem.SupplierID, transJSONasBytes)
	// Data insertion for Couch DB ends here 
		
	fmt.Println("UpdateItemForSupplier Successfully updated.")	

	if err != nil {
				fmt.Printf("\nUnable to make transevent inputs : %v ", err)
				return shim.Error(err.Error())
				//return nil,nil
			}
	return shim.Success(nil)
	//return nil, nil
}

// UpdateBillOfLading adds the BillOfLading to PO
func (t *Procure2Pay) UpdateBillOfLading(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var obj_uipurchaseOrder purchaseOrder
	var obj_bcpurchaseOrder purchaseOrder
	var err error

	fmt.Println("Entering UpdateBillOfLading")

	if (len(args) < 1) {
		fmt.Println("Invalid number of args")
		return shim.Error(err.Error())
		//return nil,nil
	}

	err = json.Unmarshal([]byte(args[0]), &obj_uipurchaseOrder)
    if err != nil {
		fmt.Printf("Unable to marshal  createTransaction input UpdateTransaction : %s\n", err)
		return shim.Error(err.Error())
		//return nil, nil
	}

	fmt.Println("\n refno variable value is : ",obj_uipurchaseOrder.POID); 

	// code to get data from blockchain using dynamic key starts here
	var bytesread []byte	
	bytesread, err = stub.GetState(obj_uipurchaseOrder.POID)
	err = json.Unmarshal(bytesread, &obj_bcpurchaseOrder)
	// code to get data from blockchain using dynamic key ends here

	fmt.Printf("\nobj_bcpurchaseOrder : %s ", obj_bcpurchaseOrder)

	obj_bcpurchaseOrder.POID=obj_uipurchaseOrder.POID
	obj_bcpurchaseOrder.BillOfLading=obj_uipurchaseOrder.BillOfLading

	// Data insertion for Couch DB starts here 
	transJSONasBytes, err := json.Marshal(obj_bcpurchaseOrder)
	err = stub.PutState(obj_uipurchaseOrder.POID, transJSONasBytes)
	// Data insertion for Couch DB ends here 
		
	fmt.Println("Bill of lading Successfully updated.")	

	if err != nil {
				fmt.Printf("\nUnable to make transevent inputs : %v ", err)
				return shim.Error(err.Error())
				//return nil,nil
			}
	return shim.Success(nil)
	//return nil, nil
}

// UpdatePoECustoms adds the POE Docs to PO
func (t *Procure2Pay) UpdatePoECustoms(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var obj_uipurchaseOrder purchaseOrder
	var obj_bcpurchaseOrder purchaseOrder
	var err error

	fmt.Println("Entering UpdatePoECustoms")

	if (len(args) < 1) {
		fmt.Println("Invalid number of args")
		return shim.Error(err.Error())
		//return nil,nil
	}

	err = json.Unmarshal([]byte(args[0]), &obj_uipurchaseOrder)
    if err != nil {
		fmt.Printf("Unable to marshal  createTransaction input UpdateTransaction : %s\n", err)
		return shim.Error(err.Error())
		//return nil, nil
	}

	fmt.Println("\n refno variable value is : ",obj_uipurchaseOrder.POID); 

	// code to get data from blockchain using dynamic key starts here
	var bytesread []byte	
	bytesread, err = stub.GetState(obj_uipurchaseOrder.POID)
	err = json.Unmarshal(bytesread, &obj_bcpurchaseOrder)
	// code to get data from blockchain using dynamic key ends here

	fmt.Printf("\nobj_bcpurchaseOrder : %s ", obj_bcpurchaseOrder)

	obj_bcpurchaseOrder.POID=obj_uipurchaseOrder.POID
	obj_bcpurchaseOrder.PoECustoms=obj_uipurchaseOrder.PoECustoms

	// Data insertion for Couch DB starts here 
	transJSONasBytes, err := json.Marshal(obj_bcpurchaseOrder)
	err = stub.PutState(obj_uipurchaseOrder.POID, transJSONasBytes)
	// Data insertion for Couch DB ends here 
		
	fmt.Println("POE Customs Successfully updated.")	

	if err != nil {
				fmt.Printf("\nUnable to make transevent inputs : %v ", err)
				return shim.Error(err.Error())
				//return nil,nil
			}
	return shim.Success(nil)
	//return nil, nil
}

// UpdateInvoice adds the POE Docs to PO
func (t *Procure2Pay) UpdateInvoice(stub shim.ChaincodeStubInterface, args []string) pb.Response {
	var obj_uipurchaseOrder purchaseOrder
	var obj_bcpurchaseOrder purchaseOrder
	var err error

	fmt.Println("Entering UpdatePoECustoms")

	if (len(args) < 1) {
		fmt.Println("Invalid number of args")
		return shim.Error(err.Error())
		//return nil,nil
	}

	err = json.Unmarshal([]byte(args[0]), &obj_uipurchaseOrder)
    if err != nil {
		fmt.Printf("Unable to marshal  createTransaction input UpdateTransaction : %s\n", err)
		return shim.Error(err.Error())
		//return nil, nil
	}

	fmt.Println("\n refno variable value is : ",obj_uipurchaseOrder.POID); 

	// code to get data from blockchain using dynamic key starts here
	var bytesread []byte	
	bytesread, err = stub.GetState(obj_uipurchaseOrder.POID)
	err = json.Unmarshal(bytesread, &obj_bcpurchaseOrder)
	// code to get data from blockchain using dynamic key ends here

	fmt.Printf("\nobj_bcpurchaseOrder : %s ", obj_bcpurchaseOrder)

	obj_bcpurchaseOrder.POID=obj_uipurchaseOrder.POID
	obj_bcpurchaseOrder.Invoice=obj_uipurchaseOrder.Invoice
	obj_bcpurchaseOrder.Status=obj_uipurchaseOrder.Status
	
	// Data insertion for Couch DB starts here 
	transJSONasBytes, err := json.Marshal(obj_bcpurchaseOrder)
	err = stub.PutState(obj_uipurchaseOrder.POID, transJSONasBytes)
	// Data insertion for Couch DB ends here 
		
	fmt.Println("Invoice Successfully updated.")	

	if err != nil {
				fmt.Printf("\nUnable to make transevent inputs : %v ", err)
				return shim.Error(err.Error())
				//return nil,nil
			}
	return shim.Success(nil)
	//return nil, nil
}
/////////////////////////////////

// CreateGNR creates the GNR for PO
func (t *Procure2Pay) CreateGNR(stub shim.ChaincodeStubInterface, args []string) pb.Response{
	//var err error
	var object purchaseOrder
	var response gnrMessage
	fmt.Println("Entering createGNR")

	if len(args) < 2 {
		fmt.Println("Invalid number of arguments")
		return shim.Error("Missing details for purchase order ID " + args[0])
	}
	fmt.Printf("PO id : %v\n", args[0])
	fmt.Printf("Qty Received : %v\n", args[1])

	//getPurchaseOrderMap(stub)
	//object = purchaseOrderMap[args[0]]
	bytesread, _ := stub.GetState(args[0])
	json.Unmarshal(bytesread, &object)
	

	var qtyint, _ = strconv.Atoi(args[1])
	var obj_int, _ =strconv.Atoi(object.Quantity)
	if qtyint < obj_int {
		var qty = obj_int * 3 / 4
		if qtyint >= qty {
			response.Msg = "GNR generated successfully as quantity received is more than 70% of what was requested"
			response.Generated = "1"
		} else {
			response.Msg = "GNR failed to generate as quantity received is less than 70% of what was requested"
			response.Generated = "0"
		}
	}
	fmt.Printf("GNR status : %v\n", response)
	bytes, _ := json.Marshal(&response)
	return shim.Success(bytes)
}


// getQueryResultForQueryString
func getQueryResultForQueryString(stub shim.ChaincodeStubInterface, queryString string) ([]byte, error) {
	
		fmt.Printf("- getQueryResultForQueryString queryString:\n%s\n", queryString)
	
		resultsIterator, err := stub.GetQueryResult(queryString)
		if err != nil {
			return nil, err		
		}
		defer resultsIterator.Close()
	
		// buffer is a JSON array containing QueryRecords
		var buffer bytes.Buffer
		buffer.WriteString("[")
	
		bArrayMemberAlreadyWritten := false
	
		for resultsIterator.HasNext() {
			queryResponse, err := resultsIterator.Next()
			if err != nil {
				return nil, err			
			}
			// Add a comma before array members, suppress it for the first array member
			if bArrayMemberAlreadyWritten == true {
				buffer.WriteString(",")
			}
			buffer.WriteString("{\"Key\":")
			buffer.WriteString("\"")
			buffer.WriteString(queryResponse.Key)
			buffer.WriteString("\"")
	
			buffer.WriteString(", \"Record\":")
			// Record is a JSON object, so we write as-is
			buffer.WriteString(string(queryResponse.Value))
			buffer.WriteString("}")
			bArrayMemberAlreadyWritten = true
		}
		buffer.WriteString("]")
	
		fmt.Printf("- getQueryResultForQueryString queryResult:\n%s\n", buffer.String())
	
		return buffer.Bytes(), nil
	}


// Init sets up the chaincode
	func (t *Procure2Pay) Init(stub shim.ChaincodeStubInterface) pb.Response {
	
		fmt.Println("Initiate the chaincde")
		return shim.Success(nil)
		
}


// Invoke the function in the chaincode
	func (t *Procure2Pay) Invoke(stub shim.ChaincodeStubInterface) pb.Response {
	function, args := stub.GetFunctionAndParameters()
	if function == "CreatePurchaseOrder" {
		return t.CreatePurchaseOrder(stub,args)
	} 
	if function =="GetAllPurchaseOrders" {
		fmt.Println("in getall PO")
		return t.GetAllPurchaseOrders(stub,args)
	}
	if function =="GetPOForSupplier" {
		return t.GetPOForSupplier(stub,args)
	}
	if function =="GetPurchaseOrder" {
		return t.GetPurchaseOrder(stub,args)
	}
	if function =="GetItemForSupplier" {
		return t.GetItemForSupplier(stub,args)
	}
	if function == "CreateItems" {
		return t.CreateItems(stub,args)
	} 
	if function == "UpdateItemForSupplier" {
		return t.UpdateItemForSupplier(stub,args)
	} 
	if function == "UpdateBillOfLading" {
		return t.UpdateBillOfLading(stub,args)
	}
	if function == "UpdatePoECustoms" {
		return t.UpdatePoECustoms(stub,args)
	}
	if function == "UpdateInvoice" {
		return t.UpdateInvoice(stub,args)
	}
	if function == "CreateGNR" {
		return t.CreateGNR(stub,args)
	}
	fmt.Println("Function not found")
	return shim.Error("Received unknown function invocation")
    //return nil, nil
}

func main() {
	err := shim.Start(new(Procure2Pay))
	if err != nil {
		fmt.Println("Could not start Chaincode")
	} else {
		fmt.Println("Chaincode successfully started")
	}

}
