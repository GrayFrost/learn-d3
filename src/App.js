import React from "react";
import * as d3 from "d3";
import "./index.css";
import tanImg from "./asset/image/tan.jpg";
import neImg from "./asset/image/ne.jpg";
import sanImg from "./asset/image/san.jpg";
import inoImg from "./asset/image/ino.jpg";

class App extends React.Component {
  componentDidMount() {
    const nodes = [
      { id: 1, name: "炭治郎", src: tanImg },
      { id: 2, name: "祢豆子", src: neImg },
      { id: 3, name: "善逸", src: sanImg },
      { id: 4, name: "猪猪", src: inoImg }
    ];
    const edges = [
      { id: 1, source: 1, target: 2, tag: "哥哥" },
      { id: 2, source: 1, target: 3, tag: "伙伴" },
      { id: 3, source: 1, target: 4, tag: "伙伴" },
      { id: 4, source: 2, target: 1, tag: "妹妹" }
    ];

    var linkedByIndex = {};
    edges.forEach(d => {
      linkedByIndex[d.source.index + "," + d.target.index] = 1;
    });

    function isConnected(a, b) {
      console.log("zzh ab", a, b);
      return (
        linkedByIndex[a.index + "," + b.index] ||
        linkedByIndex[b.index + "," + a.index] ||
        a.index === b.index
      );
    }

    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(edges)
          .id(d => d.id)
          .distance(200)
      )
      .force("collision", d3.forceCollide(1))
      .force("center", d3.forceCenter(600, 400))
      .force(
        "charge",
        d3
          .forceManyBody()
          .strength(-1000)
          .distanceMax(800)
      );

    function onZoomStart(d) {
      // console.log('start zoom');
    }
    function zooming(d) {
      // 缩放和拖拽整个g
      g.attr("transform", d3.event.transform); // 获取g的缩放系数和平移的坐标值。
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

    const svg = d3
      .select("#container")
      .append("svg")
      .attr("width", 1200)
      .attr("height", 800)
      .call(zoom);

    const g = svg.append("g");

    const edgeLine = svg
      .select("g")
      .selectAll("line")
      .data(edges)
      .enter()
      .append("path")
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
      .attr("id", (d, i) => {
        return "edgepath" + i;
      })
      .attr("marker-end", "url(#arrow)") // id为arrow的元素
      .style("stroke", "#000")
      .style("stroke-width", 1);

    const nodeCircle = svg
      .select("g")
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", 30)
      .style("fill", "#eee")
      .style("stroke", "#ffa500")
      .style("stroke-width", 2);

    function onDragStart(d) {
      if (!d3.event.active) {
        simulation.alphaTarget(1).restart();
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

    const nodeImage = svg
      .select("g")
      .selectAll("image")
      .data(nodes)
      .enter()
      .append("image")
      .attr("xlink:href", d => d.src)
      .attr("x", -25)
      .attr("y", -25)
      .attr("width", 50)
      .attr("height", 50)
      .attr("clip-path", "url(#avatar-clip)")
      .call(drag);
      nodeImage.on("mouseover", d => {
        nodeImage.style("opacity", o => {
          return isConnected(d, o) ? 1 : 0.3;
        });

        // nodeCircle.style("opacity", o => {
        //   return isConnected(d, o) ? 1 : 0.3;
        // });

        edgeLine.style("stroke-opacity", o => {
          return o.source === d || o.target === d ? 1 : 0.3;
        });
        edgeLine.style("stroke", o => {
          return o.source === d || o.target === d ? "#333" : "#000";
        });
      })
      .on("mouseout", d => {
        nodeImage.style("opacity", 1);
        // nodeCircle.style("opacity", 1);
        edgeLine.style("stroke-opacity", 1);
        edgeLine.style("stroke", "#000");
      });
    nodeImage.append("title").text(d => d.name);

    // const nodeText = svg
    //   .select("g")
    //   .selectAll("text")
    //   .data(nodes)
    //   .enter()
    //   .append("text")
    //   .attr("dy", ".3em")
    //   .attr("text-anchor", "middle")
    //   .style("fill", "#000")
    //   .text(d => d.name);

    const edgeText = svg
      .select("g")
      .selectAll(".edgelabel")
      .data(edges)
      .enter()
      .append("text")
      .attr("class", "edgelabel")
      .attr("dx", 80)
      .attr("dy", 0);
    edgeText
      .append("textPath")
      .attr("xlink:href", (d, i) => {
        return "#edgepath" + i;
      })
      .text(d => {
        return d && d.tag;
      });

    const defs = g.append("defs");
    const arrowHead = defs
      .append("marker")
      .attr("id", "arrow")
      .attr("markerUnits", "userSpaceOnUse")
      .attr("class", "arrowhead")
      .attr("markerWidth", 20)
      .attr("markerHeight", 20)
      .attr("viewBox", "0 0 20 20")
      .attr("refX", 9.3 + 30)
      .attr("refY", 5)
      .attr("orient", "auto");
    arrowHead
      .append("path")
      .attr("d", "M0,0 L0,10 L10,5 z")
      .attr("fill", "#f00");

    const round = defs
      .append("clipPath")
      .attr("id", "avatar-clip")
      .append("circle")
      .attr("cx", 0)
      .attr("cy", 0)
      .attr("r", 25);

    simulation.on("tick", () => {
      nodeCircle.attr("transform", d => {
        return d && "translate(" + d.x + "," + d.y + ")";
      });
      nodeImage.attr("transform", d => {
        return d && "translate(" + d.x + "," + d.y + ")";
      });

      // nodeText.attr("transform", d => {
      //   return "translate(" + d.x + "," + d.y + ")";
      // });
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
    });
  }

  render() {
    return <div id="container"></div>;
  }
}

export default App;
