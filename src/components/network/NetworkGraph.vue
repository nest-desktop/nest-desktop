<template>
  <div class="networkGraph" ref="networkGraph">
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

    <span style="position:absolute;right:0" class="ma-1" v-if="state.graph">
      <v-btn
        :color="state.graph.state.centerFocus ? 'amber' : 'grey'"
        @click="() => state.graph.toggleCenterFocus()"
        icon
        small
        tile
        title="Autofocus network graph"
      >
        <v-icon
          v-if="state.graph.state.centerFocus"
          v-text="'mdi-image-filter-center-focus'"
        />
        <v-icon
          v-if="!state.graph.state.centerFocus"
          v-text="'mdi-image-filter-center-focus-strong-outline'"
        />
      </v-btn>
    </span>

    <svg id="networkGraph" width="800" height="600">
      <g class="marker">
        <defs
          :key="'defs' + connection.idx"
          v-for="connection of state.network.connections"
        >
          <marker
            :id="'generic' + connection.idx"
            markerHeight="8"
            markerWidth="8"
            orient="auto"
            refX="6"
            refY="4"
          >
            <path
              :style="{ stroke: connection.source.view.color }"
              d="M2,2L6,4L2,6"
              fill="transparent"
            />
          </marker>

          <marker
            :id="'exc' + connection.idx"
            markerHeight="8"
            markerWidth="8"
            orient="auto"
            refX="6"
            refY="4"
          >
            <path
              :style="{ stroke: connection.source.view.color }"
              d="M2,2L6,4L2,6L2,2L6,4"
              fill="white"
            />
          </marker>

          <marker
            :id="'inh' + connection.idx"
            markerHeight="8"
            markerWidth="8"
            orient="auto"
            refX="6"
            refY="4"
          >
            <circle
              :style="{ stroke: connection.source.view.color }"
              fill="white"
              r="2"
              transform="translate(4,4)"
            />
          </marker>
        </defs>
      </g>

      <rect id="background" fill="white" />

      <g id="network">
        <g>
          <path
            class="dragline"
            d="M0,0L0,0"
            stroke-linecap="round"
            fill="none"
            style="stroke-width:4px"
          />
        </g>

        <g id="connections" />
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

import core from '@/core/index';
import { NetworkGraph } from '@/core/network/networkGraph';

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
    const state = reactive({
      network: core.app.project.network,
      graph: undefined,
      nodeMenu: {
        node: undefined,
        position: { x: 0, y: 0 },
        show: false,
      },
      connectionMenu: {
        connection: undefined,
        position: { x: 0, y: 0 },
        show: false,
      },
    });

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

    const setMenuTrigger = () => {
      d3.selectAll('g.node').each((node, idx, elements) => {
        d3.select(elements[idx]).on('contextmenu', e => {
          showNodeMenu(e, node);
        });
      });

      d3.selectAll('path.connection').each((connection, idx, elements) => {
        d3.select(elements[idx]).on('contextmenu', e => {
          showConnectionMenu(e, connection);
        });
      });
    };

    const update = () => {
      state.network = core.app.project.network;
      state.graph.network = state.network;
      state.graph.reset();
      state.graph.update();
      state.graph.resize();
      setMenuTrigger();
    };

    const resize = () => {
      if (refs.networkGraph) {
        const elem = refs.networkGraph;
        state.graph.resize(elem.clientWidth, elem.clientHeight);
      }
    };

    onMounted(() => {
      state.graph = new NetworkGraph('svg#networkGraph');
      resize();
      update();
      window.addEventListener('resize', resize);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', resize);
    });

    watch(
      () => props.projectId + state.network.hash,
      () => update()
    );

    return { state };
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

.connection {
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
