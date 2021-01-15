<template>
  <div class="networkParamEdit" v-if="state.network">
    <NetworkNodeMenu
      :node="state.menu.node"
      :position="state.menu.position"
      v-if="state.menu.show"
    />

    <v-toolbar class="elementType" dense flat tile>
      <!-- <v-tabs slider-size="5">
        <v-tab class="px-1">Simulator</v-tab>
        <v-tab class="px-1">Neuron</v-tab>
        <v-tab class="px-1">Recorder</v-tab>
      </v-tabs> -->
      <v-row class="fill-height">
        <v-btn-toggle dense group tile v-model="state.elementType">
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
          :key="node.idx"
          @contextmenu="e => showMenu(e, node)"
          class="mb-1"
          flat
          tile
          v-for="node of state.network.nodes"
          v-show="showNode(node)"
        >
          <v-card-title class="pa-0">
            <!-- <v-row no-gutters> -->
            <!-- <v-col cols="2"> </v-col> -->
            <!-- <v-col cols="12"> -->
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
              v-model="node.modelId"
            />
            <!-- </v-col>
      </v-row> -->
          </v-card-title>

          <v-card-text class="pa-0 pl-1" v-if="node.params.length > 0">
            <v-card flat tile>
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
      </v-col>
    </v-row>
  </div>
</template>

<script>
import Vue from 'vue';
import { reactive, watch } from '@vue/composition-api';
import NetworkNodeMenu from '@/components/network/NetworkNodeMenu.vue';
import core from '@/core/index';

export default Vue.extend({
  name: 'NetworkParamsEdit',
  components: {
    NetworkNodeMenu,
  },
  props: {
    projectId: String,
  },
  setup(props) {
    const state = reactive({
      network: core.app.project.network,
      elementType: 0,
      menu: {
        node: null,
        show: false,
        position: {
          x: 0,
          y: 0,
        },
      },
    });

    const paramLabel = param => {
      return `${param.options.label} (${param.options.unit})` || param.id;
    };

    const showNode = node => {
      if (state.network.view.selectedNode) {
        return node === state.network.view.selectedNode;
      } else {
        const elementTypes = ['', 'stimulator', 'neuron', 'recorder'];
        if (state.elementType === 0) return true;
        return elementTypes[state.elementType] === node.model.elementType;
      }
    };

    const showMenu = function(e, node) {
      e.preventDefault();
      state.menu.show = false;
      state.menu.node = node;
      state.menu.position.x = e.clientX;
      state.menu.position.y = e.clientY;
      this.$nextTick(() => {
        state.menu.show = true;
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
      showNode,
      state,
      showMenu,
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
</style>
