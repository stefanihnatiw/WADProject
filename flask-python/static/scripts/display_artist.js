var NumberCols = 5;

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


class Works extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var works = this.props.works;
    var worksList = [];
    var i;
    if(works !== null) {
      for (i = 0; i < works.length; i++) {
        worksList.push(
            <td><Image image={works[i]} /></td>
          );
      }
    }
    return (
        <div>
          <h4>Several works:</h4>
          <table style={{'display': 'flex','justify-content': 'center'}}>
            <tr>{worksList}</tr>
          </table>
        </div>
      )
  }
}


class MainImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {image: null};
    this.fetchImage = this.fetchImage.bind(this);
  }

  fetchImage() {
    fetch('http://localhost:5000/getArtistImage/'.concat(this.props.artist.name))
    .then(res => res.json())
    .then((data) => {
      this.setState({ image: data.image })
    })
    .catch(console.log)
  }

  componentDidMount() {
    this.fetchImage();
  }

  render() {
    return this.state.image ? (
        <img 
          src={this.state.image}
          alt={this.props.artist.name} 
          style={{'max-height': '50vh',
                  'max-width': '300px',
                  'display': 'block',
                  'margin-left': 'auto',
                  'margin-right': 'auto'
                }}
        />
      ) : (
        <span>Loading image...</span>
    )
  }
}


class ArtistData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {artist: null, artistname: document.getElementById('image_div').getAttribute("alt")};
    this.fetchArtist = this.fetchArtist.bind(this);
  }

  fetchArtist() {
    fetch('http://localhost:5000/getArtistData/'.concat(this.state.artistname))
    .then(res => res.json())
    .then((data) => {
      this.setState({ artist: data.artist })
    })
    .catch(console.log)
  }

  componentDidMount() {
    this.fetchArtist();
  }

  render() {
    return this.state.artist ? (
        <div>
          <MainImage artist={this.state.artist}/>
          <h2 style={{'display': 'flex','justify-content': 'center'}}>Artist: {this.state.artist.name}</h2>
          <h4 style={{'display': 'flex','justify-content': 'center'}}>Years: {this.state.artist.years}</h4>
          <h4 style={{'display': 'flex','justify-content': 'center'}}>Genre: {this.state.artist.genre}</h4>
          <h4 style={{'display': 'flex','justify-content': 'center'}}>Nationality: {this.state.artist.nationality}</h4>
          <h4 style={{'display': 'flex','justify-content': 'center'}}>Paintings: {this.state.artist.paintings}</h4>
          <h4 style={{'display': 'flex','justify-content': 'center'}}>Bio: {this.state.artist.bio}</h4>
          <Works works={this.state.artist.works}/>
        </div> 
      ) : (
        <span>Loading page...</span>
    )
  }
}

const imageData = ReactDOM.render(
  <ArtistData />,
  document.getElementById('image_div')
);

function goHome() {
  var setFilters = {"Artist": {}};
  setCookie("setFilters", JSON.stringify(setFilters));

  var searchInput = "*";
  setCookie("searchInput", searchInput);

  setCookie("PageNumber", "1");

  window.location.href = "/browse_images"
}