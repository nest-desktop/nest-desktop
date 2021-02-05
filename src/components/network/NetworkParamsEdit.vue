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

    <v-toolbar class="elementType" dense flat tile>
      <!-- <v-tabs slider-size="5">
        <v-tab class="px-1">Simulator</v-tab>
        <v-tab class="px-1">Neuron</v-tab>
        <v-tab class="px-1">Recorder</v-tab>
      </v-tabs> -->
      <v-row class="fill-height">
        <v-btn-toggle dense group mandatory tile v-model="state.elementType">
          <v-btn small> All </v-btn>
          <v-btn small> Stimulator </v-btn>
          <v-btn small> Neuron </v-btn>
          <v-btn small> Recorder </v-btn>
        </v-btn-toggle>
      </v-row>
    </v-toolbar>

    <v-row style="overflow-y:auto; height: calc(100vh - 78px)" no-gutters>
      <v-col>
        <v-card
          :color="node.view.color"
          :key="'node' + node.idx"
          class="mb-1"
          flat
          tile
          v-for="node of state.network.nodes"
          v-show="showNode(node)"
        >
          <v-card-title @contextmenu="e => showNodeMenu(e, node)" class="pa-0">
            <v-row no-gutters>
              <v-col cols="3">
                <v-btn
                  @click="() => (state.network.view.selectedNode = node)"
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
          </v-card-title>

          <v-card-text class="pa-0 pl-1" v-if="node.params.length > 0">
            <v-card flat tile v-if="!node.model.isRecorder()">
              <v-row class="mx-1 my-0" no-gutters>
                <v-col cols="12">
                  <v-subheader class="paramLabel">
                    population size
                  </v-subheader>
                  <v-slider
                    :max="1000"
                    :min="1"
                    :thumb-color="node.view.color"
                    @change="paramChange"
                    dense
                    height="40"
                    hide-details
                    v-model="node.size"
                  >
                    <template v-slot:append>
                      <v-text-field
                        @change="paramChange"
                        class="mt-0 pt-0"
                        height="32"
                        hide-details
                        single-line
                        style="width: 60px; font-size:12px"
                        type="number"
                        v-model="node.size"
                      />
                    </template>
                  </v-slider>
                </v-col>
              </v-row>
            </v-card>

            <v-card
              :key="param.id"
              flat
              tile
              v-for="param of node.filteredParams"
            >
              <v-row class="mx-1 my-0" no-gutters>
                <v-col cols="12">
                  <v-subheader class="paramLabel">
                    {{ paramLabel(param) }}
                  </v-subheader>
                  <v-slider
                    :max="param.options.max"
                    :min="param.options.min"
                    :thumb-color="node.view.color"
                    @change="paramChange"
                    dense
                    height="40"
                    hide-details
                    v-model="param.value"
                  >
                    <template v-slot:append>
                      <v-text-field
                        @change="paramChange"
                        class="mt-0 pt-0"
                        height="32"
                        hide-details
                        single-line
                        style="width: 60px; font-size:12px"
                        type="number"
                        v-model="param.value"
                      />
                    </template>
                  </v-slider>
                </v-col>
              </v-row>
            </v-card>
          </v-card-text>
        </v-card>

        <v-card
          :key="'connection' + connection.idx"
          class="mb-1"
          flat
          tile
          v-for="connection of state.network.connections"
          v-show="showConnection(connection)"
        >
          <v-card-title
            @contextmenu="e => showConnectionMenu(e, connection)"
            class="pa-0"
          >
            <v-img
              dark
              height="40"
              width="320"
              :gradient="
                'to right, ' +
                  connection.source.view.color +
                  ',' +
                  connection.source.view.color +
                  ',' +
                  connection.source.view.color +
                  ',' +
                  connection.source.view.color +
                  ',' +
                  connection.source.view.color +
                  ',' +
                  'white' +
                  ',' +
                  /* connection.target.view.color + */
                  /* ',' + */
                  connection.target.view.color +
                  ',' +
                  connection.target.view.color
              "
            >
              <v-row no-gutters>
                <v-col cols="3" class="py-0" style="text-align:center">
                  <v-btn
                    @click="
                      () =>
                        (state.network.view.selectedNode = connection.source)
                    "
                    block
                    dark
                    height="40"
                    text
                    tile
                    v-text="connection.source.view.label"
                  />
                </v-col>
                <v-col cols="6">
                  <v-btn
                    @click="
                      () => (state.network.view.selectedConnection = connection)
                    "
                    block
                    dark
                    height="40"
                    text
                    tile
                  >
                    <v-icon v-text="'mdi-arrow-right-bold-outline'" />
                  </v-btn>
                </v-col>
                <v-col cols="3" class="py-0" style="text-align:center">
                  <v-btn
                    @click="
                      () =>
                        (state.network.view.selectedNode = connection.target)
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
            </v-img>
          </v-card-title>

          <v-card-text class="pa-0 pl-1">
            <v-card
              :key="param.id"
              flat
              tile
              v-for="param in connection.synapse.filteredParams"
            >
              <v-row class="mx-1 my-0" no-gutters>
                <v-col cols="12">
                  <v-subheader class="paramLabel">
                    {{ paramLabel(param) }}
                  </v-subheader>
                  <v-slider
                    :max="param.options.max"
                    :min="param.options.min"
                    :thumb-color="connection.source.view.color"
                    @change="paramChange"
                    dense
                    height="40"
                    hide-details
                    v-model="param.value"
                  >
                    <template v-slot:append>
                      <v-text-field
                        @change="paramChange"
                        class="mt-0 pt-0"
                        height="32"
                        hide-details
                        single-line
                        style="width: 60px; font-size:12px"
                        type="number"
                        v-model="param.value"
                      />
                    </template>
                  </v-slider>
                </v-col>
              </v-row>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Vue from 'vue';
import { reactive, watch } from '@vue/composition-api';
import NetworkConnectionMenu from '@/components/network/NetworkConnectionMenu.vue';
import NetworkNodeMenu from '@/components/network/NetworkNodeMenu.vue';
import core from '@/core/index';

export default Vue.extend({
  name: 'NetworkParamsEdit',
  components: {
    NetworkConnectionMenu,
    NetworkNodeMenu,
  },
  props: {
    projectId: String,
  },
  setup(props) {
    const state = reactive({
      network: core.app.project.network,
      elementType: 0,
      connectionMenu: {
        connection: null,
        position: {
          x: 0,
          y: 0,
        },
        show: false,
      },
      nodeMenu: {
        node: null,
        position: {
          x: 0,
          y: 0,
        },
        show: false,
      },
    });

    const paramLabel = param => {
      return `${param.options.label} (${param.options.unit})` || param.id;
    };

    const showNode = node => {
      if (
        state.network.view.selectedConnection ||
        state.network.view.selectedNode
      ) {
        return state.network.view.isNodeSelected(node);
      } else {
        const elementTypes = ['', 'stimulator', 'neuron', 'recorder'];
        if (state.elementType === 0) return true;
        return elementTypes[state.elementType] === node.model.elementType;
      }
    };

    const showConnection = connection => {
      if (
        state.network.view.selectedConnection ||
        state.network.view.selectedNode
      ) {
        return state.network.view.isConnectionSelected(connection);
      } else {
        const elementTypes = ['', 'stimulator', 'neuron', 'recorder'];
        if (state.elementType === 0) return true;
        return (
          elementTypes[state.elementType] ===
          connection.source.model.elementType
        );
      }
    };

    const showConnectionMenu = function(e, connection) {
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

    const showNodeMenu = function(e, node) {
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

    const paramChange = () => {
      state.network.networkChanges();
      if (!state.network.project.simulation.running) {
        state.network.project.simulateAfterChange();
      }
    };

    watch(
      () => props.projectId,
      () => {
        state.network = core.app.project.network;
      }
    );

    watch(
      () => core.app.project.network.hash,
      () => {
        state.network = core.app.project.network;
      }
    );

    return {
      paramChange,
      paramLabel,
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
</style>
