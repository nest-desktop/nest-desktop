<template>
  <div class="networkGraph" ref="networkGraph" v-if="state.network">
    <NetworkConnectionMenu
      :connection="state.connectionMenu.connection"
      :position="state.connectionMenu.position"
      v-if="state.connectionMenu.show"
    />
    <NetworkNodeMenu
      :node="state.nodeMenu.node"
      :position="state.nodeMenu.position"
      v-if="state.nodeMenu.show"
    />

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
        <template v-for="connection of state.network.connections">
          <marker
            :id="'generic' + connection.idx"
            refY="4"
            refX="6"
            markerWidth="8"
            markerHeight="8"
            orient="auto"
          >
            <path
              :style="{ stroke: connection.source.view.color }"
              fill="transparent"
              d="M2,2L6,4L2,6"
            ></path>
          </marker>

          <marker
            :id="'exc' + connection.idx"
            refY="4"
            refX="6"
            markerWidth="8"
            markerHeight="8"
            orient="auto"
          >
            <path
              :style="{ stroke: connection.source.view.color }"
              fill="white"
              d="M2,2L6,4L2,6L2,2L6,4"
            ></path>
          </marker>

          <marker
            :id="'inh' + connection.idx"
            refY="4"
            refX="6"
            markerWidth="8"
            markerHeight="8"
            orient="auto"
          >
            <circle
              :style="{ stroke: connection.source.view.color }"
              fill="white"
              r="2"
              transform="translate(4,4)"
            ></circle>
          </marker>
        </template>
      </defs>

      <rect id="background" fill="white" />

      <g id="network">
        <g>
          <path
            class="dragline"
            d="M0,0L0,0"
            stroke-linecap="round"
            fill="none"
          ></path>
          <path
            class="dragline mask"
            d="M0,0L0,0"
            fill="none"
            style="stroke-width:4px"
          ></path>
        </g>
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
import { drawPath } from '@/core/connection/connectionGraph';
import NetworkConnectionMenu from '@/components/network/NetworkConnectionMenu.vue';
import NetworkNodeMenu from '@/components/network/NetworkNodeMenu.vue';

export default Vue.extend({
  name: 'NetworkGraph',
  components: {
    NetworkConnectionMenu,
    NetworkNodeMenu,
  },
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
      keyCode: null,
      nodeMenu: {
        node: null,
        position: { x: 0, y: 0 },
        show: false,
      },
      connectionMenu: {
        connection: null,
        position: { x: 0, y: 0 },
        show: false,
      },
      connectNode: false,
    });

    const getColors = () => state.network.view.colors;

    const zoom = d3
      .zoom()
      .extent([
        [0, 0],
        [width, height],
      ])
      .scaleExtent([0.5, 2])
      .on('zoom', ({ transform }) => {
        if (state.resizing) {
          d3.select('g#network')
            .transition()
            .attr('transform', transform);
        } else {
          d3.select('g#network').attr('transform', transform);
        }
      });

    const reset = () => {
      state.connectNode = false;
      d3.select('g#panel')
        .style('display', 'none')
        .style('opacity', '0');
      state.network.view.reset();
      resetDragLine();
      updateNetworkGraph();
    };

    const showConnectionMenu = (e, connection) => {
      e.preventDefault();
      state.connectionMenu.show = false;
      state.connectionMenu.connection = connection;
      state.connectionMenu.position.x = e.clientX;
      state.connectionMenu.position.y = e.clientY;
      setTimeout(() => {
        state.connectionMenu.show = true;
      }, 1);
    };

    const showNodeMenu = (e, node) => {
      e.preventDefault();
      state.nodeMenu.show = false;
      state.nodeMenu.node = node;
      state.nodeMenu.position.x = e.clientX;
      state.nodeMenu.position.y = e.clientY;
      setTimeout(() => {
        state.nodeMenu.show = true;
      }, 1);
    };

    const drawNode = (node, idx, elements) => {
      const radius = 20;
      const elem = d3.select(elements[idx]);
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

      elem.on('mouseover', () => {
        state.network.view.focusedNode = node;

        const selectedNode = state.network.view.selectedNode;
        if (selectedNode && state.connectNode) {
          const selector = d3.selectAll('svg#networkGraph');
          selector
            .selectAll('.dragline')
            .attr('d', () =>
              drawPath(selectedNode.view.position, node.view.position)
            )
            .style('opacity', 1);
          const color = selectedNode.view.color;
          selector.select('.mask').style('stroke', color);
        }
        updateNetworkGraph();
      });

      elem.on('mouseout', () => {
        state.network.view.resetFocus();
        updateNetworkGraph();
      });

      elem.on('contextmenu', e => {
        showNodeMenu(e, node);
      });

      elem.on('click', () => {
        if (state.network.view.selectedNode && state.connectNode) {
          state.network.connect(state.network.view.selectedNode, node);
          if (state.keyCode === 17) {
            return;
          }
          reset();
        } else if (state.network.view.selectedNode) {
          reset();
        } else {
          reset();
          state.network.view.selectedNode = node;
        }
        updateNetworkGraph();
      });
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

    const initPanel = () => {
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
            panel.style('fill', () => {
              const colors = getColors();
              return colors[state.network.nodes.length % colors.length];
            });
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
          .attr('fill', 'black')
          .attr('dx', Math.sin(Math.PI * f) * 28)
          .attr('dy', -Math.cos(Math.PI * f) * 28 + 5)
          .text(elementType.slice(0, 1).toUpperCase());
      });
    };

    const resetDragLine = () => {
      const selector = d3.selectAll('svg#networkGraph');
      selector.selectAll('.dragline').style('opacity', 0);
    };

    const dragLine = e => {
      const node = state.network.view.selectedNode;
      const source = node.view.position;
      const position = d3.pointer(e, d3.select('g#network').node());
      const target = {
        x: position[0],
        y: position[1],
      };
      const selector = d3.selectAll('svg#networkGraph');
      selector
        .selectAll('.dragline')
        .attr('d', () => drawPath(source, target, { isTargetMouse: true }))
        .style('opacity', 0.5);

      const color = node.view.color;
      selector.select('.mask').style('stroke', color);
    };

    const initBackground = () => {
      d3.select('rect#background')
        .on('mousemove', e => {
          state.network.view.resetFocus();
          const selectedNode = state.network.view.selectedNode;
          if (selectedNode) {
            state.connectNode = true;
            dragLine(e);
          }
        })
        .on('click', () => reset())
        .on('contextmenu', e => {
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
      // reset();

      const links = d3
        .select('g#links')
        .selectAll('path.link')
        .data(state.network.connections);

      links
        .enter()
        .append('path')
        .attr('class', 'link')
        .style('fill', 'none')
        .style('stroke-width', strokeWidth)
        .style('opacity', 0)
        .merge(links)
        .each((link, idx, elements) => {
          const elem = d3.select(elements[idx]);
          elem.on('contextmenu', e => {
            showConnectionMenu(e, link);
          });
        });

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
            .on('start', (event, d) => {
              state.dragging = true;
              d3.select(event.sourceEvent.srcElement.parentNode).classed(
                'active',
                true
              );
              // .raise();
            })
            .on('drag', (event, d) => {
              d.view.position.x = event.x;
              d.view.position.y = event.y;
              updateNetworkGraph();
            })
            .on('end', (event, d) => {
              state.dragging = false;
              d3.select(event.sourceEvent.srcElement.parentNode).classed(
                'active',
                false
              );
              // d3.selectAll("g.node").sort((a,b) => d3.ascending(a.idx, b.idx))
              centerNetworkGraph();
            })
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
            d => `translate(${d.view.position.x},${d.view.position.y})`
          )
          .style('opacity', 1);

        d3.selectAll('.shape')
          .style('stroke', d => d.view.color)
          .style('stroke-dasharray', d => (d.view.isSelected() ? '7.85' : ''));

        d3.selectAll('path.link')
          .style('stroke', d => d.source.view.color)
          .attr('marker-end', d => d.view.markerEnd())
          .transition()
          .attr('d', d => d.view.drawPath())
          .style('opacity', 1);
      } else {
        d3.selectAll('g.node')
          .attr(
            'transform',
            d =>
              `translate(${d.view.position.x},${d.view.position.y}) scale( ${
                d.view.isFocused() ? 1.2 : 1
              })`
          )
          .style('opacity', 1);

        d3.selectAll('.shape')
          .style('stroke', d => d.view.color)
          .style('stroke-dasharray', d => (d.view.isSelected() ? '7.85' : ''));

        d3.selectAll('path.link')
          .style('stroke', d => d.source.view.color)
          .attr('marker-end', d => d.view.markerEnd())
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

    onMounted(() => {
      d3.select('body')
        .on('keyup', event => {
          if (event.keyCode === 27) {
            reset();
          }
          state.keyCode = null;
        })
        .on('keydown', event => {
          state.keyCode = event.keyCode;
        });
      initPanel();
      initBackground();
      initNetworkGraph();
      updateNetworkGraph();
      centerNetworkGraph();
      window.addEventListener('resize', resize);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', resize);
    });

    const init = () => {
      reset();
      state.network = core.app.project.network;
      state.initialize = true;
      initNetworkGraph();
      updateNetworkGraph();
      centerNetworkGraph();
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

.link {
  cursor: pointer;
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

.dragline {
  pointer-events: none;
}
</style>
