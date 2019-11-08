import React from "react";
import * as d3 from "d3";

const WIDTH = 1200;
const HEIGHT = 800;
const gZindexClass = ["edge-line", "node-circle", "node-image"];
const nodeCircleRadius = 30;
const nodeImageRadius = 29;
const roundDefId = "avatar-clip";
const arrowDefId = "arrow";
class App extends React.Component {
  nodes = null; // 节点数据
  links = null; // 边数据
  force = null; // 模型
  svg = null;
  defs = null;
  edgeLine = null;
  nodeCircle = null;
  nodeImage = null;

  state = {
    showModal: false,
    x: 0,
    y: 0
  };

  componentDidMount() {
    this.renderSvg();
    this.renderG();
    this.renderDefs();

    this.getData();
    this.renderForce();
    this.updateSimulation();
  }
  // 获取节点和边的数据
  getData() {
    this.nodes = [
      {
        id: 1,
        name: "a",
        src:
          "http://192.168.13.23:8080/ifstore000001/M00/FA/E3/wKgNF126ubmARkZ6AAASII5ugKA806_100x100.jpg"
      },
      {
        id: 2,
        name: "b",
        src:
          "http://192.168.13.23:8080/ifstore000001/M00/FA/E3/wKgNF126ubmARkZ6AAASII5ugKA806_100x100.jpg"
      },
      {
        id: 3,
        name: "c",
        src:
          "http://192.168.13.23:8080/ifstore000001/M00/FA/E3/wKgNF126ubmARkZ6AAASII5ugKA806_100x100.jpg"
      },
      {
        id: 4,
        name: "d",
        src:
          "http://192.168.13.23:8080/ifstore000001/M00/FA/E3/wKgNF126ubmARkZ6AAASII5ugKA806_100x100.jpg"
      },
      {
        id: 5,
        name: "e",
        src:
          "http://192.168.13.23:8080/ifstore000001/M00/FA/E3/wKgNF126ubmARkZ6AAASII5ugKA806_100x100.jpg"
      }
    ];
    this.links = [
      { id: 1, source: 1, target: 2, tag: "ab" },
      { id: 2, source: 1, target: 3, tag: "ac" },
      { id: 3, source: 1, target: 4, tag: "ad" },
      { id: 4, source: 1, target: 5, tag: "ae" }
    ];
  }

  // 模型
  renderForce() {
    this.force = d3
      .forceSimulation(this.nodes)
      .force(
        "link",
        d3
          .forceLink(this.links)
          .id(d => d.id)
          .distance(200)
      )
      .force("collision", d3.forceCollide(1))
      .force("center", d3.forceCenter(WIDTH / 2, HEIGHT / 2))
      .force(
        "charge",
        d3
          .forceManyBody()
          .strength(-100)
          .distanceMax(200)
      );
  }

  updateSimulation() {
    this.updateGraph();
    this.correctPosition();
    this.addInteraction();
  }

  updateGraph() {
    // edge
    let edgeElements = this.edgeLineLayer.selectAll("line").data(this.links);
    edgeElements.exit().remove();
    let edgeEnter = edgeElements
      .enter()
      .append("line")
        .attr("x1", d => d.source.x)
        .attr("x2", d => d.target.x)
        .attr("y1", d => d.source.y)
        .attr("y2", d => d.target.y)
      .attr("id", (d, i) => {
        return "edgepath" + i;
      })
      .style("stroke", "#000")
      .style("stroke-width", 1);
    edgeElements = edgeEnter.merge(edgeElements);
    this.edgeLine = edgeElements;

    // node circle
    let nodeElements = this.nodeCircleLayer
      .selectAll("circle")
      .data(this.nodes, d => d.id);
    nodeElements.exit().remove();
    let nodeEnter = nodeElements
      .enter()
      .append("circle")
      .attr("r", nodeCircleRadius)
      .style("fill", "#eee")
      .style("stroke", "#ffa500")
      .style("stroke-width", 2);
    nodeElements = nodeEnter.merge(nodeElements);
    this.nodeCircle = nodeElements;

    // node image
    let nodeImageElements = this.nodeImageLayer
      .selectAll("image")
      .data(this.nodes);
    nodeImageElements.exit().remove();
    let nodeImageEnter = nodeImageElements
      .enter()
      .append("image")
      .attr("xlink:href", d => d.src)
      .attr("x", -nodeImageRadius)
      .attr("y", -nodeImageRadius)
      .attr("width", nodeImageRadius * 2)
      .attr("height", nodeImageRadius * 2)
      .attr("clip-path", `url(#${roundDefId})`);
    nodeImageElements = nodeImageEnter.merge(nodeImageElements);
    this.nodeImage = nodeImageElements;
  }

  renderDefs() {
    const defs = this.svg.append("defs");
    this.defs = defs;
    this.renderRound();
  }

  renderRound() {
    const round = this.defs
      .append("clipPath")
      .attr("id", roundDefId)
      .append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", nodeImageRadius);
  }

  // 分层
  renderG() {
    this.edgeLineLayer = this.svg.append("g").attr("class", gZindexClass[0]);
    this.nodeCircleLayer = this.svg.append("g").attr("class", gZindexClass[1]);
    this.nodeImageLayer = this.svg.append("g").attr("class", gZindexClass[2]);
  }

  // 交互
  addInteraction() {
    this.addZoom();
    this.addDrag();
    this.addImageClick();
  }

  addZoom() {
    function onZoomStart(d) {
      // console.log('start zoom');
    }
    function zooming(d) {
      // 缩放和拖拽整个g
      d3.selectAll("g").attr("transform", d3.event.transform); // 获取g的缩放系数和平移的坐标值。
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

  addDrag() {
    const _this = this;
    function onDragStart(d) {
      if (!d3.event.active) {
        _this.force.alphaTarget(1).restart();
      }
    }

    function dragging(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function onDragEnd(d) {}

    const drag = d3
      .drag()
      .on("start", onDragStart)
      .on("drag", dragging)
      .on("end", onDragEnd);
    this.nodeImage.call(drag);
  }

  addImageClick() {
    this.nodeImage.on("click", e => {
      console.log("zzh click", e);
      if (this.state.showModal) {
        this.setState({
          showModal: false
        });
      } else {
        this.setState({
          showModal: true,
          x: e.x,
          y: e.y
        });
      }
    });
  }

  renderSvg() {
    const svg = d3
      .select("#container")
      .append("svg")
      .attr("width", WIDTH)
      .attr("height", HEIGHT);
    this.svg = svg;
  }

  correctPosition() {
    this.force.nodes(this.nodes).on("tick", () => {
      this.edgeLine
        .attr("x1", d => d.source.x)
        .attr("x2", d => d.target.x)
        .attr("y1", d => d.source.y)
        .attr("y2", d => d.target.y);

      this.nodeCircle.attr("cx", d => d.x).attr("cy", d => d.y);

      this.nodeImage.attr("transform", d => {
        return d && "translate(" + d.x + "," + d.y + ")";
      });
    });
    this.force.force("link").links(this.links);
    this.force.alphaDecay(0.7).restart();
  }

  changeData() {
    this.nodes.push({
      id: 5,
      name: "e",
      src:
        "http://192.168.13.23:8080/ifstore000001/M00/FA/E3/wKgNF126ubmARkZ6AAASII5ugKA806_100x100.jpg"
    });
    this.links.push({ id: 6, source: 1, target: 5, tag: "ae" });
    this.updateSimulation();
  }

  render() {
    return (
      <div>
        <button onClick={this.changeData.bind(this)}>change data</button>
        <div id="container"></div>
        {this.state.showModal && (
          <div
            style={{
              background: "orange",
              height: 200,
              position: "absolute",
              left: this.state.x,
              top: this.state.y + nodeImageRadius
            }}
          >
            modal click <br />
            123123
          </div>
        )}
      </div>
    );
  }
}

export default App;
