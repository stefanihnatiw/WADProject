var navOpen = false;
var browseOpen = false;
var filtersOpen = false;
var filtersList = {"artistFilters": false}

function init() {
  navOpen = (getCookie("navOpen") == "true");
  if(navOpen) {
    document.getElementById("mySidenav").style.width = "14%";
    document.getElementById("image_div").style.setProperty('margin-left', '14%');
  } else {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("image_div").style.setProperty('margin-left', '0%');
  }
} window.addEventListener('load', init);

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

function updateFilters() {
  var i;
  if(!filtersOpen) {
    var filters = document.getElementsByClassName("filterCat");
    for (i = 0; i < filters.length; i++) {
      filters[i].style.display = "block";
    }
    filtersOpen = true;
  } else {
    var filters = document.querySelectorAll('.filterCat,.filterOpt');
    for (i = 0; i < filters.length; i++) {
      filters[i].style.display = "none";
    }
    for(var id in filtersList) {
      filtersList[id] = false;
    }
    filtersOpen = false;
  }
}

function updateFilterOpts(id1, id2) {
  var title = document.getElementById(id1).innerHTML.substring(2);
  if(!filtersList[id2]) {
    document.getElementById(id1).innerHTML = "🡣 ".concat(title);
    document.getElementById(id2).style.display = "block";
    filtersList[id2] = true;
  } else {
    document.getElementById(id1).innerHTML = "🡢 ".concat(title);
    document.getElementById(id2).style.display = "none";
    filtersList[id2] = false;
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