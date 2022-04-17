function showformModal() {
    loadjscssfile("/stylesheet/bootstrap.min.css", "css");
    loadjscssfile("/stylesheet/jquery-ui.css", "css");
    loadjscssfile("/stylesheet/font-awesome.min.css", "css");
    loadjscssfile("/stylesheet/tu-modal.css", "css");
    loadjscssfile("/js/libs.min.js", "js");
    var delay=250;
    setTimeout(function(){$('#formModal').modal('show');}, delay);
}

function hideformModal() {
    $('#formModal').modal('hide');
    $('#thankyouModal').modal('hide');
    $('#formModal').fadeOut();
    $('#thankyouModal').fadeOut();
    document.getElementById("wrap").style.display="none";
}

function loadjscssfile(filename, filetype) {
    if (filetype == "js") { //if filename is a external JavaScript file
        var fileref = document.createElement('script');
        fileref.setAttribute("type", "text/javascript");
        fileref.setAttribute("src", filename);
    }
    else if (filetype == "css") { //if filename is an external CSS file
        var fileref = document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", filename)
    }
    if (typeof fileref != "undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref);
}

function removejscssfile(filename, filetype) {
    if (filetype == "js") { //if filename is a external JavaScript file
        var fileref = document.createElement('script');
        fileref.removeAttribute("type", "text/javascript");
        fileref.removeAttribute("src", filename);
    }
    else if (filetype == "css") { //if filename is an external CSS file
        var fileref = document.createElement("link");
        fileref.removeAttribute("rel", "stylesheet");
        fileref.removeAttribute("type", "text/css");
        fileref.removeAttribute("href", filename);
    }
    if (typeof fileref != "undefined")
        document.getElementsByTagName("head")[0].appendChild(fileref)
}
function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}
function callEmailOptinAction(emailAddress){
    var data="emailAddress="+emailAddress;
    if(invocation) {
        invocation.open('POST', url, true);
        invocation.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        invocation.onreadystatechange = handler;
        invocation.send(data);
    } else {
        invocationHistoryText = "No Invocation TookPlace At All";
        var textNode = document.createTextNode(invocationHistoryText);
        var textDiv = document.getElementById("textDiv");
        textDiv.appendChild(textNode);
    }
}
function handler(evtXHR) {
    $('#formModal').modal('hide');
    $('#formModal').fadeOut();
    $('#thankyouModal').modal('show');
    document.getElementById("emailOptin").value = "1";
    document.getElementById("emailAddress").value = "";
    document.getElementById("emailAddress").style.border = "1px solid #939393";
    document.getElementById("errorText").style.display = "none";
}
function getXMLHttpRequest() {
  var xmlHttpReq = false;
  // to create XMLHttpRequest object in non-Microsoft browsers
  if (window.XMLHttpRequest) {
    xmlHttpReq = new XMLHttpRequest();
  } else if (window.ActiveXObject) {
    try {
      // to create XMLHttpRequest object in later versions
      // of Internet Explorer
      xmlHttpReq = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (exp1) {
      try {
        // to create XMLHttpRequest object in older versions
        // of Internet Explorer
        xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (exp2) {
        xmlHttpReq = false;
      }
    }
  }
  return xmlHttpReq;
}
function replacejscssfile(oldfilename, newfilename, filetype){
    var targetelement=(filetype=="js")? "script" : (filetype=="css")? "link" : "none"; //determine element type to create nodelist using
    var targetattr=(filetype=="js")? "src" : (filetype=="css")? "href" : "none"; //determine corresponding attribute to test for
    var allsuspects=document.getElementsByTagName(targetelement);
    for (var i=allsuspects.length; i>=0; i--){ //search backwards within nodelist for matching elements to remove
        if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(oldfilename)!=-1){
            var newelement=createjscssfile(newfilename, filetype);
            allsuspects[i].parentNode.replaceChild(newelement, allsuspects[i]);
        }
    }
}

function createjscssfile(filename, filetype){
    if (filetype=="js"){ //if filename is a external JavaScript file
        var fileref=document.createElement('script');
        fileref.setAttribute("type","text/javascript");
        fileref.setAttribute("src", filename);
    }
    else if (filetype=="css"){ //if filename is an external CSS file
        var fileref=document.createElement("link");
        fileref.setAttribute("rel", "stylesheet");
        fileref.setAttribute("type", "text/css");
        fileref.setAttribute("href", filename);
    }
    return fileref;
}
function hideModalWindows(){
    document.getElementById("emailAddress").value = "";
    document.getElementById("emailAddress").style.border = "1px solid #939393";
    document.getElementById("errorText").style.display = "none";
    hideformModal();
    replacejscssfile("/stylesheet/bootstrap.min.css", "/stylesheet/bootstrap.min.css-bak", "css");
    replacejscssfile("/stylesheet/tu-modal.css", "/stylesheet/tu-modal.css-bak", "css");
    replacejscssfile("/stylesheet/jquery-ui.css", "/stylesheet/jquery-ui.css-bak", "css");
    replacejscssfile("/stylesheet/font-awesome.min.css.css", "/stylesheet/font-awesome.min.css-bak", "css");
}