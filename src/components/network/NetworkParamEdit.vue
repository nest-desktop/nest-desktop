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

    <NetworkParamToolbar :network="state.network" />

    <v-row class="networParamEditContent" no-gutters>
      <v-col>
        <span v-if="state.network.state.elementTypeIdx === 4">
          <v-row class="align-center d-flex" no-gutters>
            <v-overflow-btn
              :items="state.network.project.app.model.state.modelsNEST"
              class="ma-0"
              dense
              editable
              flat
              hide-details
              placeholder="Select an existing model"
              v-model="state.model"
            />
            <v-btn
              :dark="projectView.config.coloredToolbar"
              :disabled="state.model.length === 0"
              :text="!projectView.config.coloredToolbar"
              @click="copyModel()"
              class="ma-1"
              color="project"
              depressed
              height="32"
              v-text="'Copy'"
            />
          </v-row>
        </span>

        <span>
          <span
            :key="'model-' + model.idx"
            class="modelEdit"
            v-for="model of state.network.models"
          >
            <v-card class="ma-2px" outlined tile v-if="showModel(model)">
              <v-sheet color="grey">
                <v-card class="ml-1" flat tile>
                  <v-card-title class="pa-0">
                    <v-row no-gutters>
                      <CopyModelSelect :model="model" style="width: 100%" />
                      <span class="icons">
                        <v-icon
                          :dark="projectView.config.coloredToolbar"
                          @click="model.remove()"
                          class="mx-1"
                          right
                          small
                          v-text="'mdi-trash-can-outline'"
                        />
                      </span>
                    </v-row>
                  </v-card-title>

                  <v-card-text class="mt-4 pa-0">
                    <v-text-field
                      class="ma-2"
                      dense
                      hide-details
                      label="New label"
                      v-model="model.newModelId"
                    />

                    <ModelParamEdit :model="model" />
                  </v-card-text>
                </v-card>
              </v-sheet>
            </v-card>
          </span>

          <span :key="'node-' + node.idx" v-for="node of state.network.nodes">
            <v-card class="ma-2px" outlined tile v-if="showNode(node)">
              <v-sheet :color="node.view.color">
                <v-card class="ml-1" flat tile>
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
                        <NodeModelSelect :node="node" />
                      </v-col>
                    </v-row>

                    <v-row no-gutters v-if="!node.model.isRecorder">
                      <v-col>
                        <NodePosition
                          :node="node"
                          v-if="node.spatial.hasPositions"
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
            </v-card>
          </span>

          <span
            :key="'connection-' + connection.idx"
            v-for="connection of state.network.connections"
          >
            <v-card
              class="ma-2px"
              outlined
              tile
              v-if="showConnection(connection)"
            >
              <v-sheet :color="connection.source.view.color">
                <v-card class="ml-1" flat tile>
                  <v-card-title class="pa-0 ma-0">
                    <v-row
                      @contextmenu="e => showConnectionMenu(e, connection)"
                      no-gutters
                    >
                      <v-col class="py-0" cols="3" style="text-align: center">
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
                          depressed
                          height="40"
                          text
                          tile
                        >
                          <v-chip
                            label
                            outlined
                            small
                            v-if="connection.network.project.app.config.devMode"
                            v-text="connection.shortHash"
                          />
                          <v-icon v-text="'mdi-arrow-right-bold-outline'" />
                        </v-btn>
                      </v-col>
                      <v-col class="py-0" cols="3" style="text-align: center">
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
                      v-if="
                        connection.source.size > 1 || connection.target.size > 1
                      "
                    />
                    <SynapseParamEdit :synapse="connection.synapse" />
                  </v-card-text>
                </v-card>
              </v-sheet>
            </v-card>
          </span>
        </span>
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive, watch } from '@vue/composition-api';
import draggable from 'vuedraggable';

import { Connection } from '@/core/connection/connection';
import { CopyModel } from '@/core/model/copyModel';
import { Network } from '@/core/network/network';
import { Node } from '@/core/node/node';
import ConnectionMenu from '@/components/connection/ConnectionMenu.vue';
import ConnectionParamEdit from '@/components/connection/ConnectionParamEdit.vue';
import core from '@/core';
import CopyModelSelect from '@/components/model/CopyModelSelect.vue';
import ModelParamEdit from '@/components/model/ModelParamEdit.vue';
import NodeMenu from '@/components/node/NodeMenu.vue';
import NodeModelSelect from '@/components/node/NodeModelSelect.vue';
import NodeParamEdit from '@/components/node/NodeParamEdit.vue';
import NodePosition from '@/components/node/NodePosition.vue';
import ParameterEdit from '@/components/parameter/ParameterEdit.vue';
import SynapseParamEdit from '@/components/synapse/SynapseParamEdit.vue';
import NetworkParamToolbar from '@/components/network/NetworkParamToolbar.vue';

export default Vue.extend({
  name: 'NetworkParamsEdit',
  components: {
    ConnectionMenu,
    ConnectionParamEdit,
    CopyModelSelect,
    draggable,
    ModelParamEdit,
    NetworkParamToolbar,
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
      connectionMenu: {
        connection: undefined as Connection | undefined,
        position: {
          x: 0,
          y: 0,
        },
        show: false,
      },
      model: '',
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
            'value > 0',
            'The population size must be positive.',
            'error',
          ],
          [
            'value < 1000',
            'Large population size produces many data points which could cause a high system load and thus freezes and lags!',
            'warning',
          ],
        ],
      },
      text: true,
    });

    /**
     * Copy model.
     */
    const copyModel = () => {
      state.network.copyModel(state.model);
      state.network.networkChanges();
    };

    /**
     * Show model in list.
     */
    const showModel = (model: CopyModel) => {
      const elementTypeIdx = state.network.state.elementTypeIdx;
      const elementTypes = state.network.state.elementTypes;

      if (state.network.state.selectedNode) {
        // selected node
        return model.nodes.some((node: Node) =>
          state.network.state.isNodeSelected(node)
        );
      } else if (state.network.state.selectedConnection) {
        // selected connection
        return model.connections.some((connection: Connection) =>
          state.network.state.isConnectionSelected(connection)
        );
      } else if (elementTypeIdx === 0 || elementTypeIdx === 4) {
        // all view
        return true;
      } else if (elementTypeIdx < elementTypes.length) {
        // element type view
        return elementTypes[elementTypeIdx] === model.elementType;
      } else {
        // custom view
        return state.network.state.displayIdx.models.includes(model.idx);
      }
    };

    /**
     * Show node in list.
     */
    const showNode = (node: Node) => {
      const elementTypeIdx = state.network.state.elementTypeIdx;
      const elementTypes = state.network.state.elementTypes;

      if (elementTypeIdx === 4) {
        return false;
      } else if (
        state.network.state.selectedConnection ||
        state.network.state.selectedNode
      ) {
        // selected view
        return state.network.state.isNodeSelected(node);
      } else if (elementTypeIdx === 0) {
        // all view
        return true;
      } else if (elementTypeIdx < elementTypes.length) {
        // element type view
        return elementTypes[elementTypeIdx] === node.model.elementType;
      } else {
        // custom view
        return state.network.state.displayIdx.nodes.includes(node.idx);
      }
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
     * Show connection in list.
     */
    const showConnection = (connection: Connection) => {
      const elementTypeIdx = state.network.state.elementTypeIdx;
      const elementTypes = state.network.state.elementTypes;

      if (elementTypeIdx === 4) {
        return false;
      } else if (
        state.network.state.selectedConnection ||
        state.network.state.selectedNode
      ) {
        // selected view
        return state.network.state.isConnectionSelected(connection);
      } else if (elementTypeIdx === 0) {
        // all views
        return true;
      } else if (elementTypeIdx < elementTypes.length) {
        // elementType view
        return (
          elementTypes[elementTypeIdx] === connection.source.model.elementType
        );
      } else {
        // custom view
        return state.network.state.displayIdx.connections.includes(
          connection.idx
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

    watch(
      () => [props.projectId, projectView.state.project.network.state.hash],
      () => {
        state.network = projectView.state.project.network as Network;
      }
    );

    return {
      copyModel,
      projectView,
      showConnection,
      showConnectionMenu,
      showModel,
      showNode,
      showNodeMenu,
      state,
    };
  },
});
</script>

<style>
.networkParamEdit .networParamEditContent {
  margin-top: 40px;
  overflow-x: hidden;
}

.networkParamEdit .toolbar .v-toolbar__content {
  padding: 0;
}
.networkParamEdit .v-btn-toggle--group > .v-btn.v-btn {
  margin: 0;
}
.networkParamEdit .v-overflow-btn .v-input__slot {
  border-width: 0;
}
.networkParamEdit .v-overflow-btn.v-input--dense .v-select__slot {
  height: 40px;
}

.modelEdit .icons {
  display: none;
  line-height: 36px;
  position: absolute;
  right: 4px;
}
.modelEdit:hover .icons {
  display: block;
}
</style>
