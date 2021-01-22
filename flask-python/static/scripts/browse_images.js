var PageNumber = 1;
var NumberRows = 4;
var NumberCols = 5;

var setFilters = {"Artist": {}};

class Image extends React.Component {
  constructor(props) {
    super(props);
    this.state = { clicked: false };
  }

  render() {
    var src = "data:image/gif;base64,".concat(this.props.image.data);

    if(this.state.clicked === true) {
      var filename = this.props.image.title.slice(0, -4);
      window.location.href = "/display_image/".concat(filename);
    }

    return (
      <img 
        src={src}
        alt={this.props.image.title} 
        style={{'height': '50vh', 
                'width': (100/NumberCols - 100/NumberCols/6).toString().concat('vw'), 
                'object-fit': 'cover', 
                'cursor': 'pointer'
              }}
        onClick={() => this.setState({ clicked: true})}>
      </img>
    );
  }
}

class Images extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var images = this.props.images;
    var selectedImages = [];
    var i;
    for (i = 0; i < images.length; i++) {
      selectedImages.push(
          <td><Image image={images[i]} /></td>
        );
    }

    var displayList = [];
    for (i = 0; i < selectedImages.length; i=i+NumberCols) {
      var row = selectedImages.slice(i, i+NumberCols);
      displayList.push(
        <tr>{row}</tr>
      )
    }
    return (
      <table>
        {displayList}
      </table>
    )
  }
}

class ImageTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {images: null};
    this.fetchImages = this.fetchImages.bind(this);
    this.initParams = this.initParams.bind(this);
  }

  initParams() {
    PageNumber = getCookie("PageNumber");
    if(PageNumber === "") {
      PageNumber = 1;
      setCookie("PageNumber", PageNumber.toString());
    }
    else {
      PageNumber = parseInt(PageNumber);
    }

    setFilters = getCookie("setFilters");
    if(setFilters === "") {
      setFilters = {"Artist": {}};
      setCookie("setFilters", JSON.stringify(setFilters));
    }
    else {
      setFilters = JSON.parse(setFilters);
    }
  }

  fetchImages() {
    fetch('http://localhost:5000/getImages/'.concat(PageNumber.toString(), "/", 
                                                    NumberRows.toString(), "/", 
                                                    NumberCols.toString(), "/",
                                                    JSON.stringify(setFilters)))
    .then(res => res.json())
    .then((data) => {
      this.setState({ images: data.images })
    })
    .catch(console.log)
  }

  componentDidMount() {
    this.initParams();
    this.fetchImages();
  }

  render() {
    return this.state.images ? (
        <div>
          <Images images={this.state.images}/>
        </div> 
      ) : (
        <span>Loading images...</span>
    )
  }
}

const imageTable = ReactDOM.render(
  <ImageTable />,
  document.getElementById('image_div')
);

//////////////////////////////////////////////////////////////////////////////////

function switchPage(newPageNumber) {
  if(newPageNumber < 1) return;
  PageNumber = newPageNumber;
  document.getElementById("pageInput").value = PageNumber.toString();
  setCookie("PageNumber", PageNumber.toString());
  imageTable.fetchImages();
}

function prevPage() {
  switchPage(PageNumber - 1);
}

function nextPage() {
  switchPage(PageNumber + 1);
}

class Input extends React.Component {
  constructor(props) {
      super(props);
      this.state = {value:'1'}
      this.handleChange = this.handleChange.bind(this);
      this.keyPress = this.keyPress.bind(this);
      this.initPageNumber = this.initPageNumber.bind(this);
   } 

  initPageNumber() {
    document.getElementById("pageInput").value = PageNumber.toString();
  }

  componentDidMount() {
    this.initPageNumber();
  }
 
   handleChange(e) {
      this.setState({ value: e.target.value });
   }

   keyPress(e){
      if(e.keyCode == 13 && !isNaN(e.target.value)){
        switchPage(parseInt(e.target.value));
      }
   }

  render() {
    return (
      <input id="pageInput" type="text" value={this.state.value} onKeyDown={this.keyPress} onChange={this.handleChange} />
    );
  }
}

ReactDOM.render(
  <Input />,
  document.getElementById('pageSwitchInput')
);

////////////////////////////////////////////////////////////////////////////////

class ArtistFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {artists: null};
    this.fetchArtists = this.fetchArtists.bind(this);
  }

  fetchArtists() {
    fetch('http://localhost:5000/getArtists')
    .then(res => res.json())
    .then((data) => {
      this.setState({ artists: data.artists })
    })
    .catch(console.log)
  }

  componentDidMount() {
    this.fetchArtists();
  }

  componentDidUpdate() {
    var checkboxes = document.querySelectorAll("input[type=checkbox][name=filterBox]");

    checkboxes.forEach(function(checkbox) {
      var label = checkbox.parentElement.textContent;
      if(setFilters["Artist"][label] === true) {
        checkbox.checked = true;
      }
      
      checkbox.addEventListener('change', function() {
        var value = checkbox.checked;
        setFilters["Artist"][label] = value;
        setCookie("setFilters", JSON.stringify(setFilters));
        switchPage(1);
      })
    });
  }

  render() {
    var artists = this.state.artists;
    var filterList = [];
    var i;
    if(artists !== null) {
      for (i = 0; i < artists.length; i++) {
        filterList.push(
            <div>
              <label>
                  <input type="checkbox" id="{ artists[i].name }" name="filterBox"/> 
                  { artists[i].name }
              </label>
              <br/>
            </div>
          );
      }
    }
    return this.state.artists ? (
        <div>
          {filterList}
        </div>
      ) : (
        <span>Loading artists...</span>
    )
  }
}

ReactDOM.render(
  <ArtistFilter />,
  document.getElementById('artistFilters')
);

////////////////////////////////////////////////////////////////////////////////

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