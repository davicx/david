<?php 
	/*
	$password = "hello";
	echo  "Original: " . $password;
	echo "<br />";
	$encryptPassword = sha1($password);
	echo "Encrypt: " . $encryptPassword;
	$salt = time(); //Returns the current time measured in the number of seconds since the Unix Epoch //https://en.wikipedia.org/wiki/Leap_second
	echo "<br />";
	echo  "Salt: " . $salt;
	echo "<br />";
	//echo $encryptPassword;
	$pwd = sha1($password . $salt);
	*/


	require_once('includes/connection.inc.php');

	function getFileType($serverImageName, $userName) {
		//$fileName = $serverImageName;
		$ext = pathinfo($serverImageName, PATHINFO_EXTENSION);
		
		$ext = strtolower($ext);
		$word = "doc";
		$wordx = "docx";
		$excel = "xls";
		$excelx = "xlsx";
		$pdf = "pdf";
		$png = "png";
		$jpeg = "jpg";
		$gif = "gif";

		if(strcmp($ext, $word) == 0) {
			return $fileName = "word.png";
		} else if(strcmp($ext, $wordx) == 0) {
			return $fileName = "word.png";
		} else if(strcmp($ext, $excel) == 0) {
			return $fileName = "excel.png";
		} else if(strcmp($ext, $excelx) == 0) {
			return $fileName = "excel.png";
		} else if(strcmp($ext, $pdf) == 0) {
			return $fileName = "adobe.png";
		} else if(strcmp($ext, $png) == 0) {
			$fileName = $serverImageName;
			$fileName = $userName ."/". $fileName;
			return $fileName;
		} else if(strcmp($ext, $jpeg) == 0) {
			$fileName = $serverImageName;
			$fileName = $userName ."/". $fileName;
			return $fileName;
		} else if(strcmp($ext, $gif) == 0) {
			$fileName = $serverImageName;
			$fileName = $userName ."/". $fileName;
			return $fileName;
		} else {
			return $fileName = "unknown.png";
		}
	}
	
	//Get image from user 
	function getUserImage($logged_in_user) {
		global $conn;	
		
		if (mysqli_connect_errno()) {
		  //$output = "Failed to connect to MySQL: " . mysqli_connect_error();
		}
		
		//Get Image Name 	
		if ($result = mysqli_prepare($conn, "SELECT image_name FROM user_profile WHERE user_name=?")) {
			$result -> bind_param("s", $logged_in_user);
			$result -> execute(); 
			$result -> bind_result($result_image);
			$result -> fetch();
			$userImage = $result_image;
			$result -> close();
		} 

		return $userImage; 
	}

	
	//Get friends of logged in user
	function getUserFriends($logged_in_user) {		
		//$conn = mysqli_connect("localhost","root", MYSQL_PASS,"sharespace");

		// Check connection
		if (mysqli_connect_errno()) {
		  echo "Failed to connect to MySQL: " . mysqli_connect_error();
		}
	
		//Friends- Get all Friends (A join query from friends table to find friend ID of logged in user and then pull their info from the user profile table 
		$sql = "SELECT friends.friends_id, user_profile.user_name, user_profile.first_name, user_profile.user_id, user_profile.image_name
		FROM friends INNER JOIN user_profile ON (user_profile.user_id = friends.friend_id) WHERE (friends.user_name = '$logged_in_user')";
		$result_friends = $conn->query($sql) or die(mysqli_error());
		
		return $result_friends; 
	}


	
	



?>
