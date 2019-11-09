import React from "react";
import Graph from "./Graph";
import img1 from "./asset/image2/1.jpg";
import img2 from "./asset/image2/2.jpg";
import img3 from "./asset/image2/3.jpg";
import * as d3 from "d3";

class App extends React.Component {
  count = 2;
  componentDidMount() {
    this.nodes = [
      { id: 1, name: "小孩", src: img1 },
      { id: 2, name: "保安", src: img3 }
    ];
    this.edges = [{ id: 1, source: 1, target: 2 }];
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
      id: this.count + 1,
      name: "女孩",
      src: img2
    });
    this.edges.push({
      id: this.count,
      source: 1,
      target: this.count + 1
    });
    this.graph.update({
      nodes: this.nodes,
      edges: this.edges
    });
    this.count++;
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
