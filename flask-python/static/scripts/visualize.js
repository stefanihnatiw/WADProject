
class Graph extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var src = "data:image/gif;base64,".concat(this.props.graph.data);
    return (
      <img 
        src={src}
        style={{'display': 'block',
                'margin': 'auto',
                'margin-bottom': '5vh',
                'object-fit': 'cover'
              }}>
      </img>
    );
  }
}


class Graphs extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var graphs = this.props.graphs;
    var i;

    var displayList = [];
    for (i = 0; i < graphs.length; i++) {
      displayList.push(
        <Graph graph={graphs[i]}/>
      )
    }
    return (
      <div>
        {displayList}
      </div>
    )
  }
}

class GraphTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {graphs: null};
    this.fetchGraphs = this.fetchGraphs.bind(this);
  }

  fetchGraphs() {
    fetch('http://localhost:5000/getGraphs')
    .then(res => res.json())
    .then((data) => {
      this.setState({ graphs: data.graphs })
    })
    .catch(console.log)
  }

  componentDidMount() {
    this.fetchGraphs();
  }

  render() {
    return this.state.graphs ? (
        <Graphs graphs={this.state.graphs}/>
      ) : (
        <span>Loading graphs...</span>
    )
  }
}

const graphTable = ReactDOM.render(
  <GraphTable />,
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