<template>
  <div class="networkEdit">
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
          :value="node.modelId"
          class="ma-0"
          dark
          dense
          editable
          hide-details
          item-text="label"
          item-value="id"
          style="font-weight:700"
        />
        <!-- </v-col>
      </v-row> -->
      </v-card-title>

      <v-card-text class="pa-0 pl-1">
        <v-card flat tile v-for="param of node.params" :key="param.id">
          <v-row class="mx-1 my-0" no-gutters>
            <v-col cols="12">
              <v-subheader class="paramLabel">
                {{ paramLabel(param) }}
              </v-subheader>
              <v-slider
                :thumb-color="node.view.color"
                :hint="param.unit"
                :max="param.min"
                :min="param.max"
                dense
                height="40"
                hide-details
                _thumb-label
                v-model="param.value"
              >
                <template v-slot:append>
                  <v-text-field
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
  </div>
</template>

<script>
import Vue from 'vue';
import { reactive } from '@vue/composition-api';

export default Vue.extend({
  name: 'NetworkEdit',
  props: {
    projectId: String,
    network: Object,
  },
  setup(props) {
    const state = reactive({
      network: props.network,
      elementType: 0,
    });

    const paramLabel = param => {
      return `${param.options.label} (${param.options.unit})` || param.id;
    };
    const showNode = node => {
      const elementTypes = ['', 'stimulator', 'neuron', 'recorder'];
      if (state.elementType === 0) return true;
      return elementTypes[state.elementType] === node.model.elementType;
    };

    return { paramLabel, showNode, state };
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
</style>
