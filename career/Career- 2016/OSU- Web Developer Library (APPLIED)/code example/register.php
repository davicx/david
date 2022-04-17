<?php
require_once('includes/constants.inc.php');
require_once('functions.php');
require_once('includes/connection.inc.php');
require_once('classes/Posts.php');
require_once('classes/Notifications.php');
require_once('classes/User.php');
require_once('classes/Groups.php');
require_once('classes/MasterList.php');

/*
FUNCTIONS R: Registration and Login Functions
	1) Function R1: Check if Username is correct 
	2) Function R2: Check if Full Name is correct 
	3) Function R3: Check if First Name is correct 
	4) Function R4: Check if Last Name is correct 
	5) Function R5: Check if Password is correct 
	6) Function R6: Check if Email is correct 
	7) Function R7: Register User 

*/

//FUNCTIONS R: Registration and Login Functions
//Function R7: Register User 
//*this passes back an associative array that says if there error (0) or success (1) registering and an error message
if (isset($_POST["register_new_user"]) && (!empty($_POST["register_new_user"]))) {	
	global $conn;	

	//STEP 1: Gather all Input Variables 	
	$registration_user_name 	= $_POST["registration_user_name"];
	$registration_full_name 	= $_POST["registration_full_name"]; 	
	$registration_email 		= $_POST["registration_email"]; 
	$registration_password 		= $_POST["registration_password"]; 
	$email_validation_correct 	= $_POST["email_validation_correct"]; 
	$full_name  				= $registration_full_name;
	$full_name_array  			= explode(" ",$full_name);
	$first_name 				= "";
	$last_name 					= "";
	
	//Check if email is taken  
	if ($result = mysqli_prepare($conn, "SELECT email FROM user_profile WHERE email=?")) {
		$result -> bind_param("s", $registration_email);
		$result -> execute();
		$result -> bind_result($result_email);
		$result -> fetch();
		$user_email = $result_email;
		$result -> close();
		if(empty($user_email)) {
			//$email_available_test =   "AVAILABLE " . 0;
			$email_available_test = 0;
		} else {
			//$email_available_test ="TAKEN " .  1;	
			$email_available_test = 1;	
		}
	} 	

	//First and Last Name 
	if(isset($full_name_array[0])) {
		$first_name = $full_name_array[0];
	}
	
	if(isset($full_name_array[1])) {
		$last_name = $full_name_array[1];
	}	
	
	if(isset($full_name_array[2])) {
		$last_name = "";
		$last_name = $full_name_array[1] . " " . $full_name_array[2];
	}
	
	//Registration Type (this will have values if they received an invite from an existing site user)
	$registration_hash 				= $_POST["registration_hash"]; 	
	$registration_new_user_email 	= $_POST["registration_new_user_email"]; 	
	$registration_group_id 			= $_POST["registration_group_id"]; 	
	$registration_list_id 			= $_POST["registration_list_id"]; 	
	$registration_invite_from 		= $_POST["registration_invite_from"]; 	
	$new_friend_invite_from 		= $_POST["new_friend_invite_from"]; 	
	$list_type 						= $_POST["list_type"]; 	
	
	//STEP 2: Check for Errors
	//This will create the array $register_outcome_array which will hold all the error messages or if succesful, success will be set to 1
	$total_errors        = 0;
		
	//Errors for each input type
	$register_outcome_array['username_failure'] = 0;
	$register_outcome_array['full_name_failure'] = 0;
	$register_outcome_array['password_failure'] = 0;
	$register_outcome_array['email_failure'] = 0;	
	$register_outcome_array['email_taken_failure'] = 0;
		
	//Part 1: User Name Errors
	$register_user_name_array = checkValidUsername($registration_user_name);
	
	//The checkValidUsername returns an associate array with 1 (success) or 0 (errors) for each test, and 1 or 0 for the total outcome 
	$register_user_name_outcome = $register_user_name_array['register_user_name_outcome'];
	$user_name_length_test = $register_user_name_array['user_name_length_test'];
	$user_name_character_test = $register_user_name_array['user_name_character_test'];
	$user_name_taken_test = $register_user_name_array['user_name_taken_test'];

	if($register_user_name_outcome == 0) {
		$register_outcome_array['master_success'] = 0;
		$register_outcome_array['user_name_success'] = 0;
		$total_errors = $total_errors + 1;
		$register_outcome_array['username_failure'] = 1;
			
		//There are 3 tests for the username 1 means that this current username passed that test 0 means it failed 		
		if($user_name_length_test == 0) {
			$register_outcome_array['user_name_message'] = "The User Name must be at least 5 letters";	
		} else if ($user_name_character_test ==0) {
			$register_outcome_array['user_name_message'] = "The User Name must be letters, numbers or an undescore";	
		} else if ($user_name_taken_test ==0)  {
			$register_outcome_array['user_name_message'] = "Sorry! This User Name has been taken already";				
		} else {
			$register_outcome_array['user_name_message'] = "An unexpected error has occured please try again";	
		}
	}
	
	//Part 2: Full Name Errors		
	if (strlen($registration_full_name ) < 3 ) {
		$total_errors = $total_errors + 1;	
		$register_outcome_array['master_success'] = 0;
		$register_outcome_array['full_name_failure'] = 1;	
		$register_outcome_array['full_name_message'] = "Your Name should be at least 3 letters";	
	}
	
	//Part 3: Password Errors
	if (strlen($registration_password ) < 5) {
		$total_errors = $total_errors + 1;	
		$register_outcome_array['master_success'] = 0;
		$register_outcome_array['password_failure'] = 1;		
		$register_outcome_array['password_message'] = "Your password should be at least 5 letters";			
	} 
	
	//Part 4: Email Errors
	if ($email_validation_correct == 0) {	
		$total_errors = $total_errors + 1;
		$register_outcome_array['master_success'] = 0;
		$register_outcome_array['email_failure'] = 1;	
		$register_outcome_array['email_message'] = "Please enter a valid email";	
	}
	
	//Part 5: Email Taken 
	if ($email_available_test == 1) {	
		$total_errors = $total_errors + 1;
		$register_outcome_array['master_success'] = 0;
		$register_outcome_array['email_taken_failure'] = 1;	
		$register_outcome_array['email_taken'] = "This email has already been taken";		
	} 
	
	
	//STEP 3: Register User (No Errors)
	if ($total_errors == 0) {
		$register_outcome_array['master_success'] = 1;
		
		//TYPE: Invite
		if($registration_hash != 0) {
			
			//Type 1: Register User Group Invite
			if($registration_group_id != 0) {
				
				//Register User and Add Person as Friend 
				$Current_User = new User($registration_user_name);
				$Current_User->registerUserEmail($registration_user_name, $first_name, $last_name, $registration_email, $registration_password, $registration_hash, $registration_invite_from); 	
 
				//Find Group ID from Code Hash
				$selected_friends = array($registration_user_name);
				$query = "SELECT request_from FROM pending_email WHERE codehash ='$registration_hash' LIMIT 1";
				$result = mysqli_query($conn, $query);
				$row = mysqli_fetch_assoc($result);
				$logged_in_user_request = $row['request_from'];
						
				//Instantiate group then add this new user to the group as a pending member 
				$Current_Group = new Group($registration_group_id);
				$Current_Group->addUserExisting($registration_group_id, $selected_friends, $logged_in_user_request);		
			
			//TYPE 3: Register User List Invite
			} else if ($registration_list_id != 0) {

				//Set up all Variables 
				$active_member = 1;
				$list_privelege = "viewer";
				$selected_friends = array($registration_user_name);

				//Register User and Add Person as Friend 
				$Current_User = new User($registration_user_name);
				$Current_User->registerUserEmail($registration_user_name, $first_name, $last_name, $registration_email, $registration_password, $registration_hash, $registration_invite_from); 	
					
				//Add User to List 
				$logged_in_user = $registration_invite_from;
				$logged_in_user = "vasquezd";
				$Current_List = new MasterList($logged_in_user, $list_type, $registration_list_id);
				$Current_List->addUserExistingView($registration_list_id, $list_type, $selected_friends, $logged_in_user);		
				
				
			//TYPE 4: Register User Friend Invite
			} else if ($new_friend_invite_from != 0) {
				
			
			//TYPE 5: There was an error so allow standard registration 
			} else {
				
			}
			
		//TYPE: New User 	
		} else {
			//Type 5: Register Standard User 
		
			//Create User
			$Current_User = new User($registration_user_name);
			$Current_User->registerUser($registration_user_name, $first_name, $last_name, $registration_email, $registration_password); 	

			//Create Default List
			$list_name = "Your First List ";
			$list_type = "first_list";
			createNewDefaultList($registration_user_name, $list_type, $list_name);		
			
		}
	} 
	
	//STEP 4: Return Value to Client to handle View Update 	
	echo json_encode($register_outcome_array);	
	
}


//Function R1: Check if Username is correct 
if (isset($_POST["user_name_temporary"]) && (!empty($_POST["user_name_temporary"]))) {	
	$user_name_temporary  	= $_POST["user_name_temporary"]; 
	
	//Call Function to Check User Name 
	$register_user_name_array = checkValidUsername($user_name_temporary);
	
	echo json_encode($register_user_name_array);	

}


//Function R2: Check if Full Name is correct 
if (isset($_POST["registration_full_name_temporary"]) && (!empty($_POST["registration_full_name_temporary"]))) {	
	$full_name_temporary = $_POST["registration_full_name_temporary"]; 
	$full_name_test = 0;
	
	//Part 1: Make sure name is more then 3 characters 
	if(strlen($full_name_temporary) > 2 ) {
		$full_name_test = 1;	
	}
	
	echo $full_name_test;
}


//Function R3: Check if First Name is correct
//Function R4: Check if Last Name is correct 


//Function R5: Check if Password is correct 
//*Handled in Javascript 

//Function R6: Check if Email is correct 
if (isset($_POST["registration_email_temporary"]) && (!empty($_POST["registration_email_temporary"]))) {	
	$registration_email_temporary = $_POST["registration_email_temporary"]; 
		
	//Check if email is taken  
	if ($result = mysqli_prepare($conn, "SELECT email FROM user_profile WHERE email=?")) {
		$result -> bind_param("s", $registration_email_temporary);
		$result -> execute();
		$result -> bind_result($result_email);
		$result -> fetch();
		$user_email = $result_email;
		$result -> close();
		if(empty($user_email)) {
			//$email_available_test =   "AVAILABLE " . 0;
			$email_available_test = 0;
		} else {
			//$email_available_test ="TAKEN " .  1;	
			$email_available_test = 1;	
		}
	} 	
	echo $email_available_test;
}

















