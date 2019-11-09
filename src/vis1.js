import React from "react";
import vis from "vis-network";
import img1 from "./asset/image/tan.jpg";
import img2 from "./asset/image/san.jpg";
import img3 from "./asset/image/ino.jpg";

class App extends React.Component {
  nodes = null;
  edges = null;
  highlightActive = false;
  allNodes = null;
  componentDidMount() {
    const imgArr = [img1, img2, img3];
    const nodesData = [];
    const edgesData = [];

    for (var i = 1; i < 10; i++) {
      nodesData.push({
        id: i,
        // label: `Node ${i}`,
        image: imgArr[i % 3]
      });
      if (i > 1) {
        edgesData.push({
          id: i,
          from: 1,
          to: i,
          label: 'edge ' + i
        });
      }
    }
    var nodes = new vis.DataSet(nodesData);
    this.nodes = nodes;

    var edges = new vis.DataSet(edgesData);
    this.edges = edges;
    var container = document.querySelector("#container");
    console.log('zzh nodes, edges', nodes, edges);
    var data = {
      nodes,
      edges
    };
    var options = {
      nodes: {
        shape: "circularImage",
        borderWidth: 5,
        size: 50,
        color: {
          border: "orange",
          background: "#666666",
        },
        chosen: {
          node: (values, id, selected, hovering) => {
            // console.log('choose node', values, id, selected, hovering);
          }
        }
      },
      edges: {
        dashes: true,
        color: "blue",
        length: 200,
        smooth: false,
        font: {
          align: 'horizontal',
          color: 'blue'
        },
        chosen: {
          label: (values, id, selected, hovering) =>{
            // console.log('choose label', values, id, selected, hovering);
            values.color = 'orange';
          }
        }
      },
      interaction: {
        hover: true
      }
    };
    this.network = new vis.Network(container, data, options);
    this.allNodes = nodes.get({returnType: 'Object'});
    this.network.on('click', this.neighborHighlight)
  }

  neighborHighlight = (params) => {
    if(params.nodes.length > 0){
      this.highlightActive = true;
      
      var selectedNode = params.nodes[0];
      console.log('selectednode', selectedNode);
      var connectedNodes = this.network.getConnectedNodes(selectedNode);
      console.log('connectedNode', connectedNodes);
      console.log('zzh allnode', this.allNodes);
      for(let i = 0; i< connectedNodes.length; i++){
        this.allNodes[connectedNodes[i]].color = 'red';
      }
    }
  }
  
  render() {
    return <div id="container" style={{ width: 1000, height: 800 }}></div>;
  }
}
export default App;
