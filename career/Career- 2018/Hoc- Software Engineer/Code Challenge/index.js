//FUNCTIONS TABLE OF CONTENTS//
/*

FUNCTIONS A: File 
	1) Function A1: Select File 
	2) Function A2: Double Click File (Trigger Download)
	3) Function A3: Rename File (Handle UI)
	4) Function A4: Cancel File Rename (Handle UI)
	5) Function A5: Save New File Name
	
FUNCTIONS B: Folder Related 
	1) Function B1: Select Folder 
	2) Function B2: Double Click Folder (Open Folder)	
	3) Function B3: Show Create new Folder Area 
	4) Function B4: Hide Create new Folder Area (Cancel)
	5) Function B5: Save New Folder
	
FUNCTIONS C: File and Folder Related 
	1) Function C1: Rename File
	2) Function C2: Delete File

FUNCTIONS D: Upload Handling
	1) Function D1: Trigger Browse for File 
	2) Function D2: Trigger Upload File 
	3) Function D3: Listen for File Upload Button Click and Display File Name

	

*/
function myFunction() {
    
}

//FUNCTIONS A: User Related 
//Function A1: Get 
document.querySelector('.add').onclick = function(e) {
	
	//Prevent Form Submit 
	e.preventDefault();
	
	//Get Form Information 
	var age = document.getElementsByName("age")[0].value;
	var relationship = document.getElementsByName("rel")[0].value;
	    
	//Append Form Information to List on Page 	
		
	//Create Node List 	
	/*
	var x = document.createElement("OL");
    x.setAttribute("id", "myOl");
    document.body.appendChild(x);

    var y = document.createElement("LI");
    var t = document.createTextNode("Coffee");
    y.appendChild(t);
    document.getElementById("myOl").appendChild(y);	
	*/
	
	var ul = document.getElementsByClassName("household")[0];
	var li = document.createElement("li");
	li.appendChild(document.createTextNode(relationship + " " + age));
	ul.appendChild(li);
	//console.log(ul);
	console.log(age);
	console.log(relationship);		
	//var node = document.createElement("li");
    //var textnode = document.createTextNode(relationship);
    //node.appendChild(textnode);
    //document.getElementsByClassName("household").appendChild(node);
	

	
}

//Validate data entry (age is required and > 0, relationship is required)
function validatePositiveNumber(numberToValidate) {

	if (Number(numberToValidate) > 0) {
		return "more then zero";
	} else {
		return "less then zero";	
	}
}

validatePositiveNumber(10);


//Get Element by ID
//Get Element by Class

/*

document.getElementById("guessButton").addEventListener("click", function(event){
    event.preventDefault();
   handleFireButton();
});
*/

/*
var myFunction = function() {
    var attribute = this.getAttribute("data-myattribute");
    alert(attribute);
};

for (var i = 0; i < classname.length; i++) {
    classname[i].addEventListener('click', myFunction, false);
}
*/