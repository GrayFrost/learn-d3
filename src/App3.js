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
          .iterations(500)
          .radius(50)
      )
      .force("charge", d3.forceManyBody().strength(-10))
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

    circlesEnter.call(
      d3
        .drag()
        .on("start", d => {
          d3.event.sourceEvent.stopPropagation();
          // restart()方法重新启动模拟器的内部计时器并返回模拟器。
          // 与simulation.alphaTarget或simulation.alpha一起使用时，此方法可用于在交互
          // 过程中进行“重新加热”模拟，例如在拖动节点时，在simulation.stop暂停之后恢复模拟。
          // 当前alpha值为0，需设置alphaTarget让节点动起来
          if (!d3.event.active) this.simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", d => {
          // d.fx属性- 节点的固定x位置
          // 在每次tick结束时，d.x被重置为d.fx ，并将节点 d.vx设置为零
          // 要取消节点，请将节点 .fx和节点 .fy设置为空，或删除这些属性。
          d.fx = d3.event.x;
          d.fy = d3.event.y;
        })
        .on("end", d => {
          // 让alpha目标值值恢复为默认值0,停止力模型
          if (!d3.event.active) this.simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
    );

    // 更新线
    const edgesEnter = edges
      .enter()
      .append("path")
      .attr("class", "pathEdge")
      .attr("d", d => {
        return (
          d &&
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
    // setTimeout(() => {
    //   this.simulation.stop();
    // }, 100); // 先这样暂停吧，不然一直在动
  }
}

class App extends React.Component {
  componentDidMount() {
    this.nodes = [
      { id: 1, name: "小孩", src: img3 },
      { id: 2, name: "保安", src: img1 }
    ];
    this.edges = [{ source: 1, target: 2, text: "兄妹" }];
    this.graph = new MyGraph("#container");
    this.graph.update({ nodes: this.nodes, edges: this.edges });
  }

  changeData = () => {
    // const nodes = [
    //   { id: 1, name: "小孩", src: img1 },
    //   { id: 2, name: "女生", src: img2 },
    //   { id: 3, name: "保安", src: img3 },
    //   { id: 4, name: "小孩2", src: img1 },
    //   { id: 5, name: "小孩2", src: img1 },
    //   { id: 6, name: "小孩2", src: img1 },
    //   { id: 7, name: "小孩2", src: img1 },
    //   { id: 8, name: "小孩2", src: img1 },
    // ];
    this.nodes = [];
    this.edges = [];
    for (let i = 1; i < 10; i++) {
      this.nodes.push({
        id: i,
        name: "小孩" + i,
        src: img1
      });
      if (i > 1) {
        this.edges.push({
          source: 1,
          target: i,
          text: "123"
        });
      }
    }

    // const edges = [
    //   { source: 1, target: 2, text: "兄妹" },
    //   { source: 1, target: 3, text: "兄弟" },
    //   { source: 1, target: 4, text: "兄弟" },
    //   { source: 1, target: 5, text: "兄弟" },
    //   { source: 1, target: 6, text: "兄弟" },
    //   { source: 1, target: 7, text: "兄弟" },
    //   { source: 1, target: 8, text: "兄弟" }
    // ];
    this.graph.update({ nodes: this.nodes, edges: this.edges });
  };

  addData = () => {
      console.log('zzh add data');
    const newNodes = [
      { id: 101, name: "女生", src: img2 },
      { id: 102, name: "女生2", src: img2 }
    ];
    const newEdges = [
      { source: 2, target: 101, text: "啊啊" },
      { source: 2, target: 102, text: "啊啊" }
    ];
    
    this.nodes = this.nodes.concat(newNodes);
    this.edges = this.edges.concat(newEdges);
    console.log('zzh this.nodes', this.nodes);
    this.graph.update({ nodes: this.nodes, edges: this.edges });
  };
  render() {
    return (
      <div>
        <button onClick={this.changeData}>change data</button>
        <button onClick={this.addData}>add data</button>
        <div id="container"></div>
      </div>
    );
  }
}

export default App;
