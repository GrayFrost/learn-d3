import React from "react";
import Graph from "./Graph-add-icon";
import img1 from "./asset/image2/1.jpg";
import img2 from "./asset/image2/2.jpg";
import img3 from "./asset/image2/3.jpg";
import svg1 from "./asset/svg/icon-huji.svg";
import svg2 from "./asset/svg/icon-wz.svg";

class App extends React.Component {
  count = 2;
  imageArr = [img1, img2, img3];
  componentDidMount() {
    this.nodes = [
      { id: 1, name: "小孩", src: img1, icons: [{ src: svg1 }, { src: svg2 }] },
      { id: 2, name: "保安", src: img3, icons: [{ src: svg2 }] }
    ];
    this.edges = [{ id: 1, source: 1, target: 2, count: 10 }];
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
      target: this.count + 1,
      count: 12
    });
    this.graph.update({
      nodes: this.nodes,
      edges: this.edges
    });
    this.count++;
  };

  addManyData = () => {
    let newNodes = [];
    let newEdges = [];
    for (var i = 1; i < 10; i++) {
      newNodes.push({
        id: i,
        name: "node" + i,
        src: this.imageArr[i % 3]
      });
      if (i > 1) {
        newEdges.push({
          id: i,
          text: "edge" + i,
          source: 1,
          target: i,
          count: Math.ceil(Math.random() * 10)
        });
      }
    }
    this.graph.update({
      nodes: newNodes,
      edges: newEdges
    });
  };
  render() {
    return (
      <div>
        <div style={{ position: "fixed", top: 0 }}>
          <button onClick={this.addData}> add data</button>
          <button onClick={this.addManyData}> add many data</button>
        </div>
        <div id="container" style={{ width: 1000, height: 600 }}></div>
      </div>
    );
  }
}

export default App;
