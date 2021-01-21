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


class Recommendations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {recs: null, filename: document.getElementById('image_div').getAttribute("alt")};
    this.fetchRecs = this.fetchRecs.bind(this);
  }

  fetchRecs() {
    fetch('http://localhost:5000/getImageRecs/'.concat(this.state.filename))
    .then(res => res.json())
    .then((data) => {
      this.setState({ recs: data.recs })
    })
    .catch(console.log)
  }

  componentDidMount() {
    this.fetchRecs();
  }

  render() {
    var recs = this.state.recs;
    var recsList = [];
    var i;
    if(recs !== null) {
      for (i = 0; i < recs.length; i++) {
        recsList.push(
            <td><Image image={recs[i]} /></td>
          );
      }
    }
    return this.state.recs ? (
        <div>
          <h4>You may be interested in:</h4>
          <table>
            <tr>{recsList}</tr>
          </table>
        </div>
      ) : (
        <span>Loading recommendations...</span>
    )
  }
}


class MainImage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var src = "data:image/gif;base64,".concat(this.props.image.data);
    return (
      <img 
        src={src}
        alt={this.props.image.title} 
        style={{'max-height': '90vh',
                'display': 'block',
                'margin-left': 'auto',
                'margin-right': 'auto'
              }}
      />
    );
  }
}


class ImageData extends React.Component {
  constructor(props) {
    super(props);
    this.state = {image: null, filename: document.getElementById('image_div').getAttribute("alt")};
    this.fetchImages = this.fetchImages.bind(this);
  }

  fetchImages() {
    fetch('http://localhost:5000/getImageData/'.concat(this.state.filename))
    .then(res => res.json())
    .then((data) => {
      this.setState({ image: data.image })
    })
    .catch(console.log)
  }

  componentDidMount() {
    this.fetchImages();
  }

  render() {
    return this.state.image ? (
        <div>
          <MainImage image={this.state.image}/>
          <h2 style={{'display': 'flex','justify-content': 'center'}}>File: {this.state.image.title}</h2>
          <h4 style={{'display': 'flex','justify-content': 'center'}}>Artist: {this.state.image.artist}</h4>
          <h4 style={{'display': 'flex','justify-content': 'center'}}>Genre: {this.state.image.genre}</h4>
          <Recommendations />
        </div> 
      ) : (
        <span>Loading image...</span>
    )
  }
}

const imageData = ReactDOM.render(
  <ImageData />,
  document.getElementById('image_div')
);