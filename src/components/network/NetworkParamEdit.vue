<template>
  <div class="networkParamEdit" v-if="state.network">
    <NodeMenu
      :node="state.nodeMenu.node"
      :position="state.nodeMenu.position"
      v-if="state.nodeMenu.show"
    />

    <ConnectionMenu
      :connection="state.connectionMenu.connection"
      :position="state.connectionMenu.position"
      v-if="state.connectionMenu.show"
    />

    <v-banner
      class="elementType"
      height="28"
      max-height="28"
      single-line
      sticky
    >
      <v-btn-toggle dense group mandatory tile v-model="state.elementType">
        <v-btn
          :key="elementType"
          small
          v-text="elementType"
          v-for="elementType in state.elementTypes"
        />
        <v-menu :close-on-content-click="false" :max-height="600" offset-y>
          <template #activator="{ on, attrs }">
            <v-btn small v-text="'custom'" v-bind="attrs" v-on="on" />
          </template>

          <v-card :width="280">
            <v-card-text class="pa-0">
              <v-list class="no-highlight" dense>
                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title v-text="'nodes'" />
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-row>
                      <span
                        :key="'node-' + elementType"
                        v-for="elementType in state.elementTypes"
                      >
                        <v-tooltip :open-delay="1000" top>
                          <template #activator="{ on, attrs }">
                            <v-btn
                              @click="toggleNodes(elementType)"
                              class="mx-0"
                              icon
                              v-bind="attrs"
                              v-on="on"
                            >
                              <v-icon v-text="iconNodes(elementType)" />
                            </v-btn>
                          </template>
                          <span v-text="elementType" />
                        </v-tooltip>
                      </span>
                    </v-row>
                  </v-list-item-action>
                </v-list-item>

                <v-list-item>
                  <v-list-item-content>
                    <v-list-item-title v-text="'connections'" />
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-row>
                      <span
                        :key="'connection-' + elementType"
                        v-for="elementType in state.elementTypes"
                      >
                        <v-tooltip :open-delay="1000" bottom>
                          <template #activator="{ on, attrs }">
                            <v-btn
                              @click="toggleConnections(elementType)"
                              class="mx-0"
                              icon
                              v-bind="attrs"
                              v-on="on"
                            >
                              <v-icon v-text="iconConnections(elementType)" />
                            </v-btn>
                          </template>
                          <span v-text="elementType" />
                        </v-tooltip>
                      </span>
                    </v-row>
                  </v-list-item-action>
                </v-list-item>

                <v-divider />

                <v-subheader v-text="'Nodes'" />
                <v-list-item-group
                  @change="nodeDisplayChange"
                  multiple
                  v-model="state.displayNodes"
                >
                  <draggable v-model="state.network.nodes" handle=".handle">
                    <transition-group>
                      <v-list-item
                        :key="'node' + node.idx"
                        v-for="node in state.network.nodes"
                      >
                        <template #default="{ active }">
                          <v-icon
                            :color="node.view.color"
                            class="handle"
                            title="Drag to change order in nodes."
                            v-text="'mdi-drag-vertical'"
                          />
                          <v-list-item-content
                            class="pa-1"
                            v-text="node.view.label"
                          />
                          <v-list-item-action class="my-1">
                            <v-checkbox
                              :color="node.view.color"
                              :input-value="active"
                              hide-details
                            />
                          </v-list-item-action>
                        </template>
                      </v-list-item>
                    </transition-group>
                  </draggable>
                </v-list-item-group>

                <v-divider />
                <v-subheader v-text="'Connections'" />
                <v-list-item-group
                  @change="connectionDisplayChange"
                  multiple
                  v-model="state.displayConnections"
                >
                  <draggable
                    v-model="state.network.connections"
                    handle=".handle"
                  >
                    <transition-group>
                      <v-list-item
                        :key="'connection' + connection.idx"
                        v-for="connection in state.network.connections"
                      >
                        <template #default="{ active }">
                          <v-icon
                            :color="connection.source.view.color"
                            class="handle"
                            title="Drag to change order in connections."
                            v-text="'mdi-drag-vertical'"
                          />
                          <v-list-item-content class="pa-1">
                            <v-row no-gutters>
                              {{ connection.source.view.label }}
                              <v-icon small v-text="'mdi-arrow-right'" />
                              {{ connection.target.view.label }}
                            </v-row>
                          </v-list-item-content>

                          <v-list-item-action class="my-1">
                            <v-checkbox
                              :color="connection.source.view.color"
                              :input-value="active"
                              hide-details
                            />
                          </v-list-item-action>
                        </template>
                      </v-list-item>
                    </transition-group>
                  </draggable>
                </v-list-item-group>
              </v-list>
            </v-card-text>
          </v-card>
        </v-menu>
      </v-btn-toggle>
    </v-banner>

    <v-row no-gutters style="overflow-y: auto; height: calc(100vh - 76px)">
      <v-col>
        <v-sheet
          :color="node.view.color"
          :key="'node-' + node.idx"
          class="ma-1"
          outlined
          v-for="node of state.network.nodes"
        >
          <v-card class="ml-1" tile outlined v-if="showNode(node)">
            <v-card-title
              @contextmenu="e => showNodeMenu(e, node)"
              class="pa-0"
            >
              <v-row no-gutters style="width: 100%">
                <v-col cols="3">
                  <v-btn
                    :color="node.view.color"
                    :dark="projectView.config.coloredToolbar"
                    :text="!projectView.config.coloredToolbar"
                    @click="() => node.state.select()"
                    block
                    depressed
                    height="40"
                    tile
                    v-text="node.view.label"
                  />
                </v-col>
                <v-col cols="9">
                  <NodeModelSelect :text="state.text" :node="node" />
                </v-col>
              </v-row>

              <v-row no-gutters v-if="!node.model.isRecorder()">
                <v-col>
                  <NodePosition
                    :node="node"
                    v-if="node.spatial.hasPositions()"
                  />
                  <ParameterEdit
                    :color="node.view.color"
                    :options="state.sizeOptions"
                    :value.sync="node.size"
                    @update:value="() => node.nodeChanges()"
                    v-else
                  />
                </v-col>
              </v-row>
            </v-card-title>

            <v-card-text class="pa-0">
              <NodeParamEdit :node="node" />
            </v-card-text>
          </v-card>
        </v-sheet>

        <v-sheet
          :color="connection.source.view.color"
          :key="'connection-' + connection.idx"
          class="ma-1"
          outlined
          v-for="connection of state.network.connections"
          v-show="showConnection(connection)"
        >
          <v-card class="ml-1" tile outlined>
            <v-card-title class="pa-0 ma-0">
              <v-row
                @contextmenu="e => showConnectionMenu(e, connection)"
                no-gutters
              >
                <v-col cols="3" class="py-0" style="text-align: center">
                  <v-btn
                    :color="connection.source.view.color"
                    :dark="projectView.config.coloredToolbar"
                    :text="!projectView.config.coloredToolbar"
                    @click="() => connection.source.state.select()"
                    block
                    depressed
                    height="40"
                    tile
                    v-text="connection.source.view.label"
                  />
                </v-col>
                <v-col cols="6">
                  <v-btn
                    @click="() => connection.state.select()"
                    block
                    color="white"
                    depressed
                    height="40"
                    tile
                  >
                    <v-chip
                      label
                      outlined
                      small
                      v-if="connection.network.project.app.config.devMode"
                      v-text="connection.hash.slice(0, 6)"
                    />
                    <v-icon v-text="'mdi-arrow-right-bold-outline'" />
                  </v-btn>
                </v-col>
                <v-col cols="3" class="py-0" style="text-align: center">
                  <v-btn
                    :color="connection.target.view.color"
                    :dark="projectView.config.coloredToolbar"
                    :text="!projectView.config.coloredToolbar"
                    @click="() => connection.target.state.select()"
                    block
                    depressed
                    height="40"
                    tile
                    v-text="connection.target.view.label"
                  />
                </v-col>
              </v-row>
            </v-card-title>

            <v-card-text class="pa-0">
              <ConnectionParamEdit
                :connection="connection"
                v-if="connection.source.size > 1 || connection.target.size > 1"
              />
              <SynapseParamEdit :synapse="connection.synapse" />
            </v-card-text>
          </v-card>
        </v-sheet>
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
import ConnectionMenu from '@/components/connection/ConnectionMenu.vue';
import ConnectionParamEdit from '@/components/connection/ConnectionParamEdit.vue';
import core from '@/core';
import NodeMenu from '@/components/node/NodeMenu.vue';
import NodeModelSelect from '@/components/node/NodeModelSelect.vue';
import NodeParamEdit from '@/components/node/NodeParamEdit.vue';
import NodePosition from '@/components/node/NodePosition.vue';
import ParameterEdit from '@/components/parameter/ParameterEdit.vue';
import SynapseParamEdit from '@/components/synapse/SynapseParamEdit.vue';

export default Vue.extend({
  name: 'NetworkParamsEdit',
  components: {
    ConnectionMenu,
    ConnectionParamEdit,
    draggable,
    NodeMenu,
    NodeModelSelect,
    NodeParamEdit,
    NodePosition,
    ParameterEdit,
    SynapseParamEdit,
  },
  props: {
    projectId: String,
  },
  setup(props) {
    const projectView = core.app.project.view;
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
      elementTypes: ['all', 'neuron', 'stimulator', 'recorder'],
      iconsOn: {
        all: 'mdi-checkbox-marked-outline',
        neuron: 'mdi-alpha-n-box',
        recorder: 'mdi-alpha-r-box',
        stimulator: 'mdi-alpha-s-box',
      },
      iconsOff: {
        all: 'mdi-checkbox-blank-outline',
        neuron: 'mdi-alpha-n-box-outline',
        recorder: 'mdi-alpha-r-box-outline',
        stimulator: 'mdi-alpha-s-box-outline',
      },
      network: projectView.state.project.network as Network,
      nodeMenu: {
        node: undefined as Node | undefined,
        position: {
          x: 0,
          y: 0,
        },
        show: false,
      },
      sizeOptions: {
        id: 'populationSize',
        input: 'valueSlider',
        label: 'population size',
        max: 1000,
        min: 1,
        value: 1,
        rules: [
          [
            'value >= 1000',
            'Large population size produces many data points which could cause a high system load and thus freezes and lags!',
            'warning',
          ],
        ],
      },
      text: true,
    });

    /**
     * Show node in list.
     */
    const showNode = (node: Node) => {
      if (
        state.network.state.selectedConnection ||
        state.network.state.selectedNode
      ) {
        // selected view
        return state.network.state.isNodeSelected(node);
      } else if (state.elementType === 0) {
        // all view
        return true;
      } else if (state.elementType >= 4) {
        // custom view
        return state.displayNodes.includes(node.idx);
      } else {
        // element type view
        return state.elementTypes[state.elementType] === node.model.elementType;
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
    const showNodeMenu = function (e: MouseEvent, node: Node) {
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
     * Toggle element type view of nodes.
     */
    const toggleNodes = (elementType: string = '') => {
      const nodes = ['', 'all'].includes(elementType)
        ? state.network.nodes
        : (state.network.nodes.filter(
            (node: Node) => node.model.elementType === elementType
          ) as Node[]);
      const visible: boolean =
        nodes.filter((node: Node) => node.view.visible).length !== nodes.length;
      nodes.forEach((node: Node) => (node.view.visible = visible));
      update();
    };

    /**
     * Checkbox icon for node element type.
     */
    const iconNodes = (elementType: string = '') => {
      const nodes = ['', 'all'].includes(elementType)
        ? state.network.nodes
        : (state.network.nodes.filter(
            (node: Node) => node.model.elementType === elementType
          ) as Node[]);
      const visibleNodes = nodes.filter(
        (node: Node) => node.view.visible
      ) as Node[];
      if (visibleNodes.length === nodes.length && nodes.length !== 0)
        return state.iconsOn[elementType];
      if (visibleNodes.length > 0 || nodes.length === 0)
        return 'mdi-minus-box-outline';
      return state.iconsOff[elementType];
    };

    /**
     * Show connection in list.
     */
    const showConnection = (connection: Connection) => {
      if (
        state.network.state.selectedConnection ||
        state.network.state.selectedNode
      ) {
        // selected view
        return state.network.state.isConnectionSelected(connection);
      } else if (state.elementType === 0) {
        // all views
        return true;
      } else if (state.elementType >= 4) {
        // custom view
        return state.displayConnections.includes(connection.idx);
      } else {
        // elementType view
        return (
          state.elementTypes[state.elementType] ===
          connection.source.model.elementType
        );
      }
    };

    /**
     * Show connection menu.
     */
    const showConnectionMenu = function (
      e: MouseEvent,
      connection: Connection
    ) {
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
     * Toggle element type view of connections.
     */
    const toggleConnections = (elementType: string = '') => {
      const connections = ['', 'all'].includes(elementType)
        ? state.network.connections
        : (state.network.connections.filter(
            (connection: Connection) =>
              connection.source.model.elementType === elementType
          ) as Connection[]);
      const visible: boolean =
        connections.filter((connection: Connection) => connection.view.visible)
          .length !== connections.length;
      connections.forEach(
        (connection: Connection) => (connection.view.visible = visible)
      );
      update();
    };

    /**
     * Checkbox icon for element type connection.
     */
    const iconConnections = (elementType: string = '') => {
      const connections = ['', 'all'].includes(elementType)
        ? state.network.connections
        : (state.network.connections.filter(
            (connection: Connection) =>
              connection.source.model.elementType === elementType
          ) as Connection[]);
      const visibleConnections = connections.filter(
        (connection: Connection) => connection.view.visible
      ) as Connection[];
      if (
        visibleConnections.length === connections.length &&
        connections.length !== 0
      )
        return state.iconsOn[elementType];
      if (visibleConnections.length > 0 || connections.length === 0)
        return 'mdi-minus-box-outline';
      return state.iconsOff[elementType];
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
      () => [props.projectId, projectView.state.project.network.state.hash],
      () => {
        state.network = projectView.state.project.network as Network;
        update();
      }
    );

    return {
      connectionDisplayChange,
      iconConnections,
      iconNodes,
      nodeDisplayChange,
      projectView,
      showConnection,
      showConnectionMenu,
      showNode,
      showNodeMenu,
      state,
      toggleConnections,
      toggleNodes,
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
.no-highlight .v-list-item--active::before {
  opacity: 0 !important;
}

.v-list-item .handle {
  opacity: 0;
}
.v-list-item:hover .handle {
  opacity: 1;
}

.networkParamEdit .v-sheet {
  border-color: #e0e0e0 !important;
  border-width: 1px 1px 1px 0;
}
.networkParamEdit .v-card {
  border-width: 0;
}
</style>
