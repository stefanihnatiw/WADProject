var navOpen = false;
var browseOpen = false;

window.onload = function() {
  navOpen = (getCookie("navOpen") == "true");
  if(navOpen) {
    document.getElementById("mySidenav").style.width = "14%";
    document.getElementById("image_div").style.setProperty('margin-left', '14%');
  } else {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("image_div").style.setProperty('margin-left', '0%');
  }
};

function updateNav() {
  document.querySelector('body').classList.remove('preload');
  if(!navOpen) {
    document.getElementById("mySidenav").style.width = "14%";
    document.getElementById("image_div").style.setProperty('margin-left', '14%');
    navOpen = true;
  } else {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("image_div").style.setProperty('margin-left', '0%');
    navOpen = false;
  }
  setCookie("navOpen", navOpen);
}

function updateBrowse() {
  if(!browseOpen) {
    document.getElementById("searchForm").style.display = "block";
    browseOpen = true;
  } else {
    document.getElementById("searchForm").style.display = "none";
    browseOpen = false;
  }
}

function setCookie(cname, cvalue) {
  var d = new Date();
  d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}