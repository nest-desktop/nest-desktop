<template>
  <div class="networkGraph" ref="networkGraph" v-if="state.network">
    <span style="position:absolute;right:0" class="ma-1">
      <v-btn
        :color="state.autofocus ? 'amber' : 'grey'"
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
          <path d="M 0 1 L 10 5 L 0 9 z" />
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
          <circle r="2.5" transform="translate(2.5,2.5)" />
        </marker>
      </defs>

      <rect id="background" fill="white" />

      <g id="network">
        <g id="links" />
        <g id="nodes" />
        <g id="panel">
          <!-- <g
          class="tooltip"
          style="visibility:hidden;"
          transform="translate(0, -45)"
          >
          <rect
          fill-opacity="0.75"
          fill="white"
          height="12"
          transform="translate(-25,-10)"
          width="50"
          />
          <text class="label" />
        </g> -->
        </g>
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
import core from '@/core/index';

export default Vue.extend({
  name: 'NetworkGraph',
  props: {
    projectId: String,
  },
  setup(props, { root, refs }) {
    // global variables
    let width = 800,
      height = 600;
    const strokeWidth = 4;
    const state = reactive({
      network: core.app.project.network,
      panelPosition: { x: 0, y: 0 },
      networkCenter: {
        x: 200,
        y: 100,
      },
      autofocus: true,
      initialize: true,
      resizing: false,
    });

    const getColors = () => state.network.view.colors;

    const zoom = d3
      .zoom()
      .extent([
        [0, 0],
        [width, height],
      ])
      .scaleExtent([0.5, 2])
      .on('zoom', zoomed);

    function zoomed({ transform }) {
      if (state.resizing) {
        d3.select('g#network')
          .transition()
          .attr('transform', transform);
      } else {
        d3.select('g#network').attr('transform', transform);
      }
    }

    function dragstarted(event, d) {
      state.dragging = true;
      d3.select(this).classed('active', true);
      // .raise();
    }

    function dragged(event, d) {
      d.view.position.x = event.x;
      d.view.position.y = event.y;
      updateNetworkGraph();
    }

    function dragended(event, d) {
      state.dragging = false;
      d3.select(this).classed('active', false);
      // d3.selectAll("g.node").sort((a,b) => d3.ascending(a.idx, b.idx))
      centerNetworkGraph();
    }

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

      elem.on('click', () => {
        state.network.view.selectedNode = node;
      });
    }

    const reset = () => {
      d3.select('g#panel')
        .style('display', 'none')
        .style('opacity', '0');
    };

    const createNode = view => {
      // console.log('Create node')
      const defaultModels = {
        neuron: 'iaf_psc_alpha',
        recorder: 'voltmeter',
        stimulator: 'dc_generator',
      };
      const node = {
        model: defaultModels[view.elementType],
        view,
      };
      state.network.addNode(node);
      if (view.elementType === 'recorder') {
        core.app.project.activityGraph.init();
      }
      state.network.networkChanges();
      initNetworkGraph();
      updateNetworkGraph();
      centerNetworkGraph();
    };

    const initGraph = () => {
      // console.log('Init graph');

      const selectPanel = d3.select('g#panel');
      selectPanel.style('display', 'none');
      selectPanel
        .append('circle')
        .attr('class', 'select')
        .attr('fill', 'white')
        .attr('fill-opacity', '0.8')
        .attr('r', 16)
        .on('click', () => {
          reset();
        })
        .on('contextmenu', e => {
          e.preventDefault();
          reset();
        });

      const arcFrame = d3
        .arc()
        .innerRadius(16)
        .outerRadius(40);

      const elementTypes = ['recorder', 'neuron', 'stimulator'];
      elementTypes.forEach((elementType, i) => {
        const panel = selectPanel
          .append('path')
          .attr('class', 'select ' + elementType)
          .datum({
            startAngle: (Math.PI * i * 2) / 3,
            endAngle: (Math.PI * (i + 1) * 2) / 3,
          })
          .style('fill', 'white')
          .attr('fill-opacity', '0.8')
          .style('cursor', 'pointer')
          .style('stroke', () => {
            const colors = getColors();
            return colors[state.network.nodes.length % colors.length];
          })
          .style('stroke-width', 3.5)
          .attr('d', arcFrame)
          .on('mouseover', () => {
            // tooltip
            //   .style('visibility', 'visible')
            //   .select('.label')
            //   .text(elementType);
            if (
              !state.network.view.selectedNode ||
              elementType !== 'stimulator'
            ) {
              panel.style('fill', () => {
                const colors = getColors();
                return colors[state.network.nodes.length % colors.length];
              });
            }
          })
          .on('mouseout', () => {
            // tooltip
            //   .style('visibility', 'hidden')
            //   .select('.label')
            //   .text('');
            panel.style('fill', 'white');
          })
          .on('mouseup', () => {
            reset();
            const view = {
              elementType,
              position: JSON.parse(JSON.stringify(state.panelPosition)),
            };
            createNode(view);
          });

        const f = (i * 2) / 3 + 1 / 3;
        selectPanel
          .append('text')
          .attr('class', 'select label')
          .style('font-size', '11px')
          .style('text-anchor', 'middle')
          .style('pointer-events', 'none')
          .attr(
            'fill',
            state.network.view.selectedNode && elementType === 'stimulator'
              ? '#cccccc'
              : 'black'
          )
          .attr('dx', Math.sin(Math.PI * f) * 28)
          .attr('dy', -Math.cos(Math.PI * f) * 28 + 5)
          .text(elementType.slice(0, 1).toUpperCase());
      });

      d3.select('rect#background')
        .on('mousemove', e => {
          // console.log(event);
          state.network.view.resetFocus();
          const selectedNode = state.network.view.selectedNode;
          if (selectedNode) {
            const target = {
              x: e.offsetX,
              y: e.offsetY,
            };
            const color = selectedNode.view.color;
            // state._networkGraphService.dragLine(
            //   selectedNode.view.position,
            //   target,
            //   color,
            //   true
            // );
          }
        })
        .on('click', () => reset())
        .on('contextmenu', function(e) {
          // console.log(event);
          e.preventDefault();

          // if (
          //   state.network.view.selectedNode ||
          //   state.network.view.selectedConnection
          // ) {
          //   return;
          // }
          const position = d3.pointer(e, d3.select('g#network').node());
          state.panelPosition.x = position[0];
          state.panelPosition.y = position[1];
          d3.select('g#panel')
            .selectAll('path')
            .style('stroke', () => {
              const colors = getColors();
              return colors[state.network.nodes.length % colors.length];
            });
          d3.select('g#panel')
            .style('display', 'block')
            .attr(
              'transform',
              `translate(${state.panelPosition.x},${state.panelPosition.y})`
            )
            .style('opacity', '0.8');

          // const tooltip = selectPanel.select('.tooltip');
          // var tooltip = select.append('svg:text')
          //   .attr('class', 'tooltip')
          //   .attr('transform', 'translate(0, -45)')
          //   .style('visibility', 'hidden');
        })
        .call(zoom);
    };

    const initNetworkGraph = () => {
      // console.log('Init network graph');
      reset();

      const links = d3
        .select('g#links')
        .selectAll('path.link')
        .data(state.network.connections);

      links
        .enter()
        .append('path')
        .attr('class', 'link')
        .attr('marker-end', 'url(#exc)')
        .style('fill', 'none')
        .style('stroke-width', strokeWidth)
        .style('opacity', 0)
        .merge(links);

      links.exit().remove();

      const nodes = d3
        .select('g#nodes')
        .selectAll('g.node')
        .data(state.network.nodes);

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
        .style('opacity', 0)
        .merge(nodes)
        .each(drawNode);

      nodes.exit().remove();
    };

    const updateNetworkGraph = () => {
      // console.log('Update network graph');
      if (state.initialize) {
        d3.selectAll('g.node')
          .transition()
          .attr(
            'transform',
            d =>
              'translate(' + d.view.position.x + ',' + d.view.position.y + ')'
          )
          .style('opacity', 1);

        d3.selectAll('.shape').style('stroke', d => d.view.color);

        d3.selectAll('path.link')
          .style('stroke', d => d.source.view.color)
          .transition()
          .attr('d', d => d.view.drawPath())
          .style('opacity', 1);
      } else {
        d3.selectAll('g.node')
          .attr(
            'transform',
            d =>
              'translate(' + d.view.position.x + ',' + d.view.position.y + ')'
          )
          .style('opacity', 1);

        d3.selectAll('.shape').style('stroke', d => d.view.color);

        d3.selectAll('path.link')
          .style('stroke', d => d.source.view.color)
          .attr('d', d => d.view.drawPath())
          .style('opacity', 1);
      }
      state.initialize = false;
    };

    const centerNetworkGraph = () => {
      const x = [];
      const y = [];
      state.network.nodes.forEach(node => {
        x.push(node.view.position.x);
        y.push(node.view.position.y);
      });
      state.networkCenter.x = (d3.min(x) + d3.max(x)) / 2;
      state.networkCenter.y = (d3.min(y) + d3.max(y)) / 2;

      resize();
    };

    const resize = () => {
      if (refs.networkGraph) {
        state.resizing = true;
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
      state.resizing = false;
    };

    const toggleAutofocus = () => {
      state.autofocus = !state.autofocus;
      resize();
    };

    onMounted(() => {
      initGraph();
      initNetworkGraph();
      updateNetworkGraph();
      centerNetworkGraph();
      window.addEventListener('resize', resize);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', resize);
    });

    const init = () => {
      state.network = core.app.project.network;
      state.initialize = true;
      initNetworkGraph();
      updateNetworkGraph();
      centerNetworkGraph();
    };

    watch(
      () => props.projectId,
      () => init()
    );

    watch(
      () => state.network.hash,
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
