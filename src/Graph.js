import * as d3 from "d3";

class Graph {
  constructor(selector, data, options) {
    const defaultOptions = {
      width: 1000,
      height: 800
    };
    const opts = Object.assign({}, defaultOptions, options);

    var { nodes, edges } = data;
    this.nodes = nodes;
    this.edges = edges;

    // 画图svg
    this.svg = d3
      .select(selector)
      .append("svg")
      .attr("width", opts.width)
      .attr("height", opts.height);

    // 生成力模型
    this.simulation = d3
      .forceSimulation(this.nodes)
      .force(
        "link",
        d3.forceLink(this.edges).id(function(d) {
          return d.id;
        }).distance(200)
      )
      .force("charge", d3.forceManyBody())
      .force("center", d3.forceCenter(opts.width / 2, opts.height / 2));

    // 公共defs
    this.defs = this.svg.append("defs");

    // 管理线的容器g，确保这个g在节点的g之前渲染
    // 因为渲染是按顺序的，这样线才不会覆盖节点
    this.gEdgeLayer = this.svg.append("g").attr("class", "gEdgeLayer");

    // 管理节点的容器g
    this.gCircleLayer = this.svg.append("g").attr("ckass", "gCircleLayer");

    // 画内容
    this.draw();
  }

  // 更新视图
  update(data) {
    const { nodes, edges } = data;
    this.nodes = nodes;
    this.edges = edges;
    this.draw();
  }

  draw() {
    this.drawCircle();
    this.drawEdge();
    this.simulation.on("tick", this.ticked.bind(this));
    this.simulation.restart();
  }

  drawCircle() {
    console.log("画节点", this.nodes);
    this.drawCircleFillPattern();
    let circle = this.gCircleLayer.selectAll("circle.circle");
    circle = circle.data(this.nodes, d => d.id);
    circle.exit().remove();

    circle = circle
      .enter()
      .append("circle")
      .attr("class", "circle")
      .attr("fill", d => `url(#avatar${d.id})`)
      .attr("stroke", "#ccf1fc")
      .attr("stroke-width", 2)
      .attr("r", 25);
    this.simulation.nodes(this.nodes);
  }
  drawCircleFillPattern() {
    let imagePattern = this.defs.selectAll("pattern.imagePattern");
    imagePattern = imagePattern.data(this.nodes);
    imagePattern.exit().remove();
    imagePattern = imagePattern
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
  }
  drawEdge() {
    console.log("画线", this.edges);
    let edge = this.gEdgeLayer.selectAll("path.pathEdge");
    edge = edge.data(this.edges, d => {
      return d.source.id + "-" + d.target.id;
    });
    edge.exit().remove();
    edge = edge
      .enter()
      .append("path")
      .attr("class", "pathEdge")
      .merge(edge)
      .attr("stroke", "#f00")
      .attr("stroke-width", 2);

    this.simulation
      .force("link")
      .links(this.edges)
      .id(d => d.id);
  }

  ticked() {
    console.log("this tickedd");
    let edge = this.gEdgeLayer.selectAll("path.pathEdge");
    edge.attr("d", d => {
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
    });

    let circle = this.gCircleLayer.selectAll("circle.circle");
    circle.attr("cx", d => d.x).attr("cy", d => d.y);
  }
}

export default Graph;
