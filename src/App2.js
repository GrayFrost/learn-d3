import React from "react";
import * as d3 from "d3";
import img1 from "./asset/image2/1.jpg";
import img2 from "./asset/image2/2.jpg";
import img3 from "./asset/image2/3.jpg";

function Force(selector, data) {
  const WIDTH = 1200;
  const HEIGHT = 800;
  const { nodes, edges } = data;

  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3
        .forceLink(edges)
        .id(d => d.id)
        .distance(200)
    )
    .force(
      "collision",
      d3
        .forceCollide(100)
        .strength(0.2)
        .iterations(5)
    )
    .force("center", d3.forceCenter(WIDTH / 2, HEIGHT / 2))
    .force("charge", d3.forceManyBody().strength(-300))
    .alphaDecay(0.028);

  const tooltip = d3
    .select("#tooltip")
    .append("div")
    .style("position", "fixed")
    .style("display", "none")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .html(`<p>hello world</p>`)
    .on("click", e => {
      tooltip.style("display", "none");
    });

  const svg = d3
    .select(selector)
    .append("svg")
    .attr("width", WIDTH)
    .attr("height", HEIGHT);

  const defs = svg.append("defs");
  const imagePattern = defs
    .selectAll("defs.imagePattern")
    .data(nodes)
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
  imagePattern
    .append("image")
    .attr("class", "imageInPattern")
    .attr("xlink:href", d => d.src)
    .attr("height", 50)
    .attr("width", 50)
    .attr("preserveAspectRatio", "xMidYMin slice");

  const gEdge = svg.append("g").attr("class", "gEdge"); // 注意线的g在前，确保其在下方
  const gCircle = svg.append("g").attr("class", "gCircle");
  const edgeLine = gEdge
    .selectAll("path.pathEdge")
    .data(edges)
    .enter()
    .append("path")
    .attr("d", d => {
      return (
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

  const nodeCircle = gCircle
    .selectAll("circle.circle")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("class", "circle")
    .attr("fill", d => `url(#avatar${d.id})`)
    .attr("stroke", "#ccf1fc")
    .attr("stroke-width", 2)
    .attr("r", 25);

  nodeCircle.on("click", e => {
    console.log("zzh circle hover", e);
    tooltip
      .style("display", "block")
      .style("top", e.y + "px")
      .style("left", e.x + "px");
  });

  nodeCircle.call(
    d3
      .drag()
      .on("start", d => {
        d3.event.sourceEvent.stopPropagation();
        // restart()方法重新启动模拟器的内部计时器并返回模拟器。
        // 与simulation.alphaTarget或simulation.alpha一起使用时，此方法可用于在交互
        // 过程中进行“重新加热”模拟，例如在拖动节点时，在simulation.stop暂停之后恢复模拟。
        // 当前alpha值为0，需设置alphaTarget让节点动起来
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
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
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      })
  );

  simulation.on("tick", ticked);
  function update() {}
  function ticked() {
    nodeCircle.attr("cx", d => d.x).attr("cy", d => d.y);
    edgeLine.attr("d", d => {
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
  }
}

class App extends React.Component {
  componentDidMount() {
    const nodes = [
      { id: 1, name: "小孩", src: img1 },
      { id: 2, name: "女生", src: img2 },
      { id: 3, name: "保安", src: img3 },
    ];
    const edges = [
      { source: 1, target: 2, text: "兄妹" },
      { source: 1, target: 3, text: "兄弟" },
    ];
    const data = {
      nodes,
      edges
    };
    Force("#container", data);
  }

  render() {
    return (
      <div>
        <button>change data</button>
        <div id="container"></div>
        <div id="tooltip"></div>
      </div>
    );
  }
}

export default App;
