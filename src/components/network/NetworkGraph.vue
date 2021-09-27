<template>
  <div class="networkGraph" ref="networkGraph">
    <ConnectionMenu
      :connection="state.connectionMenu.connection"
      :position="state.connectionMenu.position"
      v-if="state.connectionMenu.show"
    />

    <NodeMenu
      :node="state.nodeMenu.node"
      :position="state.nodeMenu.position"
      v-if="state.nodeMenu.show"
    />

    <NetworkGraphToolbar
      :graph="state.graph"
      :network="state.network"
      class="no-print"
    />

    <svg id="networkGraph" width="800" height="600">
      <g class="marker" v-if="state.network">
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
              :style="{
                fill: connection.source.view.color,
                stroke: connection.source.view.color,
              }"
              d="M2,2L6,4L2,6L2,2L6,4"
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
              :style="{
                fill: connection.source.view.color,
                stroke: connection.source.view.color,
              }"
              r="2"
              transform="translate(4,4)"
            />
          </marker>
        </defs>
      </g>

      <rect id="background" fill="white" />
      <!-- <g class="grid no-print" /> -->

      <g id="network" ref="network">
        <g class="grid no-print" />
        <g v-if="state.graph">
          <path
            :style="{ strokeWidth: state.graph.strokeWidth }"
            class="dragline"
            d="M0,0L0,0"
            stroke-linecap="round"
            fill="none"
          />
        </g>

        <g id="connections" />
        <g id="nodes" />
        <g id="panel" />
      </g>
    </svg>

    <v-snackbar :timeout="-1" v-model="state.snackbar.show">
      {{ state.snackbar.text }}

      <template #action="{ attrs }">
        <v-btn
          @click="state.snackbar.show = false"
          outlined
          small
          v-bind="attrs"
          v-if="state.snackbar.actions.length === 0"
        >
          Close
        </v-btn>
        <template v-if="state.snackbar.actions.length > 0">
          <v-btn
            :key="actionIdx"
            @click="action.onClick"
            outlined
            small
            v-bind="attrs"
            v-for="(action, actionIdx) in state.snackbar.actions"
            v-text="action.text"
          />
        </template>
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  ref,
  reactive,
  onBeforeUnmount,
  onMounted,
  watch,
} from '@vue/composition-api';
import * as d3 from 'd3';

import { Connection } from '@/core/connection/connection';
import { NetworkGraph } from '@/core/network/networkGraph';
import { Node } from '@/core/node/node';
import core from '@/core';

import ConnectionMenu from '@/components/connection/ConnectionMenu.vue';
import NodeMenu from '@/components/node/NodeMenu.vue';
import NetworkGraphToolbar from '@/components/network/NetworkGraphToolbar.vue';

export default Vue.extend({
  name: 'NetworkGraph',
  components: {
    ConnectionMenu,
    NetworkGraphToolbar,
    NodeMenu,
  },
  props: {
    networkHash: String,
  },
  setup(props) {
    const networkGraph = ref(null);
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
      snackbar: {
        actions: [],
        show: false,
        text: '',
      },
    });

    /**
     * Show Menu for connection.
     */
    const showConnectionMenu = (e: MouseEvent, connection: Connection) => {
      e.preventDefault();
      state.connectionMenu.show = false;
      state.connectionMenu.connection = connection;
      state.connectionMenu.position.x = e.clientX;
      state.connectionMenu.position.y = e.clientY;
      setTimeout(() => {
        state.connectionMenu.show = true;
      }, 1);
    };

    /**
     * Show Menu for node.
     */
    const showNodeMenu = (e: MouseEvent, node: Node) => {
      e.preventDefault();
      state.nodeMenu.show = false;
      state.nodeMenu.node = node;
      state.nodeMenu.position.x = e.clientX;
      state.nodeMenu.position.y = e.clientY;
      setTimeout(() => {
        state.nodeMenu.show = true;
      }, 1);
    };

    /**
     * Tigger Menu for node or connection.
     */
    const setMenuTrigger = () => {
      d3.selectAll('g.node').each(
        (node: Node, idx: number, elements: any[]) => {
          d3.select(elements[idx]).on('contextmenu', e => {
            showNodeMenu(e, node);
          });
        }
      );

      d3.selectAll('g.connection').each(
        (connection: Connection, idx: number, elements: any[]) => {
          d3.select(elements[idx]).on('contextmenu', e => {
            showConnectionMenu(e, connection);
          });
        }
      );
    };

    /**
     * Show snackbar
     */
    const showSnackbar = (text: string, actions: any[] = []) => {
      state.snackbar.text = text;
      state.snackbar.actions = actions;
      state.snackbar.show = true;
    };

    const hasAllNodeTypes = () => {
      const types: string[] = state.network.nodes.map(
        node => node.model.elementType
      );
      return (
        types.includes('stimulator') &&
        types.includes('neuron') &&
        types.includes('recorder')
      );
    };

    /**
     * Show help in snackbar.
     */
    const showHelp = () => {
      state.snackbar.show = false;
      if (!state.network.project.config.showHelp) {
        return;
      }
      if (state.network.nodes.length === 0) {
        showSnackbar('Create nodes (use right mouse button).');
      } else if (!hasAllNodeTypes()) {
        showSnackbar('Add at least a stimulator, a neuron and a recorder.');
      } else if (state.network.connections.length < 2) {
        showSnackbar('Connect I/O-devices to neurons.');
      }
    };

    /**
     * Update network graph.
     */
    const update = () => {
      // console.log('Update network graph');
      state.network = core.app.project.network;
      state.graph.network = state.network;
      const elem: any = networkGraph.value['parentNode'];
      state.graph.reset();
      state.graph.resize(elem.clientWidth, elem.clientHeight);
      state.graph.init();
      state.graph.update();
      state.graph.transform();
      setMenuTrigger();
      showHelp();
    };

    /**
     * Resize network graph.
     */
    const onResize = () => {
      const elem: any = networkGraph.value['parentNode'];
      if (elem) {
        state.graph.resize(elem.clientWidth, elem.clientHeight);
        state.graph.transform();
      }
    };

    onMounted(() => {
      state.graph = new NetworkGraph('svg#networkGraph');
      update();
      window.addEventListener('resize', onResize);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', onResize);
    });

    watch(
      () => props.networkHash,
      () => update()
    );

    watch(
      () => [
        state.network.view.selectedNode,
        state.network.view.selectedConnection,
      ],
      () => {
        // When (un-)select node or connection button outside of the network graph.
        state.graph.update();
        state.graph.transform();
      }
    );

    return { state, networkGraph };
  },
});
</script>

<style>
.networkGraph {
  display: inline-block;
  position: relative;
  width: 100%;
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
