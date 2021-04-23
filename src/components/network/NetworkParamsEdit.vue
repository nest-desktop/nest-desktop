<template>
  <div class="networkParamEdit" v-if="state.network">
    <NetworkNodeMenu
      :node="state.nodeMenu.node"
      :position="state.nodeMenu.position"
      v-if="state.nodeMenu.show"
    />

    <NetworkConnectionMenu
      :connection="state.connectionMenu.connection"
      :position="state.connectionMenu.position"
      v-if="state.connectionMenu.show"
    />

    <v-select
      :items="state.items"
      dense
      placeholder="Filter"
      hide-details
      multiple
      small
      deletable-chips
      small-chips
      v-model="state.filtered"
    >
      <template v-slot:prepend-item>
        <v-list-item ripple @click="toggle">
          <v-list-item-action>
            <v-icon
              :color="state.filtered.length > 0 ? 'indigo darken-4' : ''"
              v-text="icon()"
            />
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="'Select All'" />
          </v-list-item-content>
        </v-list-item>
        <v-divider class="mt-2"></v-divider>
      </template>
    </v-select>

    <v-row
      class="mr-2"
      no-gutters
      style="overflow-y:auto; height: calc(100vh - 76px);"
    >
      <v-col>
        <draggable v-model="state.network.nodes" handle=".handle">
          <transition-group>
            <span :key="'node' + node.idx" v-for="node of state.network.nodes">
              <v-card class="mb-1" flat tile v-if="showNode(node)">
                <v-sheet :color="node.view.color" class="handle">
                  <v-row @contextmenu="e => showNodeMenu(e, node)" no-gutters>
                    <v-col cols="3">
                      <v-btn
                        @click="() => node.view.select()"
                        block
                        dark
                        height="40"
                        text
                        tile
                        v-text="node.view.label"
                      />
                    </v-col>
                    <v-col cols="9">
                      <NodeModelSelect :node="node" />
                    </v-col>
                  </v-row>
                </v-sheet>

                <v-card-text
                  :style="{
                    borderLeft: `4px solid ${node.view.color}`,
                  }"
                  class="pa-0"
                >
                  <div v-if="!node.model.isRecorder()">
                    <NodePosition
                      :node="node"
                      v-if="node.spatial.hasPositions()"
                    />
                    <ParameterEdit
                      :color="node.view.color"
                      :options="{
                        input: 'valueSlider',
                        label: 'population size',
                        max: 1000,
                        value: 1,
                      }"
                      :value.sync="node.size"
                      @update:value="paramChange()"
                      v-else
                    />
                  </div>

                  <template v-if="node.model.existing === 'multimeter'">
                    <v-row no-gutters>
                      <v-col>
                        <v-select
                          :color="node.view.color"
                          :items="node.recordables"
                          @change="paramChange()"
                          attach
                          class="ma-0 pt-4 px-1"
                          dense
                          hide-details
                          label="Record from"
                          multiple
                          persistent-hint
                          v-model="node.recordFrom"
                        />
                      </v-col>
                    </v-row>
                  </template>

                  <ParameterEdit
                    :color="node.view.color"
                    :key="param.id"
                    :param="param"
                    :value.sync="param.value"
                    @update:value="paramChange()"
                    v-for="param of node.filteredParams"
                  />
                </v-card-text>
              </v-card>
            </span>
          </transition-group>
        </draggable>

        <draggable v-model="state.network.connections" handle=".handle">
          <transition-group>
            <v-card
              :key="'connection' + connection.idx"
              class="mb-1"
              flat
              tile
              v-for="connection of state.network.connections"
              v-show="showConnection(connection)"
            >
              <v-row
                @contextmenu="e => showConnectionMenu(e, connection)"
                no-gutters
              >
                <v-col cols="3" class="py-0" style="text-align:center">
                  <v-btn
                    :color="connection.source.view.color"
                    @click="() => connection.source.view.select()"
                    block
                    dark
                    depressed
                    height="40"
                    tile
                    v-text="connection.source.view.label"
                  />
                </v-col>
                <v-col cols="4">
                  <v-btn
                    @click="() => connection.view.select()"
                    block
                    color="white"
                    depressed
                    height="40"
                    tile
                  >
                    <v-icon v-text="'mdi-arrow-right-bold-outline'" />
                  </v-btn>
                </v-col>
                <v-col cols="3" class="py-0" style="text-align:center">
                  <v-btn
                    :color="connection.target.view.color"
                    @click="() => connection.target.view.select()"
                    block
                    dark
                    depressed
                    height="40"
                    tile
                    v-text="connection.target.view.label"
                  />
                </v-col>
                <v-col cols="2">
                  <v-btn
                    :color="connection.target.view.color"
                    block
                    class="handle"
                    dark
                    depressed
                    tile
                    height="40"
                  >
                    <v-icon v-text="'mdi-drag-vertical'" />
                  </v-btn>
                </v-col>
              </v-row>

              <v-card-text
                :style="{
                  borderLeft: `4px solid ${connection.source.view.color}`,
                  borderRight: `4px solid ${connection.target.view.color}`,
                }"
                class="pa-0 pt-2 ma-0"
              >
                <v-select
                  :items="connection.config.rules"
                  @change="paramChange()"
                  dense
                  hide-details
                  item-value="value"
                  item-text="label"
                  label="Connection rule"
                  class="ml-1 px-1"
                  v-model="connection.rule"
                />

                <ParameterEdit
                  :color="connection.source.view.color"
                  :key="'conn' + connection.idx + '-' + param.id"
                  :options="param"
                  :value.sync="param.value"
                  @update:value="paramChange()"
                  v-for="param in connection.filteredParams"
                />

                <ParameterEdit
                  :color="connection.source.view.color"
                  :key="'syn' + connection.idx + '-' + param.id"
                  :param="param"
                  :value.sync="param.value"
                  @update:value="paramChange()"
                  v-for="param in connection.synapse.filteredParams"
                />
              </v-card-text>
            </v-card>
          </transition-group>
        </draggable>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive, watch, onMounted } from '@vue/composition-api';
import draggable from 'vuedraggable';

import { Connection } from '@/core/connection/connection';
import { Network } from '@/core/network/network';
import { Node } from '@/core/node/node';
import core from '@/core';
import NetworkConnectionMenu from '@/components/network/NetworkConnectionMenu.vue';
import NetworkNodeMenu from '@/components/network/NetworkNodeMenu.vue';
import NodeModelSelect from '@/components/network/NodeModelSelect.vue';
import NodePosition from '@/components/network/NodePosition.vue';
import ParameterEdit from '@/components/parameter/ParameterEdit.vue';

export default Vue.extend({
  name: 'NetworkParamsEdit',
  components: {
    draggable,
    NetworkConnectionMenu,
    NetworkNodeMenu,
    NodeModelSelect,
    NodePosition,
    ParameterEdit,
  },
  props: {
    projectId: String,
  },
  setup(props) {
    const state = reactive({
      displayNodes: [],
      displayConnections: [],
      connectionMenu: {
        connection: undefined as Connection | undefined,
        position: {
          x: 0,
          y: 0,
        },
        show: false,
      },
      elementType: 0,
      network: core.app.project.network as Network,
      nodeMenu: {
        node: undefined as Node | undefined,
        position: {
          x: 0,
          y: 0,
        },
        show: false,
      },
      items: ['neuron', 'stimulator', 'recorder', 'nodes', 'connections'],
      filtered: ['neuron', 'stimulator', 'recorder', 'nodes', 'connections'],
    });

    /**
     * Show node in list.
     */
    const showNode = (node: Node) => {
      if (
        state.network.view.selectedConnection ||
        state.network.view.selectedNode
      ) {
        return state.network.view.isNodeSelected(node);
      } else if (state.elementType === 4) {
        return node.view.visible;
      } else {
        // const elementTypes: string[] = ['', 'neuron', 'stimulator', 'recorder'];
        // if (state.elementType === 0) return true;
        // return elementTypes[state.elementType] === node.model.elementType;
        return (
          state.filtered.includes(node.model.elementType) &&
          state.filtered.includes('nodes')
        );
      }
    };

    /**
     * Update display for nodes.
     */
    const nodeDisplayChange = () => {
      state.network.nodes.forEach(
        (node: Node) =>
          (node.view.visible = state.displayNodes.includes(node.idx))
      );
    };

    /**
     * Show node menu.
     */
    const showNodeMenu = function(e: MouseEvent, node: Node) {
      // https://thewebdev.info/2020/08/13/vuetify%E2%80%8A-%E2%80%8Amenus-and-context-menu/
      e.preventDefault();
      state.nodeMenu.show = false;
      state.nodeMenu.node = node;
      state.nodeMenu.position.x = e.clientX;
      state.nodeMenu.position.y = e.clientY;
      this.$nextTick(() => {
        state.nodeMenu.show = true;
      });
    };

    /**
     * Show connection in list.
     */
    const showConnection = (connection: Connection) => {
      if (
        state.network.view.selectedConnection ||
        state.network.view.selectedNode
      ) {
        return state.network.view.isConnectionSelected(connection);
      } else if (state.elementType === 4) {
        return connection.view.visible;
      } else {
        // const elementTypes: string[] = ['', 'neuron', 'stimulator', 'recorder'];
        // if (state.elementType === 0) return true;
        // return (
        //   elementTypes[state.elementType] ===
        //   connection.source.model.elementType
        // );
        return (
          state.filtered.includes(connection.source.model.elementType) &&
          state.filtered.includes('connections')
        );
      }
    };

    /**
     * Show connection menu.
     */
    const showConnectionMenu = function(e: MouseEvent, connection: Connection) {
      // https://thewebdev.info/2020/08/13/vuetify%E2%80%8A-%E2%80%8Amenus-and-context-menu/
      e.preventDefault();
      state.connectionMenu.show = false;
      state.connectionMenu.connection = connection;
      state.connectionMenu.position.x = e.clientX;
      state.connectionMenu.position.y = e.clientY;
      this.$nextTick(() => {
        state.connectionMenu.show = true;
      });
    };

    /**
     * Update display for connections.
     */
    const connectionDisplayChange = () => {
      state.network.connections.forEach(
        (connection: Connection) =>
          (connection.view.visible = state.displayConnections.includes(
            connection.idx
          ))
      );
    };

    /**
     * Triggers when parameter is changed.
     */
    const paramChange = () => {
      state.network.networkChanges();
      // if (!state.network.project.simulation.running) {
      //   state.network.project.simulateAfterChange();
      // }
    };

    const update = () => {
      state.displayNodes = state.network.nodes
        .filter((node: Node) => node.view.visible)
        .map((node: Node) => node.idx);
      state.displayConnections = state.network.connections
        .filter((connection: Connection) => connection.view.visible)
        .map((connection: Connection) => connection.idx);
    };

    const icon = () => {
      if (state.filtered.length === state.items.length) return 'mdi-close-box';
      if (state.filtered.length > 0) return 'mdi-minus-box';
      return 'mdi-checkbox-blank-outline';
    };

    const toggle = () => {
      if (state.filtered.length === state.items.length) {
        state.filtered = [];
      } else {
        state.filtered = state.items.slice();
      }
    };

    onMounted(() => {
      update();
    });

    watch(
      () => [props.projectId, core.app.project.network.hash],
      () => {
        state.network = core.app.project.network as Network;
        update();
      }
    );

    return {
      connectionDisplayChange,
      icon,
      nodeDisplayChange,
      paramChange,
      showConnection,
      showConnectionMenu,
      showNode,
      showNodeMenu,
      state,
      toggle,
    };
  },
});
</script>
