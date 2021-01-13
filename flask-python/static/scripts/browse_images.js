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
        width="300" 
        height="200"
        onClick={() => this.setState({ clicked: true})}>
      </img>
    );
  }
}

const Images = ({ images }) => {
  var selectedImages = [];
  var i;
  var start = (PageNumber - 1) * NumberRows * NumberCols;
  var end = PageNumber * NumberRows * NumberCols;
  for (i = start; i < end; i++) {
    if (i < images.length) {
      selectedImages.push(
        <td><Image image={images[i]} /></td>
      );
    }
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
};

class ImageTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {images: null};
  }

  componentDidMount() {
    fetch('http://localhost:5000/getImages')
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