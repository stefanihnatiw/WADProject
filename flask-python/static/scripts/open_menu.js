var navOpen = false;
var browseOpen = false;

function updateNav() {
  if(!navOpen) {
    document.getElementById("mySidenav").style.width = "14%";
    document.getElementById("image_div").style.setProperty('margin-left', '14%');
    navOpen = true;
  } else {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("image_div").style.setProperty('margin-left', '7%');
    navOpen = false;
  }
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