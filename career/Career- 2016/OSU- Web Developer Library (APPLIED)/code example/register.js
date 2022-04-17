//FUNCTIONS TABLE OF CONTENTS//
/*

FUNCTIONS R: Registration and Login Functions
	1) Function R1: Check if Username is correct 
	2) Function R2: Check if Full Name is correct 
	3) Function R3: Check if First Name is correct 
	4) Function R4: Check if Last Name is correct 
	5) Function R5: Check if Password is correct 
	6) Function R6: Check if Email is correct 
	7) Function R7: Register User
	8) Function R8: Register User with Email 
	9) Function R9: Remove please fill in all fields if they are full
	10) Function R0: Validate Email
	
*/

//Development Code Root
var CODE_ROOT = "../../functions/";

//Live Code Root 
//var CODE_ROOT = "../functions/";

//FUNCTIONS R: Registration and Login Functions

//Function R1: Check if Username is correct 
$(document).ready(function(){
	$("#js-registration-user-name").keyup(function(){
		var user_name_temporary = $('input[name=register-user-name]').val();	

		//Check if Form has all values filled in and remove fill in all values error message if it does 
		testForEmptyFormField();
	
		//PART 1: User Name has characters 
		if (user_name_temporary) {
			
			//Check UserName
			$.post(CODE_ROOT + 'register.php', { user_name_temporary: user_name_temporary }, 
			
			function(data) {	
				var user_name_test_array = JSON.parse(data);
				console.log(user_name_test_array);
				var user_name_length_test = user_name_test_array["user_name_length_test"];
				var user_name_character_test = user_name_test_array["user_name_character_test"];
				var user_name_taken_test = user_name_test_array["user_name_taken_test"];
				var register_user_name_outcome = user_name_test_array["register_user_name_outcome"];
				
				//Outcome 1: Username is to short (ERROR)
				if(user_name_length_test == 0) {
					$("#js-registration-user-name").removeClass("login-success-border").addClass("login-error-border");	
					$("#js-registration-user-name-error-output").text(username_failure_message);
					//console.log("too short");
					
				//Outcome 2: Username is Long Enough
				} else {						

					//Outcome 3: Username Taken (ERROR)
					if (register_user_name_outcome == 0) {
						var username_failure_message  = "Sorry! This User Name has been taken already";
						$("#js-registration-user-name").removeClass("login-success-border").addClass("login-error-border");	
						$("#js-registration-user-name-error-output").text(username_failure_message);	
						//console.log("taken");
					
					//Outcome 4: UserName Available (SUCCESS) 
					} else {
						//Success 4: User Name is ok 
						$("#js-registration-user-name-error-output").text("");
						$("#js-registration-user-name").removeClass("login-error-border").addClass("login-success-border");		
						//console.log("available");
					} 										
				}			
			})
			
		//PART 2: User Name is empty	
		} else {
			$("#js-registration-user-name").removeClass("login-error-border");		
			$("#js-registration-user-name").removeClass("login-success-border");
			console.log("empty");			
		}		
	});
});


//Function R2: Check if Full Name is correct 
$(document).ready(function(){
	$("#js-registration-full-name").keyup(function(){	
		var registration_full_name_temporary = $('input[name=register-full-name]').val();

		//Check if Form has all values filled in and remove fill in all values error message if it does 
		testForEmptyFormField();
		
		//PART 1: User Name has characters 
		if (registration_full_name_temporary) {
			
			//Full Name is Correct 
			$.post(CODE_ROOT + 'register.php', { registration_full_name_temporary: registration_full_name_temporary }, 
			
			function(data) {
				var full_name_test = data;
				
				//ERROR
				if (full_name_test == 0) {
					$("#js-registration-full-name").removeClass("login-success-border").addClass("login-error-border");	
					//Error 1: User name is less then 5 characters 
					//Error 2: Check if username only uses correct characters 				
					//Error 3: Check if username is taken 
				
				//SUCCESS 
				} else {
					//Success 4: User Name is ok 
					$("#js-registration-full-name").removeClass("login-error-border").addClass("login-success-border");
				} 			
			})	

		//PART 2: Full Name is empty				
		} else {
			$("#js-registration-full-name").removeClass("login-error-border");		
			$("#js-registration-full-name").removeClass("login-success-border");				
		}	

	});
});


//Function R3: Check if First Name is correct 
//*Currently, site only requires a full name and parses this to a first and last name (Function R2)

//Function R4: Check if Last Name is correct 
//*Currently, site only requires a full name and parses this to a first and last name (Function R2)

//Function R5: Check if Password is correct 
$(document).ready(function(){
	$("#js-registration-password").keyup(function(){		
		var registration_password_temporary = $('input[name=register-password]').val();

		//Check if Form has all values filled in and remove fill in all values error message if it does 
		testForEmptyFormField();
		
		//PART 1: User Name has characters 
		if (registration_password_temporary) {
			var password_length = registration_password_temporary.length;
			
			//SUCCESS 
			if (password_length > 4) {
				$("#js-registration-password").removeClass("login-error-border").addClass("login-success-border");		
			//ERROR
			} else {
				$("#js-registration-password").removeClass("login-success-border").addClass("login-error-border");	
			} 			

		//PART 2: Full Name is empty				
		} else {
			$("#js-registration-password").removeClass("login-error-border");		
			$("#js-registration-password").removeClass("login-success-border");				
		}	
	});
});


//Function R6: Check if Email is correct 
$(document).ready(function(){
	$("#js-registration-email").keyup(function(){
		var registration_email_temporary = $('input[name=register-email]').val();

		//Check if Form has all values filled in and remove fill in all values error message if it does 
		testForEmptyFormField();
		
		//Step 1A: Email has at least one character 
		if (registration_email_temporary) {
			var email_validation = validateEmail(registration_email_temporary);
			var email_false = "false";
		
			//Step 2A: Check if Email is Valid
			if(email_false.localeCompare(email_validation)) { 	
				

				//Step 3: Check if Email is Taken 
				$.post(CODE_ROOT + 'register.php', { registration_email_temporary: registration_email_temporary }, 
				
				function(data) {						
					var register_email_outcome = data;
					
					//Email Taken (ERROR)
					if (register_email_outcome == 1) {
						$("#js-registration-email").removeClass("login-success-border").addClass("login-error-border");	
						var email_failure_taken_message = "This email has already been taken";			
						$("#js-registration-email-taken-message-output").text(email_failure_taken_message);				
							
					//Email NOT Taken (SUCCESS)
					} else {

						$("#js-registration-email-taken-message-output").text("");	
						$("#js-registration-email").removeClass("login-error-border").addClass("login-success-border");																								
					}
				})
			
			//Step 2B: Email Not Valid
			} else {
				
				//Error
				$("#js-registration-email").removeClass("login-success-border").addClass("login-error-border");			
			}	

		//Step 1B: Email is empty				
		} else {
			
			$("#js-registration-email").removeClass("login-error-border");		
			$("#js-registration-email").removeClass("login-success-border");				
		}			
		
	});
});

//Function R7: Register User
$(document).ready(function(){
	$("#js-register-user").click(function(){	
	
		//Get all Input Registration Variables
		var register_new_user  		 	= "true";		
		var registration_user_name 	 	= $('input[name=register-user-name]').val();
		var registration_email			= $('input[name=register-email]').val();
		var registration_password    	= $('input[name=register-password]').val();
		var registration_full_name   	= $('input[name=register-full-name]').val();						

		var registration_hash			= $('input[name=registration-hash]').val();						
		var registration_new_user_email = $('input[name=registration-new-user-email]').val();						
		var registration_group_id   	= $('input[name=registration-group-id]').val();						
		var registration_list_id  	    = $('input[name=registration-list-id]').val();						
		var registration_invite_from    = $('input[name=registration-invite-from]').val();						
		var new_friend_invite_from      = $('input[name=new-friend-invite-from]').val();						
		var list_type   				= $('input[name=list-type]').val();						

		//STEP 1: Validate Email with Client Side Code 
		var email_validation = validateEmail(registration_email);
		var email_false = "false";
		
		//Sucess
		if(email_false.localeCompare(email_validation)) {
			var email_validation_correct = 1;	
			
		//Error 
		} else {
			var email_validation_correct = 0;				
		}
	
		//STEP 2: A Field Value is Missing
		if (!registration_user_name) { 			
			$("#js-registration-error-message-empty-field-text").show();
			//$("#js-registration-error-message-empty-field-text").html('<p class = "registration-error-message-text"> Please fill in all four fields. </p');
		} else if (!registration_email) {
			$("#js-registration-error-message-empty-field-text").show();
		} else if (!registration_password) {
			$("#js-registration-error-message-empty-field-text").show();
		} else if (!registration_full_name) {
			$("#js-registration-error-message-empty-field-text").show();
		
		//STEP 3: All Values are Filled Check Registration 
		} else {
			$("#js-registration-error-message-empty-field-text").hide();
				
			
			//Register User 
			$.post(CODE_ROOT + 'register.php', { 
				register_new_user: register_new_user, 
				registration_user_name: registration_user_name, 
				registration_email: registration_email, 
				registration_password: registration_password, 
				registration_full_name: registration_full_name, 
				email_validation_correct: email_validation_correct,
				registration_hash: registration_hash, 								
				registration_new_user_email: registration_new_user_email,					
				registration_group_id: registration_group_id,					
				registration_list_id: registration_list_id,	    				
				registration_invite_from: registration_invite_from,   	
				new_friend_invite_from: new_friend_invite_from,
				list_type: list_type				
			}, 
			
			function(data) {
				console.log(data);
				
				var registration_outcome_array = JSON.parse(data);
				var registration_master_outcome = registration_outcome_array["master_success"];	
				
				//Handle Success
				if(registration_master_outcome == 1) {
					
					//Part 1: Make sure all error message are removed 
	
					//UserName
					$("#js-registration-user-name-error-output").text("");
					$("#js-registration-user-name").removeClass("login-error-border").addClass("login-success-border");
					
					//Full Name
					$("#js-registration-full-name").removeClass("login-error-border").addClass("login-success-border");
					$("#js-registration-full-name-message-output").text("");						
					
					//Email
					$("#js-registration-email").removeClass("login-error-border").addClass("login-success-border");
					$("#js-registration-email-message-output").text("");		
					
					//Password 
					$("#js-registration-password").removeClass("login-error-border").addClass("login-success-border");	
					$("#js-registration-password-message-output").text("");						
					
					//Part 2: Handle Registration 
					//console.log("SUCCESS");
					$('input[name=register-user-name]').val("");
					$('input[name=register-email]').val("");
					$('input[name=register-password]').val("");
					$('input[name=register-full-name]').val("");						
					
					$("#js-registration-area").hide();
					$("#js-registration-success").show();
				
				//Handle Failure 
				} else {
					
					//Get JSON call back function array with error information  
					var register_outcome_array = JSON.parse(data);
					var username_failure = register_outcome_array["username_failure"];
					var full_name_failure = register_outcome_array["full_name_failure"];
					var email_failure = register_outcome_array["email_failure"];		
					var email_taken_failure = register_outcome_array["email_taken_failure"];		
					var email_taken = register_outcome_array["email_taken"];		
					var password_failure = register_outcome_array["password_failure"];					
					
					//Username Error
					if(username_failure == 1) {
						var username_failure_message  = register_outcome_array["user_name_message"];			
						$("#js-registration-user-name").removeClass("login-success-border").addClass("login-error-border");	
						$("#js-registration-user-name-error-output").text(username_failure_message);
					} else {
						$("#js-registration-user-name-error-output").text("");
						$("#js-registration-user-name").removeClass("login-error-border").addClass("login-success-border");
					}
					
					//Full Name Error
					if(full_name_failure == 1) {
						var full_name_failure_message = register_outcome_array["full_name_message"];
						$("#js-registration-full-name").removeClass("login-success-border").addClass("login-error-border");	
						$("#js-registration-full-name-message-output").text(full_name_failure_message);						
						
						//js-registration-full-name-message-output
					} else {
						$("#js-registration-full-name").removeClass("login-error-border").addClass("login-success-border");
						$("#js-registration-full-name-message-output").text("");	
					}
					
					//Email Error
					if(email_failure == 1 || email_taken_failure == 1) {
						
						//Email Invalid
						if(email_failure == 1) {
							var email_failure_message = register_outcome_array["email_message"];
							$("#js-registration-email").removeClass("login-success-border").addClass("login-error-border");	
							$("#js-registration-email-message-output").text(email_failure_message);							
						} else {
							$("#js-registration-email-message-output").text("");	
						}
						
						//Email Taken
						if(email_taken_failure == 1) {
							var email_failure_taken_message = register_outcome_array["email_taken"];
							$("#js-registration-email").removeClass("login-success-border").addClass("login-error-border");	
							$("#js-registration-email-taken-message-output").text(email_failure_taken_message);							
						} else {
							$("#js-registration-email-taken-message-output").text("");	
						}
						
					} else {
						$("#js-registration-email").removeClass("login-error-border").addClass("login-success-border");
						$("#js-registration-email-message-output").text("");	
						$("#js-registration-email-taken-message-output").text("");	
					}

					//Password Error
					if(password_failure == 1) {
						var password_failure_message = register_outcome_array["password_message"];
						$("#js-registration-password").removeClass("login-success-border").addClass("login-error-border");
						$("#js-registration-password-message-output").text(password_failure_message);	
						
					} else {
						$("#js-registration-password").removeClass("login-error-border").addClass("login-success-border");	
						$("#js-registration-password-message-output").text("");
					}					

					//Put Password back into box 
					$("#js-registration-password").val(registration_password);
				}	
			
				//Put Password back into box 
				$("#js-registration-password").val(registration_password);  
				
			})
		}
    });
});

//Function R8: Register User with Email 
//Bundle to Function R9

//Function R9: Remove please fill in all fields if they are full
function testForEmptyFormField() {

		var user_name_temporary = $('input[name=register-user-name]').val();	
		var registration_full_name_temporary = $('input[name=register-full-name]').val();
		var registration_password_temporary = $('input[name=register-password]').val();
		var registration_email_temporary = $('input[name=register-email]').val();
		var form_has_empty_value = 0;
		
		//Part 1: Test User Name Empty
		if (!user_name_temporary) { 
			var form_has_empty_value = form_has_empty_value + 1;
			//alert("user name");
		} 
			
		//Part 2: Test Registration Empty
		if (!registration_full_name_temporary) { 
			var form_has_empty_value = form_has_empty_value + 1;
			//alert("name");		
		} 
			
		//Part 3: Test Password Empty
		if (!registration_password_temporary) { 
			var form_has_empty_value = form_has_empty_value + 1;
			//alert("passowrd");	
		} 
			
		//Part 4: Test Email Empty
		if (!registration_email_temporary) { 
			var form_has_empty_value = form_has_empty_value + 1;
			//alert("email");
		} 
		
		if(form_has_empty_value == 0) {
			$('#js-registration-error-message-empty-field-text').hide();
		}
}

//Function R10: Validate Email
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}













