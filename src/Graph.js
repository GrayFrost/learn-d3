import * as d3 from "d3";

class Graph {
  constructor(selector, data, options) {
    const defaultOptions = {
      width: 1000,
      height: 800,
      radius: 50 // 图片半径
    };
    this.opts = Object.assign({}, defaultOptions, options);

    var { nodes, edges } = data;
    this.nodes = nodes;
    this.edges = edges;

    // 画图svg
    this.svg = d3
      .select(selector)
      .append("svg")
      .attr("width", this.opts.width)
      .attr("height", this.opts.height);

    // 生成力模型
    this.simulation = d3
      .forceSimulation(this.nodes)
      .force(
        "link",
        d3
          .forceLink(this.edges)
          .id(function(d) {
            return d.id;
          })
          .distance(200)
      )
      .force(
        "center",
        d3.forceCenter(this.opts.width / 2, this.opts.height / 2)
      );

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
    this.addDrag();
    this.addZoom();
    this.addHover();
  }

  drawCircle() {
    console.log("画节点", this.nodes);
    this.drawCircleFillPattern();
    this.drawCircleImage();

    // 重新注册节点
    this.simulation.nodes(this.nodes);
  }
  drawCircleImage() {
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
      .attr("r", this.opts.radius);
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
      .attr("height", this.opts.radius * 2)
      .attr("width", this.opts.radius * 2)
      .attr("preserveAspectRatio", "xMidYMin slice");
  }
  drawEdge() {
    console.log("画线", this.edges);
    this.drawEdgeLine();

    // 重新注册线
    this.simulation
      .force("link")
      .links(this.edges)
      .id(d => d.id);
  }

  drawEdgeLine() {
    let edge = this.gEdgeLayer.selectAll("path.pathEdge");
    edge = edge.data(this.edges, d => {
      return d.source.id + "-" + d.target.id;
    });
    edge.exit().remove();
    edge = edge
      .enter()
      .append("path")
      .attr("class", "pathEdge")
      .attr("stroke", "#f00")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "5 5");
  }

  addDrag() {
    var _this = this;
    function onDragStart(d) {
      d3.event.sourceEvent.stopPropagation();
      if (!d3.event.active) {
        _this.simulation.alphaTarget(1).restart();
      }
    }

    function dragging(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function onDragEnd(d) {
      // 让alpha目标值值恢复为默认值0,停止力模型
      if (!d3.event.active) _this.simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    const drag = d3
      .drag()
      .on("start", onDragStart)
      .on("drag", dragging)
      .on("end", onDragEnd);
    const circleImage = this.gCircleLayer.selectAll("circle.circle");
    circleImage.call(drag);
  }

  addZoom() {
    var _this = this;
    function onZoomStart(d) {
      // console.log('start zoom');
    }
    function zooming(d) {
      // 缩放和拖拽整个g
      _this.gEdgeLayer.attr("transform", d3.event.transform); // 获取g的缩放系数和平移的坐标值。
      _this.gCircleLayer.attr("transform", d3.event.transform);
    }
    function onZoomEnd() {
      // console.log('zoom end');
    }
    const zoom = d3
      .zoom()
      .scaleExtent([1 / 10, 10]) // 设置最大缩放比例
      .on("start", onZoomStart)
      .on("zoom", zooming)
      .on("end", onZoomEnd);
    this.svg.call(zoom);
  }

  addHover() {
    const nodeImage = this.gCircleLayer.selectAll("circle.circle");
    nodeImage
      .on("mouseover", d => {
        console.log("zzh mouseover");
        nodeImage.style('opacity', o => {
          return 0.3;
        })
      })
      .on("mouseout", d => {
        console.log("zzh mouseout");
        nodeImage.style('opacity', 1);
      });
  }

  // 校正位置
  ticked() {
    console.log("this tickedd");
    let edge = this.gEdgeLayer.selectAll("path.pathEdge");
    edge.attr("d", d => {
      console.log("zzh edge dddd", d);
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
