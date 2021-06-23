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

    <!--
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
      <template #prepend-item>
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
    </v-select> -->

    <v-banner
      class="elementType"
      height="28"
      max-height="28"
      single-line
      sticky
    >
      <v-btn-toggle
        :max="4"
        dense
        group
        mandatory
        tile
        v-model="state.elementType"
      >
        <v-btn
          :key="elementType"
          small
          v-text="elementType"
          v-for="elementType in state.elementTypes"
        />
        <v-menu :close-on-content-click="false" :max-height="600" offset-y>
          <template #activator="{ on, attrs }">
            <v-btn small v-text="'Custom'" v-bind="attrs" v-on="on" />
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
        <span :key="'node-' + node.idx" v-for="node of state.network.nodes">
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
                <NodePosition :node="node" v-if="node.spatial.hasPositions()" />
                <ParameterEdit
                  :color="node.view.color"
                  :options="{
                    input: 'valueSlider',
                    label: 'population size',
                    max: 1000,
                    min: 1,
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
                      :item-text="
                        item =>
                          item.label + (item.unit ? ` (${item.unit})` : '')
                      "
                      :items="node.recordables"
                      @change="paramChange()"
                      attach
                      class="ma-0 pt-4 px-1"
                      dense
                      hide-details
                      item-value="id"
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

        <v-card
          :key="'connection-' + connection.idx"
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
            <v-col cols="3" class="py-0" style="text-align: center">
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
            <v-col cols="6">
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
            <v-col cols="3" class="py-0" style="text-align: center">
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
        // selected view
        return state.network.view.isNodeSelected(node);
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
        state.network.view.selectedConnection ||
        state.network.view.selectedNode
      ) {
        // selected view
        return state.network.view.isConnectionSelected(connection);
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
      iconConnections,
      iconNodes,
      nodeDisplayChange,
      paramChange,
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
.paramLabel {
  color: black;
  font-size: 12px;
  font-weight: 400;
  height: 12px;
  left: -8px;
  line-height: 12px;
  position: absolute;
  top: 2px;
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
</style>
