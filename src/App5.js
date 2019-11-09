import React from "react";
import Graph from "./Graph";
import img1 from "./asset/image2/1.jpg";
import img2 from "./asset/image2/2.jpg";
import img3 from "./asset/image2/3.jpg";
import * as d3 from "d3";

class App extends React.Component {
  componentDidMount() {
    this.nodes = [
      { id: 1, name: "小孩", src: img3 },
      { id: 2, name: "保安", src: img1 }
    ];
    this.edges = [{ source: 1, target: 2, text: "兄妹", id: 1 }];
    this.graph = new Graph(
      "#container",
      {
        nodes: this.nodes,
        edges: this.edges
      },
      {}
    );
  }

  addData = () => {
    this.nodes.push({
      id: 3,
      name: "女孩",
      src: img2
    });
    this.edges.push({
      id: 2,
      source: 1,
      target: 3
    });
    this.graph.update({
      nodes: this.nodes,
      edges: this.edges
    });
  };
  render() {
    return (
      <div>
        <button onClick={this.addData}> add data</button>
        <div id="container" style={{ width: 1000, height: 800 }}></div>
      </div>
    );
  }
}

export default App;
