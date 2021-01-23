var PageNumber = 1;
var NumberRows = 4;
var NumberCols = 5;

class Artist extends React.Component {
  constructor(props) {
    super(props);
    this.state = { clicked: false };
  }

  render() {
    if(this.state.clicked === true) {
      window.location.href = "/display_artist/".concat(this.props.artist.name);
    }

    return (
        <div
          style={{'height': '50vh', 
                  'width': (100/NumberCols - 100/NumberCols/5).toString().concat('vw'),
                  'cursor': 'pointer',
                  'border': '2px solid black',
                  'text-align': 'center'
                }}
          onClick={() => this.setState({ clicked: true})}>
          
          <h1>{this.props.artist.name}</h1>
          <h3>Paintings: {this.props.artist.paintings}</h3>
          <h3>Genres: {this.props.artist.genre}</h3>

        </div>
    );
  }
}

class Artists extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var artists = this.props.artists;
    var selectedArtists = [];
    var i;
    for (i = 0; i < artists.length; i++) {
      selectedArtists.push(
          <td><Artist artist={artists[i]} /></td>
        );
    }

    var displayList = [];
    for (i = 0; i < selectedArtists.length; i=i+NumberCols) {
      var row = selectedArtists.slice(i, i+NumberCols);
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

class ArtistsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {artists: null};
    this.fetchArtists = this.fetchArtists.bind(this);
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
  }

  fetchArtists() {
    fetch('http://localhost:5000/getArtistsDisplay/'.concat(PageNumber.toString(), "/", 
                                                            NumberRows.toString(), "/", 
                                                            NumberCols.toString()))
    .then(res => res.json())
    .then((data) => {
      this.setState({ artists: data.artists })
    })
    .catch(console.log)
  }

  componentDidMount() {
    this.initParams();
    this.fetchArtists();
  }

  render() {
    return this.state.artists ? (
        <div>
          <Artists artists={this.state.artists}/>
        </div> 
      ) : (
        <span>Loading artists...</span>
    )
  }
}

const artistsTable = ReactDOM.render(
  <ArtistsTable />,
  document.getElementById('image_div')
);

//////////////////////////////////////////////////////////////////////////////////

function switchPage(newPageNumber) {
  if(newPageNumber < 1) return;
  PageNumber = newPageNumber;
  document.getElementById("pageInput").value = PageNumber.toString();
  setCookie("PageNumber", PageNumber.toString());
  artistsTable.fetchArtists();
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

function goHome() {
  var setFilters = {"Artist": {}};
  setCookie("setFilters", JSON.stringify(setFilters));

  var searchInput = "*";
  setCookie("searchInput", searchInput);

  setCookie("PageNumber", "1");

  window.location.href = "/browse_images"
}

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