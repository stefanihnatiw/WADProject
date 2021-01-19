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
  }

  fetchImages() {
    fetch('http://localhost:5000/getImages/'.concat(PageNumber.toString(), "/", NumberRows.toString(), "/", NumberCols.toString()))
    .then(res => res.json())
    .then((data) => {
      this.setState({ images: data.images })
    })
    .catch(console.log)
  }

  componentDidMount() {
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
  document.getElementById('image_table')
);

//////////////////////////////////////////////////////////////////////////////////

function switchPage(newPageNumber) {
  if(newPageNumber < 1) return;
  PageNumber = newPageNumber;
  document.getElementById("pageInput").value = PageNumber.toString();
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

/////////////////////////////////////////////////////////////////////////////////

var navOpen = false;
var browseOpen = false;

function updateNav() {
  if(!navOpen) {
    document.getElementById("mySidenav").style.width = "14%";
    document.getElementById("image_table").style.setProperty('margin-left', '14%');
    navOpen = true;
  } else {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("image_table").style.setProperty('margin-left', '7%');
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

///////////////////////////////////////////////////////////////////////////////////
