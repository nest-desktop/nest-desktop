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

    <NetworkGraphToolbar
      :graph="state.graph"
      :network="state.network"
      class="no-print"
    />

    <transition name="fade">
      <div
        v-if="
          state.graph &&
            state.network.view.selectedNode &&
            !state.graph.state.dragging
        "
        :style="{
          position: 'absolute',
          top:
            state.graph.transform.y +
            state.network.view.selectedNode.view.position.y -
            14 +
            'px',
          left:
            state.graph.transform.x +
            state.network.view.selectedNode.view.position.x -
            18 +
            'px',
        }"
      >
        <div style="position:relative">
          <transition name="fade">
            <v-btn
              @click="enableConnection"
              icon
              small
              style="position:absolute; top:32px; left:32px"
              v-show="!state.graph.state.enableConnection"
            >
              <v-icon v-text="'mdi-plus'" />
            </v-btn>
          </transition>
          <!-- <v-btn
            @click="deleteNode"
            icon
            style="position:absolute; top:32px; left:-32px"
          >
            <v-icon v-text="'mdi-trash-can-outline'" />
          </v-btn> -->
        </div>
      </div>
    </transition>

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

      <g id="network" ref="network">
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

    <v-snackbar :timeout="-1" v-model="state.snackbar.show">
      {{ state.snackbar.text }}

      <template v-slot:action="{ attrs }">
        <v-btn
          @click="state.snackbar.show = false"
          text
          v-bind="attrs"
          v-if="state.snackbar.actions.length === 0"
        >
          Close
        </v-btn>
        <template v-if="state.snackbar.actions.length > 0">
          <v-btn
            :key="actionIdx"
            @click="action.onClick"
            text
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

import NetworkConnectionMenu from '@/components/network/NetworkConnectionMenu.vue';
import NetworkNodeMenu from '@/components/network/NetworkNodeMenu.vue';
import NetworkGraphToolbar from '@/components/network/NetworkGraphToolbar.vue';

export default Vue.extend({
  name: 'NetworkGraph',
  components: {
    NetworkConnectionMenu,
    NetworkGraphToolbar,
    NetworkNodeMenu,
  },
  props: {
    projectId: String,
  },
  setup(props, { refs }) {
    const state = reactive({
      network: core.app.project.network,
      nodePosition: {
        position: 'absolute',
        top: '0',
        left: '0',
      },
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
      if (state.network.nodes.length === 0) {
        showSnackbar('Click right mouse button to create nodes.');
      } else if (!hasAllNodeTypes()) {
        showSnackbar('Add at least a stimulator, a neuron and a recorder.');
      } else if (state.network.connections.length === 0) {
        showSnackbar('Click a node and then click other node to connect them.');
      } else {
        state.snackbar.show = false;
      }
    };

    const nodePosition = () => {
      const networkPos: any = d3.pointer(state.graph.transform);
      const nodePos: any = state.network.view.selectedNode.view.position;
      state.nodePosition.top = networkPos.y + nodePos.y - 14 + 'px';
      state.nodePosition.left = networkPos.x + nodePos.x - 18 + 'px';
    };

    /**
     * Remove node.
     */
    const deleteNode = () => {
      state.network.view.selectedNode.remove();
    };

    /**
     * Enable connection.
     */
    const enableConnection = (e: MouseEvent) => {
      state.graph.enableConnection(e);
    };

    /**
     * Update network graph.
     */
    const update = () => {
      // console.log('Update network graph');
      state.network = core.app.project.network;
      state.graph.network = state.network;
      state.graph.reset();
      state.graph.update();
      state.graph.resize();
      if (state.network.view.selectedNode) {
        nodePosition();
      }
      setMenuTrigger();
      showHelp();
    };

    /**
     * Resize network graph.
     */
    const resize = () => {
      const elem: any = refs.networkGraph['parentNode'];
      if (elem) {
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
      () => [props.projectId, state.network.hash],
      () => update()
    );

    return { deleteNode, enableConnection, nodePosition, state };
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
