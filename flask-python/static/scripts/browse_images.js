var PageNumber = 1;
var NumberRows = 4;
var NumberCols = 5;

class Image extends React.Component {
  constructor(props) {
    super(props);
    this.state = { clicked: false };
  }

  render() {
    var src = "data:image/gif;base64,".concat(this.props.image.data);
    return (
      <img 
        src={src}
        alt={this.props.image.title} 
        style={{'height': '50vh', 'width': (100/NumberCols - 100/NumberCols/6).toString().concat('vw'), 'object-fit': 'cover'}}
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
  }

  componentDidMount() {
    fetch('http://localhost:5000/getImages/'.concat(PageNumber.toString(), "/", NumberRows.toString(), "/", NumberCols.toString()))
    .then(res => res.json())
    .then((data) => {
      this.setState({ images: data.images })
    })
    .catch(console.log)
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

ReactDOM.render(
  <ImageTable />,
  document.getElementById('image_table')
);