import React from "react";
import vis from "vis-network";
import img1 from "./asset/image/tan.jpg";
import img2 from "./asset/image/san.jpg";
import img3 from "./asset/image/ino.jpg";

class App extends React.Component {
  componentDidMount() {
    const imgArr = [img1, img2, img3];
    const nodesData = [];
    const edgesData = [];

    for (var i = 1; i < 10; i++) {
      nodesData.push({
        id: i,
        label: `Node ${i}`,
        image: imgArr[i % 3]
      });
      if (i > 1) {
        edgesData.push({
          from: 1,
          to: i
        });
      }
    }
    var nodes = new vis.DataSet(nodesData);

    var edges = new vis.DataSet(edgesData);

    var container = document.querySelector("#container");
    var data = {
      nodes,
      edges
    };
    var options = {
      nodes: {
        shape: "circularImage",
        borderWidth: 2,
        size: 50,
        color: {
          border: "green",
          background: "#666666"
        }
      },
      edges: {
        dashes: true,
        color: "orange",
        length: 200,
        smooth: false
      }
    };
    var network = new vis.Network(container, data, options);
  }
  render() {
    return <div id="container" style={{ width: 1000, height: 800 }}></div>;
  }
}
export default App;
