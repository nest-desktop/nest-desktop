<template>
  <div class="svg-container" ref="networkGraph">
    <svg id="networkGraph" width="800" height="600">
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

      <rect id="background" fill="white"></rect>
      <g id="network">
        <g id="links" />
        <g id="nodes" />
      </g>
    </svg>
  </div>
</template>

<script>
import Vue from "vue";
import { onBeforeUnmount, onMounted, watch } from "@vue/composition-api";
import * as d3 from "d3";
import core from "@/core/index";
import { getPoints } from "@/core/node/nodeGraph";

export default Vue.extend({
  name: "NetworkGraph",
  props: {
    projectId: String
  },
  setup(props, { root, refs }) {
    // global variables
    let width = 800,
      height = 600;
    const strokeWidth = 4;

    function zoomed({ transform }) {
      d3.select("g#network").attr("transform", transform);
    }

    function dragstarted(event, d) {
      d3.select(this)
        .classed("active", true)
        .raise();
    }

    function dragged(event, d) {
      d.view.position.x = event.x;
      d.view.position.y = event.y;
      update();
    }

    function dragended(event, d) {
      d3.select(this).classed("active", false);
      // d3.selectAll("g.node").sort((a,b) => d3.ascending(a.idx, b.idx))
    }

    function drawNode(node) {
      const radius = 20;
      const elem = d3.select(this);

      elem.selectAll("*").remove();
      if (
        node.model.elementType == "neuron" &&
        node.view.weight == "inhibitory"
      ) {
        elem
          .append("circle")
          .attr("class", "shape")
          .attr("r", radius);
      } else {
        elem
          .append("polygon")
          .attr("class", "shape")
          .attr("points", getPoints(node, radius));
      }

      elem
        .selectAll(".shape")
        .style("stroke", node.view.color)
        .style("stroke-width", 4);

      elem
        .append("text")
        .attr("dy", () =>
          node.model.elementType == "neuron" && node.view.weight == "inhibitory"
            ? "0.4em"
            : "0.7em"
        )
        .text(() => node.view.label);
    }

    const init = () => {
      const network = core.app.project.network;

      d3.select("rect#background").call(
        d3
          .zoom()
          .extent([
            [0, 0],
            [width, height]
          ])
          .scaleExtent([0.5, 2])
          .on("zoom", zoomed)
      );

      const links = d3
        .select("g#links")
        .selectAll("path.link")
        .data(network.connections);

      links
        .enter()
        .append("path")
        .attr("class", "link")
        .attr("marker-end", "url(#exc)")
        .style("fill", "none")
        .style("stroke-width", strokeWidth)
        .merge(links)
        .style("opacity", 0);

      links.exit().remove();

      const nodes = d3
        .select("g#nodes")
        .selectAll("g.node")
        .data(network.nodes);

      nodes
        .enter()
        .append("g")
        .attr("class", "node")
        .attr("idx", d => d.idx)
        .call(
          d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended)
        )
        .merge(nodes)
        .style("opacity", 0)
        .each(drawNode);

      nodes.exit().remove();

      update();
      onResize();
    };

    const update = () => {
      d3.selectAll("g.node");

      d3.selectAll("g.node")
        .attr(
          "transform",
          d => "translate(" + d.view.position.x + "," + d.view.position.y + ")"
        )
        .transition()
        .delay(150)
        .style("opacity", 1);

      d3.selectAll("path.link")
        .attr("d", d => d.view.drawPath())
        .transition()
        .delay(300)
        .style("stroke", d => d.source.view.color)
        .style("opacity", 1);
    };

    const onResize = () => {
      if (refs.networkGraph) {
        width = refs.networkGraph.clientWidth;
        height = refs.networkGraph.clientHeight;

        d3.select("svg#networkGraph")
          .attr("width", width)
          .attr("height", height);

        d3.select("rect#background")
          .attr("width", width)
          .attr("height", height);
      }
    };

    onMounted(() => {
      init();
      window.addEventListener("resize", onResize);
    });

    onBeforeUnmount(() => {
      window.removeEventListener("resize", onResize);
    });

    watch(
      () => props.projectId,
      () => init()
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
  overflow: hidden;
}

.node .shape {
  fill: white;
  cursor: pointer;
}

.node text {
  pointer-events: none;
  font-size: 12px;
  text-anchor: middle;
}
</style>
