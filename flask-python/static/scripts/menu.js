var navOpen = false;
var browseOpen = false;

function updateNav() {
  if(!navOpen) {
    document.getElementById("mySidenav").style.width = "13%";
    document.getElementById("image_table").style.setProperty('margin-left', '13%');
    navOpen = true;
  } else {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("image_table").style.setProperty('margin-left', '0%');
    navOpen = false;
  }
}

function updateBrowse() {
  if(!browseOpen) {
    document.getElementById("mySearchForm").style.display = "block";
    browseOpen = true;
  } else {
    document.getElementById("mySearchForm").style.display = "none";
    browseOpen = false;
  }
}