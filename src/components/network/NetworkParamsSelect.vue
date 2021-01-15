<template>
  <div class="networkParamSelect" v-if="state.network">
    <v-toolbar class="elementType" dense flat tile>
      <!-- <v-tabs slider-size="5">
        <v-tab class="px-1">Simulator</v-tab>
        <v-tab class="px-1">Neuron</v-tab>
        <v-tab class="px-1">Recorder</v-tab>
      </v-tabs> -->
      <v-row class="fill-height">
        <v-btn-toggle dense group flat tile v-model="state.elementType">
          <v-btn small> All </v-btn>
          <v-btn small> Stimulator </v-btn>
          <v-btn small> Neuron </v-btn>
          <v-btn small> Recorder </v-btn>
        </v-btn-toggle>
      </v-row>
    </v-toolbar>

    <NetworkNodeMenu
      :node="state.menu.node"
      :position="state.menu.position"
      v-if="state.menu.show"
    />

    <v-card
      :color="node.view.color"
      :key="node.idx"
      class="mb-1"
      flat
      tile
      v-for="node of network.nodes"
      v-show="showNode(node)"
    >
      <v-card-title class="pa-0">
        <!-- <v-row no-gutters> -->
        <!-- <v-col cols="2"> </v-col> -->
        <!-- <v-col cols="12"> -->
        <v-overflow-btn
          :items="node.models"
          @contextmenu="e => showMenu(e, node)"
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

      <v-card-text class="pa-0 pl-1">
        <v-card
          :key="param.id"
          class="param"
          flat
          tile
          v-for="param of node.params"
          v-show="param.visible || true"
        >
          <v-row>
            <v-list-item style="font-size:12px; min-height:32px">
              <template v-slot:default="{ active }">
                <v-list-item-content style="padding: 4px">
                  <v-row no-gutters>
                    {{ param.options.label }}
                    <v-spacer />
                    {{ param.value }}
                    {{ param.options.unit }}
                  </v-row>
                </v-list-item-content>

                <v-list-item-action style="margin: 4px 0">
                  <v-checkbox
                    color="black"
                    class="shrink mr-2"
                    hide-details
                    v-model="param.visible"
                    @change="paramChange"
                  ></v-checkbox>
                </v-list-item-action>
              </template>
            </v-list-item>
          </v-row>
        </v-card>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import Vue from 'vue';
import { reactive } from '@vue/composition-api';
import NetworkNodeMenu from '@/components/network/NetworkNodeMenu.vue';

export default Vue.extend({
  name: 'NetworkParamsSelect',
  components: {
    NetworkNodeMenu,
  },
  props: {
    projectId: String,
    network: Object,
  },
  setup(props) {
    const state = reactive({
      network: props.network,
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
      const elementTypes = ['', 'stimulator', 'neuron', 'recorder'];
      if (state.elementType === 0) return true;
      return elementTypes[state.elementType] === node.model.elementType;
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

    return { paramChange, paramLabel, showNode, state, showMenu };
  },
});
</script>

<style>
.elementType {
  height: 36px !important;
}

.elementType button {
  font-size: 10px !important;
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

.param .v-input__control .v-icon {
  font-size: 16px;
}

.param .v-input__control .v-input--selection-controls__ripple {
  height: 24px;
  width: 24px;
  left: -7px;
  top: calc(50% - 19px);
}
</style>
