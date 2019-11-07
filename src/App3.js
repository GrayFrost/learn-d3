import React from "react";
import * as d3 from "d3";
import img1 from "./asset/image2/1.jpg";
import img2 from "./asset/image2/2.jpg";
import img3 from "./asset/image2/3.jpg";

class MyGraph {
  w = 1200;
  h = 800;
  constructor(selector) {
    this.svg = d3
      .select(selector)
      .append("svg")
      .attr("width", this.w)
      .attr("height", this.h);

    this.simulation = d3
      .forceSimulation()
      .force(
        "link",
        d3.forceLink().id(function(d) {
          return d.id;
        })
      )
      .force(
        "collision",
        d3
          .forceCollide(100)
        //   .strength(0.2)
        //   .iterations(5)
      )
      .force("charge", d3.forceManyBody().strength(-30))
      .alphaDecay(0.028)
      .force("center", d3.forceCenter(this.w / 2, this.h / 2));

    this.nodes = this.simulation.nodes();

    this.defs = this.svg.append("defs");

    this.gEdge = this.svg.append("g").attr("class", "gEdge"); // 注意线的g在前，确保其在下方
    this.gCircle = this.svg.append("g").attr("class", "gCircle");
  }

  update(data) {
    let newNodes = data.nodes;
    let newEdges = data.edges;
    let edges = this.gEdge.selectAll("path.pathEdge").data(newEdges);
    let circles = this.gCircle.selectAll("circle.circle").data(newNodes);

    const imagePattern = this.defs
      .selectAll("defs.imagePattern")
      .data(newNodes);

    const imagePatternEnter = imagePattern
      .enter()
      .append("pattern")
      .attr("class", "imagePattern")
      .attr("id", d => `avatar${d.id}`)
      .attr("patternUnits", "objectBoundingBox")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", "1")
      .attr("height", "1");

    // 将图片放在pattern中，circle通过fill的方式填充图片
    imagePatternEnter
      .append("image")
      .attr("class", "imageInPattern")
      .attr("xlink:href", d => d.src)
      .attr("height", 50)
      .attr("width", 50)
      .attr("preserveAspectRatio", "xMidYMin slice");

    // 更新节点
    const circlesEnter = circles
      .enter()
      .append("circle")
      .attr("class", "circle")
      .attr("fill", d => `url(#avatar${d.id})`)
      .attr("stroke", "#ccf1fc")
      .attr("stroke-width", 2)
      .attr("r", 25);
    circles = circlesEnter.merge(circles);

    circles.exit().remove();

    // 更新线
    const edgesEnter = edges
      .enter()
      .append("path")
      .attr("class", "pathEdge")
      .attr("d", d => {
        return d && (
          "M " +
          d.source.x +
          " " +
          d.source.y +
          " L " +
          d.target.x +
          " " +
          d.target.y
        );
      })

      .attr("stroke", "#ccf1fc")
      .attr("stroke-width", 2);

    edges = edgesEnter.merge(edges);
    edges.exit().remove();

    this.simulation.nodes(newNodes);

    this.simulation
      .force("link")
      .links(newEdges)
      .id(d => d.id);

    this.simulation.on("tick", () => {
      circles.attr("cx", d => d.x).attr("cy", d => d.y);
      edges.attr("d", d => {
        const path = 
          "M " +
          d.source.x +
          " " +
          d.source.y +
          " L " +
          d.target.x +
          " " +
          d.target.y;
        return path;
      });
    });

    /* Restart the force layout */
    this.simulation.alphaTarget(0.3).restart();
    setTimeout(() => {
        this.simulation.stop();
    }, 100); // 先这样暂停吧，不然一直在动
  }
}

class App extends React.Component {
  componentDidMount() {
    const nodes = [
      { id: 1, name: "小孩", src: img1 },
      { id: 2, name: "女生", src: img2 }
    ];
    const edges = [{ source: 1, target: 2, text: "兄妹" }];
    this.graph = new MyGraph("#container");
    this.graph.update({ nodes, edges });
  }

  changeData = () => {
    const nodes = [
      { id: 1, name: "小孩", src: img1 },
      { id: 2, name: "女生", src: img2 },
      { id: 3, name: "保安", src: img3 }
    ];

    const edges = [
      { source: 1, target: 2, text: "兄妹" },
      { source: 1, target: 3, text: "兄弟" }
    ];
    this.graph.update({ nodes, edges });
  };
  render() {
    return (
      <div>
        <button onClick={this.changeData}>change data</button>
        <div id="container"></div>
      </div>
    );
  }
}

export default App;
