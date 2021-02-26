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

    <v-banner single-line sticky>
      <v-toolbar class="elementType" dense flat tile>
        <v-row class="fill-height">
          <v-btn-toggle dense group mandatory tile v-model="state.elementType">
            <v-btn small> All </v-btn>
            <v-btn small> Stimulator </v-btn>
            <v-btn small> Neuron </v-btn>
            <v-btn small> Recorder </v-btn>
          </v-btn-toggle>
        </v-row>
      </v-toolbar>
    </v-banner>

    <v-row
      no-gutters
      style="overflow-y:auto; height: calc(100vh - 78px); margin-right: -8px"
    >
      <v-col>
        <draggable v-model="state.network.nodes">
          <transition-group>
            <v-card
              :color="node.view.color"
              :key="'node' + node.idx"
              class="mb-1"
              flat
              tile
              v-for="node of state.network.nodes"
              v-show="showNode(node)"
            >
              <v-img class="pa-0">
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
                </v-row>

                <div v-if="!node.model.isRecorder()" class="ml-1">
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
                  class="ml-1"
                  v-for="param of node.filteredParams"
                />
              </v-img>
            </v-card>
          </transition-group>
        </draggable>

        <draggable v-model="state.network.connections">
          <transition-group>
            <v-card
              :key="'connection' + connection.idx"
              class="mb-1"
              flat
              tile
              v-for="connection of state.network.connections"
              v-show="showConnection(connection)"
            >
              <v-img
                :gradient="'to right, ' + connection.view.backgroundImage"
                dark
              >
                <v-row
                  @contextmenu="e => showConnectionMenu(e, connection)"
                  no-gutters
                >
                  <v-col cols="3" class="py-0" style="text-align:center">
                    <v-btn
                      @click="() => connection.source.view.select()"
                      block
                      dark
                      height="40"
                      text
                      tile
                      v-text="connection.source.view.label"
                    />
                  </v-col>
                  <v-col cols="5">
                    <v-btn
                      @click="() => connection.view.select()"
                      block
                      dark
                      height="40"
                      text
                      tile
                    >
                      <v-icon v-text="'mdi-arrow-right-bold-outline'" />
                    </v-btn>
                  </v-col>
                  <v-col cols="4" class="py-0" style="text-align:center">
                    <v-btn
                      @click="
                        () => connection.targetconnection.target.view.select()
                      "
                      block
                      dark
                      height="40"
                      text
                      tile
                      v-text="connection.target.view.label"
                    />
                  </v-col>
                </v-row>

                <ParameterEdit
                  :color="connection.source.view.color"
                  :key="param.id"
                  :param="param"
                  :value.sync="param.value"
                  @update:value="paramChange()"
                  class="mx-1"
                  v-for="param in connection.synapse.filteredParams"
                />
              </v-img>
            </v-card>
          </transition-group>
        </draggable>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive, watch } from '@vue/composition-api';
import draggable from 'vuedraggable';

import { Connection } from '@/core/connection/connection';
import { Network } from '@/core/network/network';
import { Node } from '@/core/node/node';
import core from '@/core/index';
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
      } else {
        const elementTypes: string[] = ['', 'stimulator', 'neuron', 'recorder'];
        if (state.elementType === 0) return true;
        return elementTypes[state.elementType] === node.model.elementType;
      }
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
     * Triggers when parameter is changed.
     */
    const paramChange = () => {
      state.network.networkChanges();
      // if (!state.network.project.simulation.running) {
      //   state.network.project.simulateAfterChange();
      // }
    };

    watch(
      () => [props.projectId, core.app.project.network.hash],
      () => {
        state.network = core.app.project.network as Network;
      }
    );

    return {
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
.elementType {
  height: 32px !important;
  line-height: 32px !important;
}

.elementType .v-btn {
  font-size: 11px !important;
  padding: 12px;
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
