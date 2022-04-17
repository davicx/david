<?php
require_once('includes/constants.inc.php');
//require_once(CODE_ROOT . '../functions/classes/Posts.php');
require_once('includes/connection.inc.php');	
require_once('classes/Notifications.php'); 

/* FUNCTIONS 
FUNCTIONS A: Security 
	1) Function A1: Encypt with IV 
	2) Function A2: Decrypt with IV 
	3) Function A3: Encypt Item with Key 
	4) Function A4: Decypt Item with Key 
	5) Function A5: Create New IV
	6) Function A6: Create New Key
	7) Function A7: Secure Random Cytpto
	8) Function A8: Create Token 
	
FUNCTIONS B: Type Conversion 
	1) Function B1: Convert String to Hex 
	2) Function B2: Convert Hex to String 
	
FUNCTIONS C: File Handling
	1) Function C1: Get File Type and return image 

FUNCTIONS D: Group and List Related 
	1) Function D1: Get List Privilege 
	2) Function D2: Get List name 
	3) Function D3: Create Default List 
	4) Function D4: Get Group Users 
	5) Function D5: Get all Group Id's that User belongs to  

FUNCTIONS E: Analytics
	1) Function E1: Update Page Visit 

FUNCTIONS F: Web Parsing
	1) Function F1: Get all Images from website
	2) Function F2: Get File Contents from URL (Entire Page)
	3) Function F3: Sort all images from a URL into an Associate Array that has the image size and the image URL
	4) Function F4: This function takes an associative array and saves array images to a server 
	5) Function F5: Get article text from meta tags from a URL 
	6) Function F6: Get Site Title
	7) Function F7: Get Site Favicon, save it and return name
	8) Function F8: Get a base domain from a full URL 
	9) Function F9: Determine where a video is from and get video code

FUNCTIONS G: User Related 
	1) Function G1: Create User
	2) Function G2: Get User Site Status 
	3) Function G3: Get UserID
	4) Function G4: Get UserName
	5) Function G5: Get Friend Status 
	6) Function G6: Get image from a user **Move to class 	
	7) Function G7: Check for valid UserName
	8) Function G8: Update Password
	9) Function G9: Check if email taken 
	10) Function G10: Convert array of usernames to user ids
	
FUNCTIONS H: Group Related 
	1) Function H1: Get All User Groups
	
FUNCTIONS I: Filters and Data Handling 
	1) Function I1: Search String for word and return array of that word 
	2) Function I2: Compare if two images are the same 
	3) Function I3: Remove non images files from the string 
	4) Function I4: Check if string starts with 
	5) Function I5: Check if string ends with 
	6) Function I6: Get Path of file or link or folder (Site Specific)
	7) Function I7: Get File Type and return image 

FUNCTIONS J: Database Related  
	1) Function J1: Get User Status
	2) Function J2: Get the parent of a file or folder directory 
	3) Function J3: Get UserID
	4) Function J4: Get UserName

FUNCTIONS K1: Notification Related **Move to class 
	1) Function K1: Convert array of usernames to user ids
	2) Function K2: Set Logout time when user logs out of profile 

FUNCTIONS: External Code

FUNCTIONS: Appendix

*/


//FUNCTIONS: SECURITY
$encryption_key = E_KEY;
$iv = IV;
$personal_IV = "this";
$personal_KEY = "this";
$hack_key = "H139fhw0";
$original = "password";

$encyrpt_one = @encryptWithIV($original, $personal_KEY, $personal_IV);
$encyrpt_two = @encryptWithIV($encyrpt_one, $encryption_key, $iv);
$decrypt_two = @decryptWithIV($encyrpt_two, $encryption_key, $iv);
$decrypt_original = @decryptWithIV($decrypt_two, $personal_KEY, $personal_IV);

//Function A1: Encypt with IV 
//Part 1: Encrypt 
function encryptWithIV($original_string, $encryption_key, $iv){
	$encrypted_string = openssl_encrypt(
		pkcs7_pad($original_string, 16), // padded data
		'AES-256-CBC',        // cipher and mode
		$encryption_key,      // secret key
		0,                    // options (not used)
		$iv                   // initialisation vector
	);
	
	return $encrypted_string;
}

//Part 2: Pad Data 
function pkcs7_pad($data, $size){
    $length = $size - strlen($data) % $size;
    return $data . str_repeat(chr($length), $length);
}

//Function A2: Decrypt with IV 
//Part 1: Decrypt
function decryptWithIV($encrypted_string, $encryption_key, $iv){
	$original_string = pkcs7_unpad(openssl_decrypt(
		$encrypted_string,
		'AES-256-CBC',
		$encryption_key,
		0,
		$iv
	));

	return $original_string;
}

//Part 2: Depad Data
function pkcs7_unpad($data){
    return substr($data, 0, -ord($data[strlen($data) - 1]));
}

//Function A3: Encypt Item with Key 
function encryptItem($master_key, $string_original, $encryption_key, $iv) {
	
	//STEP 1: Combine Master Key and String Original 
	//$key_locked_value = $master_key . "____" . $string_original;
	$encryption_key = E_KEY;
	$iv = IV;
	$personal_IV = "C3933A6CBBD57C3A4C821A7C53A816C3A5264DC5DC44C2AF";
	$personal_KEY = $master_key;
	$encyrpt_one = @encryptWithIV($string_original, $personal_KEY, $personal_IV);
	$encyrpted_final = @encryptWithIV($encyrpt_one, $encryption_key, $iv);
	//$decrypt_two = @decryptWithIV($encyrpt_two, $encryption_key, $iv);
	//$decrypt_original = @decryptWithIV($decrypt_two, $personal_KEY, $personal_IV);

	return $encyrpted_final;
}


//Function A4: Decypt Item with Key 
function decryptItem($master_key, $string_encrypted, $encryption_key, $iv) {
	$encryption_key = E_KEY;
	$iv = IV;
	$personal_IV = "C3933A6CBBD57C3A4C821A7C53A816C3A5264DC5DC44C2AF";
	$personal_KEY = $master_key;
	
	//STEP 1: Decrypt Original String
	$decrypt_two = @decryptWithIV($string_encrypted, $encryption_key, $iv);

	//STEP 2: Seperate Key and String
	$string_decrypted = @decryptWithIV($decrypt_two, $personal_KEY, $personal_IV);
	
	return $string_decrypted;
	
}

//Function A5: Create New IV
function createIV ($null) {
	$iv_size = 16; // 128 bits
	$iv = bin2hex(openssl_random_pseudo_bytes($iv_size, $strong));	
	return $iv;
}

//Function A6: Create New Key
function createKey($null) {
	$key_size = 32; // 256 bits
	$encryption_key = bin2hex(openssl_random_pseudo_bytes($key_size, $strong));
	return $encryption_key;
}

//Function A7: Secure Random Cytpto	
function crypto_rand_secure($min, $max) {
        $range = $max - $min;
        if ($range < 0) return $min; // not so random...
        $log = log($range, 2);
        $bytes = (int) ($log / 8) + 1; // length in bytes
        $bits = (int) $log + 1; // length in bits
        $filter = (int) (1 << $bits) - 1; // set all lower bits to 1
        do {
            $rnd = hexdec(bin2hex(openssl_random_pseudo_bytes($bytes)));
            $rnd = $rnd & $filter; // discard irrelevant bits
        } while ($rnd >= $range);
        return $min + $rnd;
}

//Function A8: Create Token 
function getToken($length=32){
    $token = "";
    $codeAlphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    $codeAlphabet.= "abcdefghijklmnopqrstuvwxyz";
    $codeAlphabet.= "0123456789";
    for($i=0;$i<$length;$i++){
        $token .= $codeAlphabet[crypto_rand_secure(0,strlen($codeAlphabet))];
    }
    return $token;
}

//FUNCTIONS B: Type Conversion 
//Function B1: Convert String to Hex 
function strToHex($string){
    $hex = '';
    for ($i=0; $i<strlen($string); $i++){
        $ord = ord($string[$i]);
        $hexCode = dechex($ord);
        $hex .= substr('0'.$hexCode, -2);
    }
    return strToUpper($hex);
}

//Function B2: Convert Hex to String 
function hexToStr($hex){
    $string='';
    for ($i=0; $i < strlen($hex)-1; $i+=2){
        $string .= chr(hexdec($hex[$i].$hex[$i+1]));
    }
    return $string;
}


//FUNCTIONS C: FIILE HANDLING
//Function C1: Get File Type and return image 
function getFileImage($serverImageName) {
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
	$mp3 = "mp3";
	$wmv = "wmv";
	
	//Documents
	if(strcmp($ext, $word) == 0) {
		return $fileName = "icons/word.png";
	} else if(strcmp($ext, $wordx) == 0) {
		return $fileName = "icons/word.png";
	} else if(strcmp($ext, $excel) == 0) {
		return $fileName = "icons/excel.png";
	} else if(strcmp($ext, $excelx) == 0) {
		return $fileName = "icons/excel.png";
	} else if(strcmp($ext, $pdf) == 0) {
		return $fileName = "icons/adobe.png";
	
	//Images 
	} else if(strcmp($ext, $png) == 0) {
		$fileName = $serverImageName;
		//$fileName = $userName ."/". $fileName;
		return $fileName;
	} else if(strcmp($ext, $jpeg) == 0) {
		$fileName = $serverImageName;
		//$fileName = $userName ."/". $fileName;
		return $fileName;
	} else if(strcmp($ext, $gif) == 0) {
		$fileName = $serverImageName;
		//$fileName = $userName ."/". $fileName;
		return $fileName;
		
	//Media (Movies and Music)	
	} else if(strcmp($ext, $mp3) == 0) {
		return $fileName = "icons/music.png";
	} else if(strcmp($ext, $wmv) == 0) {
		return $fileName = "icons/movie.png";
	} else {
		return $fileName = "icons/unknown.png";
	}
}


//FUNCTIONS D: LIST AND GROUP RELATED 
//Function D1: Get List Privilege 
function getListPrivilege($user_name, $list_id) {
	global $conn;

	$result = mysqli_query($conn,"SELECT * FROM list WHERE user_name = '$user_name' AND list_id = $list_id");

	while($row = mysqli_fetch_array($result)) {		
		$user_privilege = $row['user_privilege'];
	}
	
	//If user was found return 
	if(isset($user_privilege)) {
		return $user_privilege;	
	} 
}

//Function D2: Get List Privilege (Boolean) 
function getListPrivilegeBoolean($user_name, $list_id) {
	global $conn;

	$result = mysqli_query($conn,"SELECT * FROM list WHERE user_name = '$user_name' AND list_id = $list_id");

	while($row = mysqli_fetch_array($result)) {		
		$user_privilege = $row['user_privilege'];
	}
	
	//If user was found return 
	if(isset($user_privilege)) {
		$user_privilege = strtolower($user_privilege);
		$user_privilege = strcmp($user_privilege, "view");
		
		return $user_privilege;	
	} 
}


//Function D3: Get List name 
function getListName($list_id) {
	global $conn;

	$result = mysqli_query($conn,"SELECT * FROM list WHERE list_id = $list_id");

	while($row = mysqli_fetch_array($result)) {		
		$list_name = $row['list_name'];
	}
	
	return $list_name;
}


//Function D4: Create Default List 
function createNewDefaultList($logged_in_user, $list_type, $list_name) {
	global $conn;
	$user_name = $logged_in_user;
	$active_status = 1;
	$is_default = 1; 	
	$user_privilege = "own";
	$created_by = $logged_in_user;
	$shared_with = $logged_in_user;
	
	//Get User ID 
	if ($result = mysqli_prepare($conn, "SELECT user_id FROM user_profile WHERE user_name=?")) {
		$result -> bind_param("s", $user_name);
		$result -> execute();
		$result -> bind_result($result_user_id);
		$result -> fetch();
		$user_id = $result_user_id;
		$result -> close();
	} 		
	
	//Generate Unique Key 
	$unique_key = md5(microtime().rand());

	$insert = $conn->prepare("INSERT INTO list (user_name, user_id, user_privilege, 
	created_by, shared_with, list_type, list_name, unique_key, is_default, active_status, created) 
	
	VALUES (?,?,?,?,?,?,?,?,?,?, NOW()) ");
	$insert->bind_param('sissssssii', $user_name, $user_id, $user_privilege, $created_by, $shared_with,  $list_type, $list_name, $unique_key, $is_default, $active_status);

	if ($insert->execute()) {
		//echo "New list created";
	} else {
		//echo "error";
	}

	//Get Unique key to update post id 		
	if ($result = mysqli_prepare($conn, "SELECT list_primary_id FROM list WHERE unique_key=?")) {
		$result -> bind_param("s", $unique_key);
		$result -> execute();
		$result -> bind_result($result_key);
		$result -> fetch();
		$list_primary_id = $result_key;
		$result -> close();
	} 		

	//Update post ID 
	$sql = "UPDATE list SET list_id = '$list_primary_id' WHERE unique_key= '$unique_key'";

	if ($conn->query($sql) === TRUE) {
		//echo "List ID updated successfully ";
	} else {
		//echo "Error updating record: " . $conn->error;
	}

	//Insert new user into database 
	$active_member = 1;
	
	$insert = $conn->prepare("INSERT INTO list_users (list_id, user_name, user_privilege, active_member, created) VALUES (?, ?, ?, ?, NOW()) ");
	$insert->bind_param('issi', $list_primary_id, $user_name, $user_privilege, $active_member);
	
	if ($insert->execute()) {
		//echo "New list created";
	} else {
		//echo "error";
	}
	return $list_primary_id;
}


//Function D5: Get Group Users 
function getGroupUsers($logged_in_user, $master_site) {
	global $conn;
	
	$result_groups = mysqli_query($conn,"SELECT group_users.group_id FROM group_users INNER JOIN groups
		ON group_users.group_id = groups.group_id
		WHERE user_name = '$logged_in_user'
		AND active_member = '1' ");
	
	$logged_in_user_groups_array = array();
	$logged_in_user_groups_count = 0;
	
	//Create Group  
	while($row_groups = mysqli_fetch_array($result_groups)) {	
		//Get Group Information 
		$group_id = $row_groups['group_id'];
		$group_id = $row_groups['group_id'];
		$logged_in_user_groups_array[$logged_in_user_groups_count] = $group_id;		
		$logged_in_user_groups_count = $logged_in_user_groups_count + 1;
	}	
	
	//Build Unique array and reset index 
	$logged_in_user_groups_array = array_unique($logged_in_user_groups_array);	
	$logged_in_user_groups_array =  array_values($logged_in_user_groups_array);
	
	return $logged_in_user_groups_array;
}


//Function D6: Get all Group Id's that User belongs to 
function getUsersGroups($logged_in_user) {
	global $conn;
	
	//Instantiate Variables 
	$total_groups_array = array();
	$total_groups_array_count = 0;	
	
	//Select All Groups
	//$result_groups = mysqli_query($conn,"SELECT group_id FROM group_users WHERE user_name = '$logged_in_user' AND active_member = '1'");
	$result_groups = mysqli_query($conn,"SELECT group_users.group_id FROM group_users INNER JOIN groups
		ON group_users.group_id = groups.group_id
		WHERE user_name = '$logged_in_user'
		AND active_member = '1' ");
		
	//Create Group  
	while($row_groups = mysqli_fetch_array($result_groups)) {	
		
		$group_id = $row_groups['group_id'];
		$total_groups_array[$total_groups_array_count] = $group_id;		
		$total_groups_array_count = $total_groups_array_count + 1;		
	}	
	
	//Build Unique array and reset index 
	$total_groups_array = array_unique($total_groups_array);	
	$total_groups_array =  array_values($total_groups_array);
	
	return $total_groups_array;

}


//FUNCTIONS E: ANALYTICS
//Function E1: Update Page Visit
function updatePageVisit($page_url, $group_id, $logged_in_user) {
	global $conn;
		
	//Check if the user has visited this page before 
	$result_analytics = mysqli_query($conn,"SELECT * FROM user_analytics WHERE user_name = '$logged_in_user' 
		AND page_url = '$page_url'
		AND group_id = '$group_id'");
	
	//If there is a result 
	if ($result_analytics) { 
		
		//Create a New Record for this visit 
		if($result_analytics->num_rows === 0) {
			$total_visits = 0;
			
			$insert = $conn->prepare("INSERT INTO user_analytics (page_url, group_id, total_visits, user_name, last_visit) VALUES (?,?,?,?,NOW()) ");
			$insert->bind_param('siis', $page_url, $group_id, $total_visits, $logged_in_user);

			if ($insert->execute()) {
				//echo "success";				
			}
			
		//Update Current Analytics 
		} else {
			//Update total Page Views
			mysqli_query($conn,"UPDATE user_analytics SET total_visits = total_visits + 1 WHERE page_url = '$page_url' 
				AND user_name = '$logged_in_user'
				AND group_id = '$group_id'");
		}
		
	//There was an error
	} else {
		//echo "ERROR ";
	}
}


//FUNCTIONS F: WEB PARSING 
//Function F1: Get all Images from website
function getWebsiteImages($siteURL) {
 
	$sSourceData = file_get_contents($siteURL);

	$oDOMDoc = new DOMDocument();
	@$oDOMDoc->loadHTML($sSourceData);
	$oNodeList = $oDOMDoc->getElementsByTagName('img');
	$aImages = array();

	foreach ($oNodeList as $oLinkNode) {
		if($oLinkNode->hasAttribute('src')) {
			if( strlen($oLinkNode->getAttribute('src')) > 0) {
				$aImages[] = $oLinkNode->getAttribute('src');
			}
		}
	}
	return $aImages;
}

//Function F2: Get File Contents from URL (Entire Page)
function file_get_contents_curl($url) {
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);

    $data = curl_exec($ch);
    curl_close($ch);

    return $data;
}

//Function F3: Sort all images from a URL into an Associate Array that has the image size and the image URL
function sortWebsiteImagesIntoArray($siteURL) {

	//Call Function to get all Images 
	$imageArray = getWebsiteImages($siteURL);
	
	//Call Function to remove svg links 
	$imageArray = array_filter($imageArray, 'myFilter');
	
	//Filter empty array spots
	$imageArray = array_filter($imageArray);

	//Reset Array Index back to 0 (followed by consecutive integers)
	$imageArray = array_values($imageArray);
	
	$arraySize = sizeof($imageArray);
	$list_of_images = array();
	
	for ($x = 0; $x <= $arraySize-1; $x++) {
		//Check for broken links 
		if(startsWith($imageArray[$x], "htt")==1) {
			list($width, $height) = @getimagesize($imageArray[$x]);
			$imageSize = $width * $height;
			$list_of_images[$imageSize] = $imageArray[$x];
		} else {
			//$list_of_images[$imageSize] = "";
		}		
	} 
	krsort($list_of_images);

	return $list_of_images;
}


//Function F4: This function takes an associative array and saves array images to a server 
function saveImagesToServer($array_of_all_images, $path) {
	$imageNames = array();

	//Save files to server and return location and name of file
	$file_name = 1;
	$iteration =0;
	
	foreach($array_of_all_images as $x => $x_value) {
		if($iteration==3) break;
		//echo "Key=" . $x . ", Value=" . $x_value;
		$file_name_temp = uniqid('', true);
		$file_name = strtr($file_name_temp, array('.' => '', ',' => ''));
			
		$url = $x_value;
		//Check if url is proper format 
		if(startsWith($url, "htt")==1) {
			//echo $url . "<br />";
	
			$img = $path . $file_name . '.jpg';	
			file_put_contents($img, file_get_contents($url));

			$imageNames[$iteration] = $file_name . ".jpg";
			$iteration++;  
		} else {
			$imageNames[$iteration] = "error.jpg";	
		}	
	}
	
	return $imageNames;
}

//Function F5: Get article text from meta tags from a URL 
function getArticleText($articleURL) {
	$html = file_get_contents_curl($articleURL);

	//Parsing begins here:
	$doc = new DOMDocument();
	@$doc->loadHTML($html);
	$nodes = $doc->getElementsByTagName('title');

	//get and display what you need:
	//$title = $nodes->item(0)->nodeValue;
	if ($nodes->length>0) { 
		$title = $nodes->item(0)->nodeValue; 
	}

	$tags = get_meta_tags($articleURL);

	if(isset($tags['description'])) {
		$description = $tags['description'];  // a php manual
	}
	
	$metas = $doc->getElementsByTagName('meta');

	for ($i = 0; $i < $metas->length; $i++){
		$meta = $metas->item($i);
		if($meta->getAttribute('name') == 'description')
			$description_two = $meta->getAttribute('content');
		if($meta->getAttribute('name') == 'keywords')
			$keywords = $meta->getAttribute('content');		
	}
	
	if (isset($description) ) {
		return $description;
	} else if (isset($title) ) {
		return $title;
	} else if (isset($keywords) ) {
		return $keywords;
	} else {
		return "Write an article description here";
	}
}


//Function F6: Get Site Title
function getTitle($Url){
    $str = @file_get_contents($Url);
    if(strlen($str)>0){
        preg_match("/\<title\>(.*)\<\/title\>/",$str,$title);
		//preg_match_all("|<meta[^>]+name=\"([^\"]*)\"[^>]" . "+content=\"([^\"]*)\"[^>]+>|i", $str, $title,PREG_PATTERN_ORDER);
       
		
		if ( ! isset($title[1])) {
		   $title_not_found = "title not found";
		} else {
			$page_title = $title[1];
		}

		$title_not_found = "title not found";
		
		if (!empty($page_title)) {
			return $page_title;
		} else { 
			return $title_not_found;
		}
	}
}


//Function F7: Get Site Favicon, save it and return name
function getFavicon($siteUrl) {
	$testImage = USER_UPLOADS . "favicons/temp/test.png";
	$urlA = 'http://www.google.com/s2/favicons?domain=';	
	$urlB = $siteUrl;
	
	//Step 1: Call function to get the domain name and set this as the image name 
	$imageNameFull = getDomain($urlB);
	
	$imageNameArray = explode(".", $imageNameFull);
	$imageName = $imageNameArray[0] . '.png';
		
	//Create the full url that will have the image
	$url = $urlA . $urlB;
	
	//Create image name 
	$img = $imageName;
	
	//Step 2: Store image in temp folder to check
	//Execute get image function 
	file_put_contents(FAVICON . "temp/" . $img, file_get_contents($url));
	//file_put_contents(FAVICON . "temp/" . $img, file_get_contents($url));
	
	
	//Check the two images inside the temp folder 
	
	$image1 = FAVICON . "temp/" . $imageName;
	$image2 = FAVICON . "temp/test.png";
	
	$imageUniqueCheck = checkTwoImages($image1, $image2);

	
	//Step 3: Process file and save
	//If unique save file and exit. If not unique try next method to get favicon
	if($imageUniqueCheck==1) {
		file_put_contents(FAVICON . $img, file_get_contents($url));
		
		return $imageName;
	} else {
		//Get domain name
		$domainName = getDomain($siteUrl);
		
		//Use domain name to create a url where the favicon can be downloaded from 
		$url2_A = "https://www." . $domainName;
		$url2_B = "/favicon.ico";
		$url2_Full   = $url2_A . $url2_B;

		//Get the file
		$content = @file_get_contents($url2_Full);
		if($content === FALSE) {
			
		} else {
			//Store in the filesystem.
			$fp = fopen(FAVICON . "favicons/" . $img, "w");
			fwrite($fp, $content);
			fclose($fp);

			return $imageName;	
		}
	}
}


//Function F8: Get a base domain from a full URL 
function getDomain($Url) {
	$pieces = parse_url($Url);
	$domain = isset($pieces['host']) ? $pieces['host'] : '';
	
	if (preg_match('/(?P<domain>[a-z0-9][a-z0-9\-]{1,63}\.[a-z\.]{2,6})$/i', $domain, $regs)) {
		return $regs['domain'];
	}
	
	return false;
}


//Function F9: Determine where a video is from and get video code
function processVideo($siteUrl){
	$currentUrl = $siteUrl;
	$domainName = getDomain($currentUrl);
	$youtube = "youtube.com";
	$vimeo = "vimeo.com";
	
	//Check and see if video is from youtube 
	if (strcasecmp($domainName, $youtube) == 0) {
		parse_str( parse_url( $currentUrl, PHP_URL_QUERY ), $url_array);
	
		return $url_array['v'];
	} else if(strcmp($domainName, $vimeo) == 0) {
		$vimeoId = (int) substr(parse_url($currentUrl, PHP_URL_PATH), 1);
		return $vimeoId;		
		
	} else { 
		return "not youtube";
	}
}


	
//FUNCTIONS G: User Related 
//Function G1: Create User
function createUserManually($user_name, $password) {
	$salt = time();
	$pwd = sha1($password . $salt);
	
	return "User Name is : " . $user_name . " Password is: " . $pwd .  " and Salt is: " . $salt;
}

//Function G2: Get User Site Status  
function getUserSiteStatus($user_check_status, $logged_in_user) {
	global $conn;	
}

//Function G3: Get UserID
function getUserID($userName) {
	global $conn;	
	
	if ($result = mysqli_prepare($conn, "SELECT user_id FROM user_profile WHERE user_name=?")) {
		$result -> bind_param("s", $userName);
		$result -> execute();
		$result -> bind_result($result_user_id);
		$result -> fetch();
		$user_id = $result_user_id;
		$result -> close();
	} 
	return $user_id;

}

//Function G4: Get UserName
function getUserName($userID) {
	global $conn;	
	
	if ($result = mysqli_prepare($conn, "SELECT user_name FROM user_profile WHERE user_id=?")) {
		$result -> bind_param("i", $userID);
		$result -> execute();
		$result -> bind_result($result_user_name);
		$result -> fetch();
		$user_name = $result_user_name;
		$result -> close();
	} 
	return $user_name;

}


//Function G5: Get Friend Status 
function getFriendStatus($user_id, $friendsID, $pendingRequestsID){ 
	if (in_array($user_id, $friendsID)) {
		return 1;
	} if (in_array($user_id, $pendingRequestsID)) {
		return 2;
	} else {
	   return 0;
	}
}

//Function G6: Get image from a user **Move to class 	
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

//Function G7: Check for valid UserName 
function checkValidUsername($user_name_temporary) {
	global $conn;	
	
	$user_name_length_test = 0;
	$user_name_taken_test = 0;
	
	//Part 1: Make sure user name is more then 5 characters 
	if(strlen($user_name_temporary) > 4 ) {
		$user_name_length_test = 1;
	}

	//Part 2: Check if username only uses correct characters 
	if(!preg_match('/^\w{5,}$/', $user_name_temporary)) {
		$user_name_character_test = 0;	
	} else {
		$user_name_character_test = 1;
	}
	
	
	//Part 3: Check if username is taken 
	if ($result = mysqli_prepare($conn, "SELECT user_name FROM user_profile WHERE user_name=?")) {
		$result -> bind_param("s", $user_name_temporary);
		$result -> execute();
		$result -> bind_result($result_user_id);
		$result -> fetch();
		$user_id = $result_user_id;
		$result -> close();
		if(empty($user_id)) {
			$user_name_taken_test = 1;	
		}
	} 	
	
	//Part 4: Check User Name- Success returns 1 and Error Returns 0 and Error Type
	$user_name_error_sum_check = $user_name_length_test + $user_name_character_test + $user_name_taken_test;
	
	//User Name is good to use 
	if($user_name_error_sum_check == 3 ) {
		$register_user_name_outcome = 1;
	//User Name has a problem 
	} else {
		$register_user_name_outcome = 0;		
	}
	
	//echo " Length: " . $user_name_length_test . " Status: " . $user_name_taken_test . " Characters: " . $user_name_character_test;
	
	$register_user_name_array['user_name_length_test'] 		= $user_name_length_test;		
	$register_user_name_array['user_name_character_test'] 	= $user_name_character_test;
	$register_user_name_array['user_name_taken_test']		= $user_name_taken_test; 
	$register_user_name_array['register_user_name_outcome'] = $register_user_name_outcome;
 
	$register_user_name_array['user_name_length_test'] 		= $user_name_length_test;			
	return $register_user_name_array;
}


//Function G9: Check if email taken (returns 1 if it is available, 0 if taken)
function checkEmailTaken($email_test) {
	global $conn;	
	$user_email_outcome =   "AVAILABLE " . 0;
	
	//Part 1: Check if email is taken 
	if ($result = mysqli_prepare($conn, "SELECT email FROM user_profile WHERE email=?")) {
		$result -> bind_param("s", $email_test);
		$result -> execute();
		$result -> bind_result($result_email);
		$result -> fetch();
		$user_email = $result_email;
		$result -> close();
		if(empty($user_email)) {
			$user_email_outcome ="TAKEN " .  1;	
		}
	} 	
	
	return $user_email_outcome;
}

//Function K1: Convert array of usernames to user ids
function convertUserNameToID($array_user_name){ 
	global $conn;
	$arrlength = count($array_user_name);
	$pending_user_id = array();
	
	for($x = 0; $x < $arrlength; $x++) {	
		//Convert to User ID
		if ($stmt_one = mysqli_prepare($conn, "SELECT user_id FROM user_profile WHERE user_name=?")) {
			$stmt_one -> bind_param("s", $array_user_name[$x]);
			$stmt_one -> execute();
			$stmt_one -> bind_result($result_one);
			$stmt_one -> fetch();
			$user_id = $result_one;
			$stmt_one -> close();
			$pending_user_id[$x] = $user_id;
		}
	}
	return $pending_user_id;
}


//FUNCTIONS I: Filters and Data Handling 
//Function I1: Get the parent of a file or folder directory 
function getFileParent($file_id) {
	global $conn;	

	if ($result = mysqli_prepare($conn, "SELECT parent FROM files WHERE file_id=?")) {
		$result -> bind_param("i", $file_id);
		$result -> execute();
		$result -> bind_result($result_parent);
		$result -> fetch();
		$parent_id = $result_parent;
		$result -> close();
	} 
	return $parent_id;
}

//Function I2: Search String for word and return array of that word 
function checkStringForWord($string, $word) {
	$a = 'How are you?';
	if (strpos($string, $word) !== false) {
		return 1;
	} else {
		return 0; 
	}
}

//Function I3: Compare if two images are the same 
function checkTwoImages($image1, $image2) {
	$md5image1 = md5(file_get_contents($image1));
	$md5image2 = md5(file_get_contents($image2));
	
	//If images are unique 1 otherwise return 0
	if ($md5image1 == $md5image2) {
		return 0;
	} else {
		return 1;
	}
}

//Remove non images files from the string 
function myFilter($string) {
  return strpos($string, '.svg') === false;
}

//Function I4: Check if string starts with 
function startsWith($haystack, $needle) {
	// search backwards starting from haystack length characters from the end
	return $needle === "" || strrpos($haystack, $needle, -strlen($haystack)) !== FALSE;
}

//Function I5: Check if string ends with 
function endsWith($haystack, $needle) {
	// search forward starting from end minus needle length characters
	return $needle === "" || (($temp = strlen($haystack) - strlen($needle)) >= 0 && strpos($haystack, $needle, $temp) !== FALSE);
}

//Function I6: Get Path of file or link or folder (Site Specific)
function getFilePath($file_id) {
	global $conn;	
	
	$current_parent_id = $file_id;
	$folder_path_array = array();
	$folder_path_array[0] = $current_parent_id;
	$folder_path = "";
	$count = 1;
			
	while($current_parent_id !== 0 && ($count < 10)) {
		$current_parent_id = getFileParent($current_parent_id);
		$folder_path_array[$count] = $current_parent_id;
		$count = $count + 1;
	} 

	//Turn array into Path String 
	$arrlength = count($folder_path_array);
	
	for($x = 0; $x <  $arrlength; $x++) {
		$folder_path = $folder_path_array[$x] . "-" .  $folder_path;
	}
	
	return $folder_path;
}

//Function I7: Get File Type and return image 
function getFileType($serverImageName) {
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
		//$fileName = $userName ."/". $fileName;
		return $fileName;
	} else if(strcmp($ext, $jpeg) == 0) {
		$fileName = $serverImageName;
		//$fileName = $userName ."/". $fileName;
		return $fileName;
	} else if(strcmp($ext, $gif) == 0) {
		$fileName = $serverImageName;
		//$fileName = $userName ."/". $fileName;
		return $fileName;
	} else {
		return $fileName = "unknown.png";
	}
}

//FUNCTIONS: J Database Related  
//Function J1: Get User Status
//Function J2: Get the parent of a file or folder directory 
//Function J3: Get UserID
//Function J4: Get UserName

//FUNCTIONS K: Notification Related 
//Function K1: Set Logout time when user logs out of profile 
function updateLogoutStatus($logged_in_user) {
	global $conn;	
	
	$sql = "UPDATE user_login SET last_logout = NOW() WHERE user_name= '$logged_in_user'";

	if ($conn->query($sql) === TRUE) {
		//echo "Record updated successfully Again";
		//header('Location:'  . SITE_ROOT);
	} else {
		//echo "Error updating record: " . $conn->error;
		//header('Location:'  . SITE_ROOT);
	}	
}



//FUNCTIONS: EXTERNAL CODE 
/**
 * Remove any non-ASCII characters and convert known non-ASCII characters 
 * to their ASCII equivalents, if possible.
 *
 * @param string $string 
 * @return string $string
 * @author Jay Williams <myd3.com>
 * @license MIT License
 * @link http://gist.github.com/119517
 */
 
function convert_ascii($string) { 
  // Replace Single Curly Quotes
  $search[]  = chr(226).chr(128).chr(152);
  $replace[] = "'";
  $search[]  = chr(226).chr(128).chr(153);
  $replace[] = "'";
  // Replace Smart Double Curly Quotes
  $search[]  = chr(226).chr(128).chr(156);
  $replace[] = '"';
  $search[]  = chr(226).chr(128).chr(157);
  $replace[] = '"';
  // Replace En Dash
  $search[]  = chr(226).chr(128).chr(147);
  $replace[] = '--';
  // Replace Em Dash
  $search[]  = chr(226).chr(128).chr(148);
  $replace[] = '---';
  // Replace Bullet
  $search[]  = chr(226).chr(128).chr(162);
  $replace[] = '*';
  // Replace Middle Dot
  $search[]  = chr(194).chr(183);
  $replace[] = '*';
  // Replace Ellipsis with three consecutive dots
  $search[]  = chr(226).chr(128).chr(166);
  $replace[] = '...';
  // Apply Replacements
  $string = str_replace($search, $replace, $string);
  // Remove any non-ASCII Characters
  $string = preg_replace("/[^\x01-\x7F]/","", $string);
  return $string; 
}


//FUNCTIONS: APPENDIX
/*
echo " Original: " . $original;
echo "<br /> ";
echo " First Encrypt " . $encyrpt_one;
echo "<br /> ";
echo " Second Encypt " . $encyrpt_two;
echo "<br /> ";
echo " First Decrypt " . $decrypt_two;
echo "<br /> ";
echo "Final: " . $decrypt_original;
*/
//////////
//define("E_KEY", "242BC3A24F0F0CC29DC2B1C39A2BC2B62D4F6631307EC290C393C3A90E1DC3B41DC2BBC38FC3B85D31E282AC2BE280A151");
//define("IV", "C39DC3A6C3A7C5BD57C3A4C3A816C3A5264DC5B82144C2AF");
//ENCRYPTION
/*
$master_key = "2key069";
$encryption_key = hexToStr(E_KEY);
$iv = hexToStr(IV);  
$string_original = "david does this work who knows ";
$string_encrypted = @encryptItem($master_key, $string_original, $encryption_key, $iv);
$string_decrypted = @decryptItem($master_key, $string_encrypted, $encryption_key, $iv);
*/

//LOCK WITH KEY 
//Step 1: Convert to Hex
//$master_key_hex = strToHex(strval($master_key));
//$string_original_hex = strToHex(strval($string_original));

//Step 2: Convert to Base 10
//$master_key_base_ten = base_convert($master_key_hex, 16, 10);
//$string_original_base_ten  = base_convert($string_original_hex, 16, 10);

//echo $master_key_hex . "<br />";
//echo $string_original_hex . "<br />";



//UNLOCK WITH KEY 
//Step: Convert back to Hex
//$decrypt_string_original_hex = hexToStr($string_original_hex);
//echo $decrypt_string_original_hex . "<br />";

//Step:  Convert back to String
//$decrypt_string_original = hexToStr($decrypt_string_original_base_ten);

// both print "int(238)"




/*
//$master_key_hex_length = strlen($master_key_hex); 
//$string_original_hex_length = strToHex($string_original_hex);
$master_key_hex_array = str_split($master_key_hex);
$string_original_hex_array = str_split($string_original_hex);
$master_key_hex_array_length = count($master_key_hex_array);
$string_original_hex_array_length = count($string_original_hex_array);
$master_key_and_value_combined_array = array();
*/


//Loop through Key and place in odd parts of array

/*
echo $string_original . "<br />";
echo $string_encrypted . "<br />";
echo $string_decrypted . "<br />";
*/

/*
//Function S3: Encypt Item with Key 
function encryptItem($master_key, $encypt_item, $encryption_key, $iv) {

	$master_key = strval($master_key);
	$encypt_item = strval($encypt_item);
	
	//Convert to Hex 
	$master_key_hex = strToHex($master_key);
	$encypt_item_hex = strToHex($encypt_item);
	
	//Combine Key and Item 
	$encrypted_item = $master_key_hex . "_<>_". $encypt_item_hex;	
	$encrypted_item = @encryptWithIV($encrypted_item, $encryption_key, $iv);
	return $encrypted_item;
}


//Function S4: Decypt Item with Key 
function decryptItem($master_key, $encrypted_item, $encryption_key, $iv) {
	//Convert Master Key to Hex
	$master_key = strval($master_key);
	$master_key_hex = strToHex($master_key);
	
	//Original Cyrpt
	$encrypted_item = @decryptWithIV($encrypted_item, $encryption_key, $iv);
	
	//Convert to Array
	$array_of_encrypted_item = explode("_<>_", $encrypted_item);
	$decrypted_item = strval($array_of_encrypted_item[1]);
		
	$decoded_item = hexToStr($decrypted_item);

	//return $master_key_hex . "_" . $encrypted_item;
	return $decoded_item;
	
}
*/

/*
$key_size = 32; // 256 bits
$encryption_key = openssl_random_pseudo_bytes($key_size, $strong);
$iv			 		= IV;
$iv_size = 16; // 128 bits
$iv = openssl_random_pseudo_bytes($iv_size, $strong);
*/

/*
define("E_KEY", "+âO±Ú+¶-Of10~Óéô»Ïø]1€+‡Q");
define("IV", "ÝæçŽWäèå&MŸ!D¯");

//$encryption_key 	= E_KEY;
//$iv 				= IV;
echo $iv . "<br />";
echo $encryption_key . "<br />";

$iv_string = strToHex($iv);
$iv_rpb = hexToStr($iv_string);


echo $iv_string . "<br />";
echo $iv_rpb . "<br />";

*/




//Set Up Encryption Variables 




////////////// LEARNING ////////////////////////////

//$data = openssl_encrypt($data, 'aes-256-cbc', $encryption_key, OPENSSL_RAW_DATA|OPENSSL_ZERO_PADDING, $iv);


//encryptWithIV($original_string, $encryption_key, $iv)
//decryptWithIV($encrypted_string, $encryption_key, $iv)



/*
$password = "password";
$insert = "_<>_";
$position = 1;

//Insert Key 
$new_password = insertAtPosition($password, $insert, $position);
echo $new_password;
echo "<br />";

function insertAtPosition($password, $insert, $position) {
    return implode($insert, str_split($password, $position));
}


//Remove Key
$remove = "/_<>_/";
$replace_length =  strlen($password)-1;

for($x = 0; $x < $replace_length; $x++) {
	$new_password = preg_replace($remove,"", $new_password, 1);
	echo $new_password;
	echo "<br />";
}

//echo str_replace($insert,"",$new_string);

echo "<br /><br /><br /><br /><br />";


$master_key = 2069;
$encypt_item = "david";

//ENCRYPTION 
//Step 1: Partial Encypt with Master Key
$pre_encrypted_string = encryptItem($master_key, $encypt_item);
echo $pre_encrypted_string;
echo "<br />";

//Step 2: Encypt with IV and KEY 
$final_encrypted_string = @encryptWithIV($pre_encrypted_string, E_KEY, IV);
echo $final_encrypted_string;
echo "<br />";

//DECRYPTION
//Step 1: Decrypt with IV and KEY 
$pre_encrypted_string = @decryptWithIV($final_encrypted_string, E_KEY, IV);
echo $pre_encrypted_string;
echo "<br />";

//Step 2: 
$password = decryptItem($master_key, $pre_encrypted_string);
echo $password; 
*/


/*
$encypted_item = encryptItem($master_key, $encypt_item);
echo $encypted_item . "<br />";
$decypted_item = decryptItem($master_key, $encypted_item);
echo $decypted_item;
*/
/*
	$master_key = strval($master_key);
	$encypt_item = strval($encypt_item);
	$master_key_hex = strToHex($master_key);
	$encypt_item_hex = strToHex($encypt_item);
	
	echo "Key Hex " . $master_key_hex;
	echo "<br />";
	echo "Password Hex " . $encypt_item_hex;
	echo "<br />";	
	echo "Divided " .  $encypt_item_hex / $master_key_hex;
*/	
/*
$string = 2069;
$string = strval($string);

$key = 2069;

$password = "password";
$password = strval($password);

$key_hex = strToHex($key);
$password_hex = strToHex($password);
echo "<br />";
echo $password_hex;
echo "<br />";
echo $key_hex;

echo "<br />";
echo hexToStr($password_hex);
echo "<br />";
echo hexToStr($key_hex);

echo "<br />";
echo 
*/


/*
	$pword = "guest";
	$salt = time();
	echo $salt;
	echo "<br />";
	//Encrypt the password and salt with SHA1
	$pwd = sha1($pword . $salt);
	echo $pwd;
*/

?>