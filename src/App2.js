import React from "react";
import * as d3 from "d3";
import tanImg from "./asset/image/tan.jpg";

function App() {
  const WIDTH = 1200;
  const HEIGHT = 800;
  const nodes = [{ id: 1, name: "炭治郎", src: tanImg }];
  const edges = [];

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
    .force("center", d3.forceCenter(WIDTH / 2, HEIGHT / 2))
    .force(
      "charge",
      d3
        .forceManyBody()
        .strength(-30)
        .distanceMax(800)
    );

    const svg = d3.select('#container')
    .append('svg')
    .attr('width',WIDTH)
    .attr('height', HEIGHT);

    const g = svg.append('g').attr('class', 'g_map')

    function update(){}

  return <div id="container"></div>;
}

export default App;
