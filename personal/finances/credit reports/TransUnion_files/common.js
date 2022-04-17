// common.js: shared functions used across applications

/* ~~ browser detection - populates global variable "browser" ~~*/
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
var browser = getBrowser();
if (browser == "ie6" || browser == "ie7") document.writeln("<link rel=\"stylesheet\" href=\"/shared/cncr/stylesheet/fraudAlert/TUApplIE6_IE7.css\" type=\"text/css\">");
if (browser == "ie") document.writeln("<link rel=\"stylesheet\" href=\"/shared/cncr/stylesheet/fraudAlert/TUApplIE.css\" type=\"text/css\">");
if (browser == "firefox") document.writeln("<link rel=\"stylesheet\" href=\"/shared/cncr/stylesheet/fraudAlert/TUApplFirefox.css\" type=\"text/css\">");

function getBrowser() {
	var userAgent = navigator.userAgent.toLowerCase();
	var retBrowser = "";
	if (contains(userAgent, 'msie') || contains(userAgent, 'internet explorer')) {
		if (contains(userAgent, 'msie 6')) retBrowser = "ie6";
		else if (contains(userAgent, 'msie 7')) retBrowser = "ie7";
		else retBrowser = "ie";
	}
	else if (contains(userAgent, 'safari') || contains(userAgent, 'safari')) retBrowser = "safari";
	else if (!contains(userAgent, 'compatible') || contains(userAgent, 'firefox'))
	{
	    retBrowser = "mozilla";
	    if(contains(userAgent, 'firefox')) retBrowser="firefox";
	    if(contains(userAgent, 'macintosh')) retBrowser="firefox-mac";
	} else retBrowser = "unknown";
	return retBrowser;
}

function contains(string, substring)
{
    found = string.indexOf(substring) + 1;
    return found;
} 

/* ~~ common listeners and functions used to reset the page, etc. ~~*/
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
function setupCommonListeners() {
	document.getElementById("displayArea").onclick = displayAreaOnClickListener;
}

/* common array used to determine additional areas to be checked when */
/* checking for click-outs - needs to be initialized when page loads  */
popupIds = new Array();

function displayAreaOnClickListener(e) {
    try{
	if (document.getElementById("sectionSelectionArea") != null) sectionSelectionClickOutListener(e);
	if (document.getElementById("sessionSelectionArea") != null) sessionSelectionClickOutListener(e);
	if (document.getElementById("portalSelectionArea") != null) portalSelectionClickOutListener(e);
	if (document.getElementById("filterSelectionArea") != null) filterSelectionClickOutListener(e);
	if (document.getElementById("contextSelectionArea") != null) contextSelectionClickOutListener(e);
	if (document.getElementById("textSelectionHeader") != null) {
		if (document.getElementById("textSelectionHeader").style.display == "block") {
			if (isOutsideObject("staticPopupArea", e)) {
				collapseTextSelectionAreaOnClickListener();
			}
		}
	}
	if (document.getElementById("textSelectionHeaderPRight") != null) {
		if (document.getElementById("textSelectionHeaderPRight").style.display == "block") {
			if (isOutsideObject("staticPopupArea", e)) {
				collapseTextSelectionAreaOnClickListener();
			}
		}
	}
	if (document.getElementById("dateSelectionHeader") != null) dateSelectionClickOutListener(e);
	if (document.getElementById("detailPopupHeader") != null) detailPopupClickOutListener(e);
	if (document.getElementById("contactPopupHeader") != null) contactPopupClickOutListener(e);
	
	var i = 0;
	for (i=0; i<popupIds.length; i++) {
		if (document.getElementById(popupIds[i]).style.display == "block") {
			if (isOutsideObject(popupIds[i], e)) {
				hide(popupIds[i]);
			}
		}
	}
    }catch(e){

    }
}

function closeCommonElements() {
	if (!(document.getElementById("sectionSelectionArea") == null)) hide("sectionSelectionArea");
	if (!(document.getElementById("sessionSelectionArea") == null)) hide("sessionSelectionArea");
	if (!(document.getElementById("filterSelectionArea") == null)) hide("filterSelectionArea");
}

/* ~~ like prototype.js - shortcut for getElementById ~~*/
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
function $(element) {
	return(document.getElementById(element));
}

/* ~~ hide/show objects ~~*/
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
function show (objId, displayState) {
	document.getElementById(objId).style.display = displayState;
}
function hide (objId) {
	document.getElementById(objId).style.display = "none";
}
function toggle (showObjId, hideObjId, displayState) {
	document.getElementById(showObjId).style.display = displayState;
	document.getElementById(hideObjId).style.display = "none";
}

/* ~~ hide/show table rows ~~*/
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
function showRow (rowId) {
	if (browser == "ie6" || browser == "ie7" || browser == "ie") {
		document.getElementById(rowId).style.display = "block";
	} else {
		document.getElementById(rowId).style.display = "table-row";
	}
}
function hideRow (rowId) {
	document.getElementById(rowId).style.display = "none";
}

/* ~~ hide/show page sections ~~*/
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* using these functions requires that the names of the components of  */
/* a section follow naming standards based on a root name for the      */
/* section:  for section "foo", the data component is named "fooData", */
/* the collapse link "fooCollapseLink", expand link "fooExpandLink",   */
/* title "fooTitle", background hacks "fooHackLeft" and "fooHackRight",*/
/* and return to top link "fooTopLink"                                 */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
function showSection (nameRoot) {
	hide(nameRoot + "ExpandLink");
	show(nameRoot + "CollapseLink", "inline");
	show(nameRoot + "Data", "block");
	if (document.getElementById(nameRoot + "Filter") != null) show(nameRoot + "Filter", "block");
	if (document.getElementById(nameRoot + "HackLeft") != null) show(nameRoot + "HackLeft", "block");
	if (document.getElementById(nameRoot + "HackRight") != null) show(nameRoot + "HackRight", "block");
	if (document.getElementById(nameRoot + "Footer") != null) show(nameRoot + "Footer", "block");
	if (document.getElementById(nameRoot + "TopLink") != null) show(nameRoot + "TopLink", "block");
}
function hideSection (nameRoot) {
	if (document.getElementById(nameRoot + "TopLink") != null) hide(nameRoot + "TopLink");
	if (document.getElementById(nameRoot + "Footer") != null) hide(nameRoot + "Footer");
	if (document.getElementById(nameRoot + "HackRight") != null) hide(nameRoot + "HackRight");
	if (document.getElementById(nameRoot + "HackLeft") != null) hide(nameRoot + "HackLeft");
	if (document.getElementById(nameRoot + "Filter") != null) hide(nameRoot + "Filter");
	hide(nameRoot + "Data");
	hide(nameRoot + "CollapseLink");
	show(nameRoot + "ExpandLink", "inline");
}
function showPageSectionLinkOnClickListener () {
	var nameRoot = this.id.substr(0, this.id.indexOf("ExpandLink"));
	showSection(nameRoot);
}
function hidePageSectionLinkOnClickListener () {
	var nameRoot = this.id.substr(0, this.id.indexOf("CollapseLink"));
	hideSection(nameRoot);
}
function sectionTitleOnClickListener () {
	var nameRoot = this.id.substr(0, this.id.indexOf("Title"));
	if (document.getElementById(nameRoot + "Data").style.display == "none") {
		showSection(nameRoot);
	} else {
		hideSection(nameRoot);
	}
}
function setupPageSectionListeners (nameRoot) {
	document.getElementById(nameRoot + "ExpandLink").onclick = showPageSectionLinkOnClickListener;
	document.getElementById(nameRoot + "CollapseLink").onclick = hidePageSectionLinkOnClickListener;
	document.getElementById(nameRoot + "Title").onclick = sectionTitleOnClickListener;
}

function setupWideGroupListeners (nameRoot) {
	document.getElementById(nameRoot + "ExpandLink").onclick = showPageSectionLinkOnClickListener;
	document.getElementById(nameRoot + "CollapseLink").onclick = hidePageSectionLinkOnClickListener;
}


/* ~~ hide/show context elements ~~*/
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
/* using these functions requires that the names of the context        */
/* elements included follow naming standards based on a root name for  */
/* the element:  for element "foo", the data component is named        */
/* "fooData", the collapse link "fooCollapseLink", expand link         */
/* "fooExpandLink", and the label "fooLabel"                           */
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
function showContextElement (nameRoot) {
	hide(nameRoot + "ExpandLink");
	show(nameRoot + "CollapseLink", "inline");
	show(nameRoot + "Data", "block");
	if (document.getElementById(nameRoot + "PagingLinks") != null) show(nameRoot + "PagingLinks", "block");
}
function hideContextElement (nameRoot) {
	if (document.getElementById(nameRoot + "PagingLinks") != null) hide(nameRoot + "PagingLinks");
	hide(nameRoot + "Data");
	hide(nameRoot + "CollapseLink");
	show(nameRoot + "ExpandLink", "inline");
}
function showContextElementLinkOnClickListener () {
	var nameRoot = this.id.substr(0, this.id.indexOf("ExpandLink"));
	showContextElement(nameRoot);
}
function hideContextElementLinkOnClickListener () {
	var nameRoot = this.id.substr(0, this.id.indexOf("CollapseLink"));
	hideContextElement(nameRoot);
}
function contextElementLabelOnClickListener () {
	var nameRoot = this.id.substr(0, this.id.indexOf("Label"));
	if (document.getElementById(nameRoot + "Data").style.display == "none") {
		showContextElement(nameRoot);
	} else {
		hideContextElement(nameRoot);
	}
}
function setupContextElementListeners (nameRoot) {
	document.getElementById(nameRoot + "ExpandLink").onclick = showContextElementLinkOnClickListener;
	document.getElementById(nameRoot + "CollapseLink").onclick = hideContextElementLinkOnClickListener;
	document.getElementById(nameRoot + "Label").onclick = contextElementLabelOnClickListener;
}

/* ~~ set object attributes ~~*/
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
function setObjectClass (objId, newClass) {
	document.getElementById(objId).className = newClass;
}

/* ~~ support read-only checkboxes ~~*/
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
function readOnlyCheckboxClickListener(){
	this.checked = this.defaultChecked;
}


/* ~~ get coordinates for objects ~~*/
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
function getLeftById(imgId) {
	return getLeftByObj(document.getElementById(imgId));
}

function getTopById(imgId) {
	return getTopByObj(document.getElementById(imgId));
}

function getLeftByObj(objId) {
	xPos = objId.offsetLeft;
	tempEl = objId.offsetParent;
	while (tempEl != null) {
		xPos += tempEl.offsetLeft;
		tempEl = tempEl.offsetParent;
	}
	return xPos;
}

function getTopByObj(objId) {
	yPos = objId.offsetTop;
	tempEl = objId.offsetParent;
	while (tempEl != null) {
		yPos += tempEl.offsetTop;
		tempEl = tempEl.offsetParent;
	}
	return yPos;
}

function isOutsideObject(objId, e) {
	var obj = document.getElementById(objId)
	var left = getLeftByObj(obj);
	var top = getTopByObj(obj);
	var right = left + obj.offsetWidth;
	var bottom = top + obj.offsetHeight;
	var xPos = 0;
	var yPos = 0;
	if (browser == "ie6" || browser == "ie7" || browser == "ie") {
		xPos = event.clientX;
		yPos = event.clientY;

		//adjust the top variable to handle scrolling by the user
		top -= document.documentElement.scrollTop;		
	} else {
		xPos = e.pageX;
		yPos = e.pageY;
	}
	if (xPos < left || xPos > right || yPos < top || yPos > bottom) {
		return true;
	} else {
		return false;
	}
}

/* ~~ configure positions of context elements ~~*/
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */
function configureContextSelection(imgId, contextSelectionAreaId) {
	var xVal = getLeftById(imgId);
	var yVal = getTopById(imgId);

	var contextSelectionArea = document.getElementById(contextSelectionAreaId);
	var contextSelectionHack = null;
	if (document.getElementById(contextSelectionHackId) != null) contextSelectionHack = document.getElementById(contextSelectionHackId);

	if (browser == "ie6" || browser == "ie7") {
		contextSelectionArea.style.top = (yVal - 8) + "px";
		contextSelectionArea.style.left = (xVal - 7) + "px";
		if (contextSelectionHack) {
			contextSelectionHack.style.top = (yVal - 8) + "px";
			contextSelectionHack.style.left = (xVal - 7) + "px";
		}
	} else {
		contextSelectionArea.style.top = (yVal - 8) + "px";
		contextSelectionArea.style.left = (xVal - 7) + "px";
		if (contextSelectionHack) {
			contextSelectionHack.style.top = (yVal - 8) + "px";
			contextSelectionHack.style.left = (xVal - 7) + "px";
		}
	}
}

/* ~~ manipulate the DOM ~~*/
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

function createChild (nodeType, parentNode, nodeValue) {
	var newNodeValue = document.createTextNode(nodeValue);
	var newNode = document.createElement(nodeType);

	newNode.appendChild(newNodeValue);

	if(parentNode) {
		parentNode.appendChild(newNode);
	}

	return newNode;
}

function getNextInputFieldId (currentFieldObj) {
	var fields = new Array;
	fields = document.getElementsByTagName("input");
	var nextFieldId = "";
	var i = 0;
	for (i = 0; i < fields.length; i++) {
		if (fields[i].id == currentFieldObj.id) {
			nextFieldId = fields[i+1].id;
			break;
		}
	}
	return(nextFieldId);
}

/* ~~ pop up additional browser windows ~~*/
/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */

// function popIt() and related functions...
// pop up new browser windows with various attributes
// example/parameters: popIt('file.html', width, height, top, left, show_toolbar, show_menubar, show_scrollbar, resizable)
// file.html is required
// ----------------------------------------------------------------------------------------------------------------
function popIt(window_URL, target_name, w, h, t, l, tb, mb, sb, rs, d) {
	var width = w || "0";
	var height = h || "0";
	var toolbar = tb || "no";
	var menubar = mb || "no";
	var scrollbars = sb || "no";
	var resizable = rs || "no";
	var dialog = d || "no"
	var top = t || "0";
	var left = l || "0";

	var parameters = "titlebar=no,toolbar=" + toolbar + ",location=no,status=no,menubar=" + menubar + ",scrollbars=" + scrollbars + ",resizable=" + resizable + ",dialog=" + dialog + ",copyhistory=no,alwaysRaised=yes,width=" + width + ",height=" + height + ",top=" + top + ",left=" + left;
	var win = window.open(window_URL, target_name, parameters);
	win.focus();
	return false;
}

function popItTopRight(window_URL, target_name, w, h, tb, mb, sb, rs, d) {
	var width = w || "0";
	var height = h || "0";
	var top = "0";
	var left = "0";

	var screenWidth = screen.width;
	var screenHeight = screen.height;

	if (width == "0") width = "640";
	if (height == "0") height = "500";

	if (height > screenHeight) {
		height = screenHeight;
	} else {
		top = 10;
	}
	if (width > screenWidth) {
		width = screenWidth;
	} else {
		left = (screenWidth - width - 20);
	}

	return popIt(window_URL, target_name, w, h, top, left, tb, mb, sb, rs, d);
}

function popItCenter(window_URL, target_name, w, h, tb, mb, sb, rs, d, topDiffOverride) {
	var width = w || "0";
	var height = h || "0";
	var top = 0;
	var left = 0;
	var topDiff = topDiffOverride || "0";

	screenHeight = screen.height;
	screenWidth = screen.width;

	if (width == "0") width = "640";
	if (height == "0") height = "500";
	
	if (height > screenHeight) {
		height = screenHeight;
	} else {
		top = ((screenHeight - height)/2)-(((screenHeight - height)/2)%1) - topDiff;
	}
	if (width > screenWidth) {
		width = screenWidth;
	} else {
		left = ((screenWidth - width)/2)-(((screenWidth - width)/2)%1);
	}
	
	return popIt(window_URL, target_name, w, h, top, left, tb, mb, sb, rs, d);
}

function popItPrintable(window_URL, target_name){
	return popItTopRight(window_URL, target_name, '704', '394', 'yes', 'yes', 'yes', 'yes', 'no');  
}

function popItHelp(window_URL, target_name){
	return popItTopRight(window_URL, target_name, '567', '373', 'yes', 'yes', 'yes', 'yes', 'yes');  
}

function popItTimeout(window_URL, target_name){
	return popItCenter(window_URL, target_name, '501', '181', 'no', 'no', 'no', 'no', 'yes', '75');  
}
//helper function to open popup windows at footer
function popWin( url, title, width, height ) {
  var v_url = url;
  var params = 'toolbar=yes,location=no,status=yes,scrollbars=yes,resizable=yes';
  //append popup parameters:
  if( width ) params += ',width=' + width + ',height=' + height;
  var newWindow = window.open( v_url, title, params );
} //popWin()

function unlockStateElement(){
    document.getElementById("mailState").disabled = false;
}
function contextSelectionClickOutListener(e){

}
function filterSelectionClickOutListener(e){

}