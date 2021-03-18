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

    <v-banner
      class="elementType"
      height="28"
      max-height="28"
      width="327"
      single-line
      sticky
    >
      <v-btn-toggle dense group mandatory tile v-model="state.elementType">
        <v-btn small v-text="'All'" />
        <v-btn small v-text="'Neuron'" />
        <v-btn small v-text="'Stimulator'" />
        <v-btn small v-text="'Recorder'" />
        <v-menu :close-on-content-click="false" offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn small v-text="'Custom'" v-bind="attrs" v-on="on" />
          </template>
          <v-card>
            <v-card-text class="pa-0">
              <v-list dense>
                <v-list-item-group
                  @change="nodeDisplayChange"
                  active-class=""
                  multiple
                  v-model="state.displayNodes"
                >
                  <v-list-item
                    :color="node.view.color"
                    :key="'node' + node.idx"
                    v-for="node in state.network.nodes"
                  >
                    <template v-slot:default="{ active }">
                      <v-list-item-content style="padding: 4px">
                        <v-row no-gutters>
                          {{ node.view.label }}
                        </v-row>
                      </v-list-item-content>

                      <v-list-item-action style="margin: 4px 0">
                        <v-checkbox
                          :color="node.view.color"
                          :input-value="active"
                          hide-details
                        />
                      </v-list-item-action>
                    </template>
                  </v-list-item>
                </v-list-item-group>

                <v-list-item-group
                  @change="connectionDisplayChange"
                  active-class=""
                  multiple
                  v-model="state.displayConnections"
                >
                  <v-list-item
                    :color="connection.source.view.color"
                    :key="'connection' + connection.idx"
                    v-for="connection in state.network.connections"
                  >
                    <template v-slot:default="{ active }">
                      <v-list-item-content style="padding: 4px">
                        <v-row no-gutters>
                          {{ connection.source.view.label }}
                          <v-icon small v-text="'mdi-arrow-right'" />
                          {{ connection.target.view.label }}
                        </v-row>
                      </v-list-item-content>

                      <v-list-item-action style="margin: 4px 0">
                        <v-checkbox
                          :color="connection.source.view.color"
                          :input-value="active"
                          hide-details
                        />
                      </v-list-item-action>
                    </template>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-card-text>
          </v-card>
        </v-menu>
      </v-btn-toggle>
    </v-banner>

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
                <v-sheet :color="node.view.color">
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
                    <v-col cols="7">
                      <v-overflow-btn
                        :items="node.models"
                        class="ma-0"
                        dark
                        dense
                        editable
                        hide-details
                        item-text="label"
                        item-value="id"
                        style="font-weight:700"
                        tile
                        v-model="node.modelId"
                      />
                    </v-col>
                    <v-col cols="2">
                      <v-btn block class="handle" dark text tile height="40">
                        <v-icon small v-text="'mdi-menu'" />
                      </v-btn>
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
                    <v-icon small v-text="'mdi-menu'" />
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
                  :key="param.id"
                  :param="param"
                  :value.sync="param.value"
                  @update:value="paramChange()"
                  v-for="param in connection.filteredParams"
                />

                <ParameterEdit
                  :color="connection.source.view.color"
                  :key="param.id"
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
import NodePosition from '@/components/network/NodePosition.vue';
import ParameterEdit from '@/components/parameter/ParameterEdit.vue';

export default Vue.extend({
  name: 'NetworkParamsEdit',
  components: {
    draggable,
    NetworkConnectionMenu,
    NetworkNodeMenu,
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
        const elementTypes: string[] = ['', 'stimulator', 'neuron', 'recorder'];
        if (state.elementType === 0) return true;
        return elementTypes[state.elementType] === node.model.elementType;
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
        const elementTypes: string[] = ['', 'stimulator', 'neuron', 'recorder'];
        if (state.elementType === 0) return true;
        return (
          elementTypes[state.elementType] ===
          connection.source.model.elementType
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
      nodeDisplayChange,
      paramChange,
      showConnection,
      showConnectionMenu,
      showNode,
      showNodeMenu,
      state,
    };
  },
});
</script>

<style>
.elementType .v-toolbar__content {
  padding: 0;
}

.v-btn-toggle--group > .v-btn.v-btn {
  margin: 0;
}

.paramLabel {
  color: black;
  font-size: 12px;
  font-weight: 400;
  height: 12px;
  left: -8px;
  line-height: 12px;
  position: absolute;
  top: 2px;
  z-index: 1000;
}

.v-overflow-btn .v-input__slot {
  border-width: 0;
}

.v-overflow-btn.v-input--dense .v-select__slot {
  height: 40px;
}

.v-image__image--preload {
  filter: none;
  --webkit-filter: none;
}

.v-banner__wrapper {
  padding: 0 !important;
}
</style>
