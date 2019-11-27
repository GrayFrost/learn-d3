import * as d3 from "d3";

class Graph {
  linkedByIndex = {};
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
          .distance(300)
      )
      .force(
        "center",
        d3.forceCenter(this.opts.width / 2, this.opts.height / 2)
      )
      .velocityDecay(0.8) //范围0-1，较低的衰减率可以迭代更多次，使布局更合理，但会导致更多的震荡，类似阻力。
      .force("charge", d3.forceManyBody().strength(-1000))
      .force("collision", d3.forceCollide());

    // 公共defs
    this.defs = this.svg.append("defs");

    // 管理线的容器g，确保这个g在节点的g之前渲染
    // 因为渲染是按顺序的，这样线才不会覆盖节点
    this.gZoomLayer = this.svg.append('g').attr('class', 'gZoomLayer');
    this.gEdgeLayer = this.gZoomLayer.append("g").attr("class", "gEdgeLayer");

    this.gEdgeTextLayer = this.gZoomLayer.append("g").attr("class", "gEdgeTextLayer");

    // 管理节点的容器g
    this.gCircleLayer = this.gZoomLayer.append("g").attr("class", "gCircleLayer");

    this.gImageLayer = this.gZoomLayer.append("g").attr("class", "gImageLayer");

    // 图片裁剪
    this.defs
      .append("clipPath")
      .attr("id", "avatar-clip")
      .append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", this.opts.radius);

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
    this.simulation.alpha(1).restart(); //重启时要设置alpha值，不然像死鱼一样
    this.addDrag();
    this.addZoom();
    this.addHover();
  }

  drawCircle() {
    console.log("画节点", this.nodes);
    this.drawCircleNode();
    // this.drawCircleImage();

    // 重新注册节点
    this.simulation.nodes(this.nodes);
  }
  drawCircleNode() {
    let gCircle = this.gCircleLayer.selectAll("g.circleWrap");
    gCircle = gCircle.data(this.nodes, d => d.id);
    gCircle.exit().remove();

    gCircle = gCircle
      .enter()
      .append("g")
      .attr("class", "circleWrap");
      
      gCircle.append('circle')
      .attr('class', 'circle')
      .style("fill", "#fff")
      .attr("stroke", "#ccf1fc")
      .attr("stroke-width", 2)
      .attr("r", this.opts.radius + 2);

      gCircle.append('image')
      .attr('xlink:href', d => {
        return d.src;
      }).attr('class', 'img')
      .attr("x", -this.opts.radius)
      .attr("y", -this.opts.radius)
      .attr("width", this.opts.radius * 2)
      .attr("height", this.opts.radius * 2)
      .attr("clip-path", "url(#avatar-clip)");
      gCircle.append('image')
      .attr('xlink:href', (d) => {
        return d.icons && d.icons[0] ? d.icons[0].src : ''
      });
      gCircle.append('image')
      .attr('xlink:href', (d) => {
        return d.icons && d.icons[1] ? d.icons[1].src : ''
      }).attr('x', 30).attr('y', 0);
  }
  drawCircleImage() {
    let image = this.gImageLayer.selectAll("image.imageCircle");
    image = image.data(this.nodes);
    image.exit().remove();

    image = image
      .enter()
      .append("image")
      .attr("class", "imageCircle")
      .attr("xlink:href", d => d.src)
      .attr("x", -this.opts.radius)
      .attr("y", -this.opts.radius)
      .attr("width", this.opts.radius * 2)
      .attr("height", this.opts.radius * 2)
      .attr("clip-path", "url(#avatar-clip)");
  }

  drawEdge() {
    console.log("画线", this.edges);
    // 统计关联节点
    this.edges.forEach(d => {
      this.linkedByIndex[d.source.index + "," + d.target.index] = 1;
    });

    this.drawEdgeLine();
    this.drawEdgeText();

    // 重新注册线
    this.simulation
      .force("link")
      .links(this.edges)
      .id(d => d.id);
  }

  isConnected(a, b) {
    return (
      this.linkedByIndex[a.index + "," + b.index] ||
      this.linkedByIndex[b.index + "," + a.index] ||
      a.index === b.index
    );
  }

  // 求两点之间的距离
  getDis(s, t) {
    return Math.sqrt((s.x - t.x) * (s.x - t.x) + (s.y - t.y) * (s.y - t.y));
  }

  drawEdgeText() {
    let text = this.gEdgeTextLayer.selectAll("text.edgeText");
    text = text.data(this.edges);
    text.exit().remove();
    text = text
      .enter()
      .append("text")
      .attr("class", "edgeText")
      .attr("stroke", "blue")
      .attr("text-anchor", "middle")
      .append("textPath")
      .attr("xlink:href", (d, i) => {
        return `#edgepath${i}`;
      })
      .text(d => {
        return d.count;
      })
      .on("click", d => {
        text.style("stroke", o => {
          return d.id === o.id ? "orange" : "blue";
        });
      });
  }

  drawEdgeLine() {
    let edge = this.gEdgeLayer.selectAll("path.pathEdge");
    edge = edge.data(this.edges);
    edge.exit().remove();
    edge = edge
      .enter()
      .append("path")
      .attr("id", (d, i) => {
        return `edgepath${i}`;
      })
      .attr("class", "pathEdge")
      .attr("stroke", "#00f")
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
    const circleImage = this.gCircleLayer.selectAll('g.circleWrap');
    console.log('zzh circle image', circleImage);
    circleImage.call(drag);
  }

  addZoom() {
    var _this = this;
    function onZoomStart(d) {}
    function zooming(d) {
      // 缩放和拖拽整个g
      _this.gZoomLayer.attr("transform", d3.event.transform); // 获取g的缩放系数和平移的坐标值。
    }
    function onZoomEnd() {}
    const zoom = d3
      .zoom()
      .scaleExtent([1 / 10, 10]) // 设置最大缩放比例
      .on("start", onZoomStart)
      .on("zoom", zooming)
      .on("end", onZoomEnd);
    this.svg.call(zoom);
  }

  addHover() {
    const nodeImage = this.gImageLayer.selectAll("image.imageCircle");
    const edgeLine = this.gEdgeLayer.selectAll("path.pathEdge");
    nodeImage
      .on("mouseover", d => {
        nodeImage.style("opacity", o => {
          return this.isConnected(d, o) ? 0.3 : 1;
        });

        edgeLine.style("stroke-opacity", o => {
          return o.source === d || o.target === d ? 0.3 : 1;
        });
      })
      .on("mouseout", d => {
        nodeImage.style("opacity", 1);
        edgeLine.style("stroke-opacity", 1);
      });
  }

  // 校正位置
  ticked() {
    let _this = this;
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

    // 设置边上的文字居中
    let text = this.gEdgeTextLayer.selectAll("text.edgeText");
    text
      .attr("x", d => {
        return _this.getDis(d.source, d.target) / 2;
      })
      .attr("dy", -10) // 距离线一定距离，不要粘着

    let gCircle = this.gCircleLayer.selectAll('g.circleWrap');
    gCircle.attr('transform', d=> {
      return "translate(" + d.x + "," + d.y + ")"
    })
  }
}

export default Graph;
