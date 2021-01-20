
class Image extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var src = "data:image/gif;base64,".concat(this.props.image.data);
    return (
      <img 
        src={src}
        alt={this.props.image.title} 
        style={{'max-height': '150vh',
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
          <Image image={this.state.image}/>
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