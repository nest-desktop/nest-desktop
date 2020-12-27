<template>
  <div class="svg-container" ref="networkGraph">
    <svg id="networkGraph">
      <defs>
        <marker
          id="exc"
          viewBox="0 0 10 10"
          refX="7.5"
          refY="5"
          markerUnits="strokeWidth"
          markerWidth="5"
          markerHeight="5"
          orient="auto"
        >
          <path d="M 0 1 L 10 5 L 0 9 z"></path>
        </marker>
        <marker
          id="inh"
          viewBox="0 0 5 5"
          refX="7.5"
          refY="2.5"
          markerWidth="5"
          markerHeight="5"
          orient="auto"
        >
          <circle r="2.5" transform="translate(2.5,2.5)"></circle>
        </marker>
      </defs>
    </svg>
  </div>
</template>

<script>
import Vue from "vue";
import { onMounted, watch } from "@vue/composition-api";
import * as d3 from "d3";
import core from "@/core/index";
import drawPath from "./drawPath";

export default Vue.extend({
  name: "NetworkGraph",
  props: {
    projectId: String
  },
  setup(props, { root, refs }) {
    onMounted(() => {
      update();
    });
    // set the dimensions and margins of the graph
    const margin = {
        top: 10,
        right: 30,
        bottom: 30,
        left: 40
      },
      width = 800 - margin.left - margin.right,
      height = 600 - margin.top - margin.bottom;

    const svg = d3
      .select("#networkGraph")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg
      .append("rect")
      .attr("class", "background")
      .attr("width", width)
      .attr("height", height)
      .style("fill", "white");

    // List the force we wanna apply on the network
    const simulation = d3
      .forceSimulation()
      .force("charge", d3.forceManyBody().strength(-1000))
      .force(
        "link",
        d3
          .forceLink()
          .id(d => d.idx)
          .distance(600)
      )
      .force("x", d3.forceX())
      .force("y", d3.forceY());

    const drag = simulation => {
      const dragstarted = function(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      };

      const dragged = function(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
      };

      const dragended = function(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      };

      return d3
        .drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
    };

    const update = () => {
      // Append the svg object to the body of the page

      const svg = d3.select("#networkGraph");

      const network = core.app.project.network;
      console.log(network);

      // Initialize links
      const links = svg
        .selectAll("path")
        .data(network.connections)
        .join("path")
        .attr("class", "link")
        .style("stroke-width", 5)
        .style("fill", "none")
        .attr("marker-end", "url(#exc)");

      // Initialize nodes
      const nodes = svg.selectAll("circle").data(network.nodes);

      nodes.join("circle")
        .attr("class", "node")
        .attr("r", 20)
        .style("fill", "white")
        .style("stroke", "black")
        .style("stroke-width", 5);

      nodes.exit().remove();

      simulation.on("tick", () => {
        d3.select("#networkGraph")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom);

        simulation.nodes(network.nodes);
        simulation.force("link").links(network.connections);
        simulation.force("center", d3.forceCenter(width / 2, height / 2));

        svg
          .select(".background")
          .attr("width", width)
          .attr("height", height);

        links
          .attr("x1", d => d.source.x)
          .attr("y1", d => d.source.y)
          .attr("x2", d => d.target.x)
          .attr("y2", d => d.target.y)
          .attr("d", drawPath)
          .style("stroke", "black");

        nodes
          .attr("cx", d => d.x)
          .attr("cy", d => d.y)
          .attr("r", d => 20);
      });
      simulation.alphaTarget(0.3).restart();
    };
    watch(
      () => props.projectId,
      () => update()
    );
  }
});
</script>

<style>
.svg-container {
  display: inline-block;
  position: relative;
  width: 100%;
  height: calc(100vh - 48px);
  vertical-align: top;
  overflow: hidden;
}
</style>
