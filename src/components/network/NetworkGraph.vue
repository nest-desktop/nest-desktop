<template>
  <div class="networkGraph" ref="networkGraph">
    <span style="position:absolute;right:0" class="ma-1">
      <v-btn
        :color="state.autofocus ? 'orange' : 'grey'"
        @click="toggleAutofocus"
        icon
        small
        tile
        title="Autofocus network graph"
      >
        <v-icon v-if="state.autofocus">mdi-image-filter-center-focus</v-icon>
        <v-icon v-if="!state.autofocus"
          >mdi-image-filter-center-focus-strong-outline</v-icon
        >
      </v-btn>
    </span>
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
import Vue from 'vue';
import {
  reactive,
  onBeforeUnmount,
  onMounted,
  watch,
} from '@vue/composition-api';
import * as d3 from 'd3';
import { getPoints } from '@/core/node/nodeGraph';

export default Vue.extend({
  name: 'NetworkGraph',
  props: {
    projectId: String,
    network: Object,
  },
  setup(props, { root, refs }) {
    // global variables
    let width = 800,
      height = 600;
    const strokeWidth = 4;
    const state = reactive({
      networkCenter: {
        x: 200,
        y: 100,
      },
      autofocus: true,
    });
    let resizing = false;
    let zoom;

    function zoomed({ transform }) {
      if (resizing) {
        d3.select('g#network')
          .transition()
          .duration(500)
          .attr('transform', transform);
      } else {
        d3.select('g#network').attr('transform', transform);
      }
    }

    function dragstarted(event, d) {
      d3.select(this)
        .classed('active', true)
        .raise();
    }

    function dragged(event, d) {
      d.view.position.x = event.x;
      d.view.position.y = event.y;
      update();
    }

    function dragended(event, d) {
      d3.select(this).classed('active', false);
      // d3.selectAll("g.node").sort((a,b) => d3.ascending(a.idx, b.idx))

      centering();
    }

    const centering = () => {
      const x = [];
      const y = [];
      props.network.nodes.forEach(node => {
        x.push(node.view.position.x);
        y.push(node.view.position.y);
      });
      state.networkCenter.x = (d3.min(x) + d3.max(x)) / 2;
      state.networkCenter.y = (d3.min(y) + d3.max(y)) / 2;

      resize();
    };

    function drawNode(node) {
      const radius = 20;
      const elem = d3.select(this);

      elem.selectAll('*').remove();
      if (
        node.model.elementType == 'neuron' &&
        node.view.weight == 'inhibitory'
      ) {
        elem
          .append('circle')
          .attr('class', 'shape')
          .attr('r', radius);
      } else {
        elem
          .append('polygon')
          .attr('class', 'shape')
          .attr('points', getPoints(node, radius));
      }

      elem
        .selectAll('.shape')
        .style('stroke', node.view.color)
        .style('stroke-width', strokeWidth);

      elem
        .append('text')
        .attr('dy', () =>
          node.model.elementType == 'neuron' && node.view.weight == 'inhibitory'
            ? '0.4em'
            : '0.7em'
        )
        .text(() => node.view.label);
    }

    const init = () => {
      zoom = d3
        .zoom()
        .extent([
          [0, 0],
          [width, height],
        ])
        .scaleExtent([0.5, 2])
        .on('zoom', zoomed);

      d3.select('rect#background')
        .on('mousedown', () => {
          // state.autofocus = false;
        })
        .call(zoom);

      const links = d3
        .select('g#links')
        .selectAll('path.link')
        .data(props.network.connections);

      links
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('marker-end', 'url(#exc)')
        .style('fill', 'none')
        .style('stroke-width', strokeWidth)
        .merge(links)
        .style('opacity', 0);

      links.exit().remove();

      const nodes = d3
        .select('g#nodes')
        .selectAll('g.node')
        .data(props.network.nodes);

      nodes
        .enter()
        .append('g')
        .attr('class', 'node')
        .attr('idx', d => d.idx)
        .call(
          d3
            .drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended)
        )
        .merge(nodes)
        .style('opacity', 0)
        .each(drawNode);

      nodes.exit().remove();

      update();
      centering();
    };

    const update = () => {
      d3.selectAll('g.node')
        .attr(
          'transform',
          d => 'translate(' + d.view.position.x + ',' + d.view.position.y + ')'
        )
        .transition()
        .delay(150)
        .style('opacity', 1);

      d3.selectAll('path.link')
        .attr('d', d => d.view.drawPath())
        .transition()
        .delay(300)
        .style('stroke', d => d.source.view.color)
        .style('opacity', 1);
    };

    const resize = () => {
      if (refs.networkGraph) {
        resizing = true;
        width = refs.networkGraph.clientWidth;
        height = refs.networkGraph.clientHeight;

        d3.select('svg#networkGraph')
          .attr('width', width)
          .attr('height', height);

        d3.select('rect#background')
          .attr('width', width)
          .attr('height', height);

        if (state.autofocus) {
          const x = width / 2 - state.networkCenter.x;
          const y = height / 2 - state.networkCenter.y;
          d3.select('rect#background').call(
            zoom.transform,
            d3.zoomIdentity.translate(x, y)
          );
        }
      }
      resizing = false;
    };

    const toggleAutofocus = () => {
      state.autofocus = !state.autofocus;
      resize();
    };

    onMounted(() => {
      init();
      window.addEventListener('resize', resize);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', resize);
    });

    watch(
      () => props.projectId,
      () => init()
    );

    return { state, toggleAutofocus };
  },
});
</script>

<style>
.networkGraph {
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
