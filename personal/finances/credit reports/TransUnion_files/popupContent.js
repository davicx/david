// popupContent.js: shared functions used to support static content popups and interrupts
// requires that common.js be included


function positionFixedPopup (topDiffOverride) {
	var winHeight = 0;
	var winWidth = 0;
	var topDiff = 150;
	if (browser == "ie" || browser == "ie6" || browser == "ie7") {
		winHeight = document.documentElement.clientHeight;
		winWidth = document.documentElement.clientWidth;
	} else {
		winHeight = window.innerHeight;
		winWidth = window.innerWidth;
	}

	if (topDiffOverride != null) {
		topDiff = topDiffOverride;
	}

	var popupHackObject = document.getElementById("fixedPopupHack");
	var popupObject = document.getElementById("fixedPopupArea");
	var topString = "";
	var leftString = "";
	topString += ((winHeight/2)-((winHeight/2)%1) - topDiff) + "px";
	leftString += ((winWidth/2)-((winWidth/2)%1) - 250) + "px";

	popupObject.style.top = topString;
	popupObject.style.left = leftString;

	if (popupHackObject != null) {
		popupHackObject.style.top = topString;
		popupHackObject.style.left = leftString;
	}
}

function positionFormPopup (topDiffOverride) {
	var winHeight = 0;
	var winWidth = 0;
	var topDiff = 240;
	if (browser == "ie" || browser == "ie6" || browser == "ie7") {
		winHeight = document.documentElement.clientHeight;
		winWidth = document.documentElement.clientWidth;
	} else {
		winHeight = window.innerHeight;
		winWidth = window.innerWidth;
	}

	if (topDiffOverride) {
		topDiff = topDiffOverride;
	}

	var popupHackObject = document.getElementById("fixedPopupHack");
	var popupObject = document.getElementById("fixedPopupArea");

	popupObject.style.top = (winHeight/2 - topDiff) + "px";
	popupObject.style.left = (winWidth/2 - 395) + "px";
	if (popupHackObject != null) {
		popupHackObject.style.top = (winHeight/2 - topDiff) + "px";
		popupHackObject.style.left = (winWidth/2 - 395) + "px";
	}
}

function positionNarrowFormPopup (topDiffOverride) {
	var winHeight = 0;
	var winWidth = 0;
	var topDiff = 240;
	if (browser == "ie" || browser == "ie6" || browser == "ie7") {
		winHeight = document.documentElement.clientHeight;
		winWidth = document.documentElement.clientWidth;
	} else {
		winHeight = window.innerHeight;
		winWidth = window.innerWidth;
	}

	if (topDiffOverride) {
		topDiff = topDiffOverride;
	}

	var popupHackObject = document.getElementById("fixedPopupHack");
	var popupObject = document.getElementById("fixedPopupArea");

	popupObject.style.top = (winHeight/2 - topDiff) + "px";
	popupObject.style.left = (winWidth/2 - 200) + "px";
	if (popupHackObject != null) {
		popupHackObject.style.top = (winHeight/2 - topDiff) + "px";
		popupHackObject.style.left = (winWidth/2 - 200) + "px";
	}
}

function showCommonPopupElements (heightStyle, hackId, topDiffOverride) {
	if (heightStyle == "fixed") {
		setObjectClass("fixedPopupArea", "contentPopupAreaFixedHeight");
		if (hackId != null) setObjectClass(hackId, "contentPopupHack");
	} else {
		setObjectClass("fixedPopupArea", "contentPopupArea");
		if (hackId != null) setObjectClass(hackId, hackClass);
	}
	positionFixedPopup(topDiffOverride);
	show("fixedPopupLayer", "block");
	if (hackId != null) show(hackId, "block");
	show("fixedPopupArea", "block");
	show("contentPopupHeader", "block");
	if (hackId != null) disableBrowserWidgets();
}
function hideCommonPopupElements (hackId) {
	hide("fixedPopupLayer");
	if (hackId != null) hide(hackId);
	hide("fixedPopupArea");
	hide("contentPopupHeader");
	if (hackId != null) enableBrowserWidgets();
}

function showInterruptPopupElements (popupType, hackClass, topDiffOverride) {
	if (popupType == "error") {
		setObjectClass("fixedPopupArea", "contentPopupAreaError");
	} else if (popupType == "warning") {
		setObjectClass("fixedPopupArea", "contentPopupAreaWarning");
	} else if (popupType == "info") {
		setObjectClass("fixedPopupArea", "contentPopupAreaInfo");
	} else if (popupType == "success") {
		setObjectClass("fixedPopupArea", "contentPopupAreaSuccess");
	} else if (popupType == "processing") {
		setObjectClass("fixedPopupArea", "contentPopupAreaProcessing");
	} else {
		setObjectClass("fixedPopupArea", "contentPopupArea");
	}
	positionFixedPopup(topDiffOverride);
	show("fixedPopupLayer", "block");
	if (document.getElementById("fixedPopupHack") != null) {
		if (hackClass != null) setObjectClass("fixedPopupHack", hackClass);
		show("fixedPopupHack", "block");
	}
	show("fixedPopupArea", "block");
	show("interruptPopupHeader", "block");
	disableBrowserWidgets();
}
function hideInterruptPopupElements (hackId) {
	hide("fixedPopupLayer");
	if (hackId != null) hide(hackId);
	hide("fixedPopupArea");
	hide("interruptPopupHeader");
	enableBrowserWidgets();
}

function showFormPopupElements (heightStyle, hackId, topDiffOverride) {
	if (heightStyle == "fixed") {
		setObjectClass("fixedPopupArea", "formPopupAreaFixedHeight");
	} else {
		setObjectClass("fixedPopupArea", "formPopupArea");
	}
	positionFormPopup(topDiffOverride);
	show("fixedPopupLayer", "block");
	if (hackId != null) show(hackId, "block");
	show("fixedPopupArea", "block");
	show("formPopupHeader", "block");
	if (hackId != null) disableBrowserWidgets();
}
function hideFormPopupElements (hackId) {
	hide("fixedPopupLayer");
	if (hackId != null) hide(hackId);
	hide("fixedPopupArea");
	hide("formPopupHeader");
	if (hackId != null) enableBrowserWidgets();
}

function showNarrowFormPopupElements (heightStyle, hackId, topDiffOverride) {
	if (heightStyle == "fixed") {
		setObjectClass("fixedPopupArea", "narrowFormPopupAreaFixedHeight");
	} else {
		setObjectClass("fixedPopupArea", "narrowFormPopupArea");
	}
	positionNarrowFormPopup(topDiffOverride);
	show("fixedPopupLayer", "block");
	if (hackId != null) show(hackId, "block");
	show("fixedPopupArea", "block");
	show("narrowFormPopupHeader", "block");
	if (hackId != null) disableBrowserWidgets();
}
function hideNarrowFormPopupElements (hackId) {
	hide("fixedPopupLayer");
	if (hackId != null) hide(hackId);
	hide("fixedPopupArea");
	hide("narrowFormPopupHeader");
	if (hackId != null) enableBrowserWidgets();
}
