class Image extends React.Component {
  constructor(props) {
    super(props);
    this.state = { clicked: false };
  }

  render() {
    return (
      <th><img 
        src="https://www.w3schools.com/css/img_5terre.jpg" 
        alt="" 
        width="300" 
        height="200"
        onClick={() => this.setState({ clicked: true})}>
      </img></th>
    );
  }
}

class ImageTable extends React.Component {
  constructor(props) {
    super(props);
  }

  renderImage(i) {
     return <Image />;
  }

  render() {
    return (
      <table>
        <tr>
          {this.renderImage(0)}
          {this.renderImage(1)}
          {this.renderImage(2)}
          {this.renderImage(3)}
        </tr>
        <tr>
          {this.renderImage(4)}
          {this.renderImage(5)}
          {this.renderImage(6)}
          {this.renderImage(7)}
        </tr>
        <tr>
          {this.renderImage(8)}
          {this.renderImage(9)}
          {this.renderImage(10)}
          {this.renderImage(11)}
        </tr>
        <tr>
          {this.renderImage(12)}
          {this.renderImage(13)}
          {this.renderImage(14)}
          {this.renderImage(15)}
        </tr>
      </table>
    );
  }
}

ReactDOM.render(
  <ImageTable />,
  document.getElementById('image_table')
);