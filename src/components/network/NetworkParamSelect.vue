<template>
  <div class="networkParamSelect">
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

    <v-menu
      :close-on-content-click="false"
      :position-x="state.menu.x"
      :position-y="state.menu.y"
      absolute
      offset-y
      tile
      v-model="state.menu.show"
    >
      <v-card tile flat v-if="state.selectedNode">
        <span v-if="state.menu.content === null">
          <v-list dense>
            <v-list-item
              :key="index"
              @click="item.onClick"
              v-for="(item, index) in state.menu.items"
            >
              <v-list-item-icon>
                <v-icon>
                  {{ item.icon }}
                </v-icon>
              </v-list-item-icon>
              <v-list-item-title>{{ item.title }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </span>

        <span v-if="state.menu.content === 'color'">
          <v-color-picker
            show-swatches
            v-model="state.selectedNode.view.color"
            @update:color="network.clean()"
          ></v-color-picker>

          <v-card-actions>
            <v-btn @click="state.menu.content = null">back</v-btn>
            <v-btn @click="state.selectedNode.view.color = null">reset</v-btn>
          </v-card-actions>
        </span>
      </v-card>
    </v-menu>

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
          @contextmenu="e => show(e, node)"
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

export default Vue.extend({
  name: 'NetworkEdit',
  props: {
    projectId: String,
    network: Object,
  },
  setup(props) {
    const state = reactive({
      network: props.network,
      selectedNode: null,
      elementType: 0,
      menu: {
        content: null,
        show: false,
        x: 0,
        y: 0,
        items: [
          {
            icon: 'mdi-format-color-fill',
            title: 'Colorize node',
            onClick: () => {
              state.menu.content = 'color';
            },
          },
          { icon: 'mdi-axis-arrow', title: 'Set spatial', onClick: () => {} },
          { icon: 'mdi-restart', title: 'Reset parameters', onClick: () => {} },
          {
            icon: 'mdi-trash-can-outline',
            title: 'Delete node',
            onClick: () => {},
          },
        ],
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

    const show = function(e, node) {
      e.preventDefault();
      state.selectedNode = node;
      state.menu.show = false;
      state.menu.x = e.clientX;
      state.menu.y = e.clientY;
      this.$nextTick(() => {
        state.menu.show = true;
      });
    };

    const networkChange = () => {
      state.network.project.code.generate();
    };

    return { networkChange, paramLabel, showNode, state, show };
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
