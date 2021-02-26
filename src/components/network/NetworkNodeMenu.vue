<template>
  <div v-if="state.node">
    <v-menu
      :close-on-content-click="false"
      :position-x="state.position.x"
      :position-y="state.position.y"
      :value="state.show"
      transition="slide-y-transition"
    >
      <v-card tile flat style="min-width:300px">
        <v-card-title
          :style="{ backgroundColor: state.node.view.color }"
          class="py-1"
          style="color:white; height:40px"
          v-text="state.node.model.label"
        />

        <span v-if="state.content === null">
          <v-list dense>
            <v-list-item
              :key="index"
              @click="item.onClick"
              v-for="(item, index) in state.items"
            >
              <v-list-item-icon>
                <v-icon v-text="item.icon" />
              </v-list-item-icon>
              <v-list-item-title>{{ item.title }}</v-list-item-title>

              <v-list-item-action v-show="item.append">
                <v-icon small v-text="'mdi-menu-right'" />
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </span>

        <span v-if="state.content === 'nodeColor'">
          <v-color-picker
            @update:color="updateColor"
            flat
            show-swatches
            style="border-radius:0"
            v-model="state.node.view.color"
          ></v-color-picker>

          <v-card-actions>
            <v-btn @click="back" text>
              <v-icon left v-text="'mdi-menu-left'" /> back
            </v-btn>
            <v-btn @click="resetColor" text>reset</v-btn>
          </v-card-actions>
        </span>

        <span v-if="state.content === 'modelDocumentation'">
          <ModelDocumentation :id="state.node.modelId" />
        </span>

        <span v-if="state.content === 'paramsSelect'">
          <v-card
            :key="param.id"
            class="param"
            flat
            tile
            v-for="param of state.node.params"
          >
            <v-row>
              <v-list-item style="font-size:12px; min-height:32px">
                <template v-slot:default="{ active }">
                  <v-list-item-content style="padding: 4px">
                    <v-row no-gutters>
                      {{ param.options.label }}
                      <v-spacer />
                      {{ param.toJSON().value }}
                      {{ param.options.unit }}
                    </v-row>
                  </v-list-item-content>

                  <v-list-item-action style="margin: 4px 0">
                    <v-checkbox
                      :input-value="active"
                      @change="paramChange"
                      class="shrink mr-2"
                      color="black"
                      hide-details
                      v-model="param.visible"
                    />
                  </v-list-item-action>
                </template>
              </v-list-item>
            </v-row>
          </v-card>
          <v-card-actions>
            <v-btn @click="back" text>
              <v-icon left v-text="'mdi-menu-left'" /> back
            </v-btn>
            <v-btn @click="state.node.view.hideAllParams()" text>none</v-btn>
            <v-btn @click="state.node.view.showAllParams()" text>all</v-btn>
          </v-card-actions>
        </span>

        <span v-if="state.content === 'nodeWeights'">
          <v-list dense>
            <v-list-item @click="setWeights('excitatory')">
              <v-list-item-icon>
                <v-icon v-text="'mdi-plus'" />
              </v-list-item-icon>
              <v-list-item-title>
                excitatory
              </v-list-item-title>
            </v-list-item>

            <v-list-item @click="setWeights('inhibitory')">
              <v-list-item-icon>
                <v-icon v-text="'mdi-minus'" />
              </v-list-item-icon>
              <v-list-item-title>
                inhibitory
              </v-list-item-title>
            </v-list-item>
          </v-list>

          <v-card-actions>
            <v-btn @click="back" text>
              <v-icon left v-text="'mdi-menu-left'" /> back
            </v-btn>
          </v-card-actions>
        </span>

        <span v-if="state.content === 'nodeDelete'">
          <v-card-title>
            Are you sure to delete node?
          </v-card-title>

          <v-card-actions>
            <v-btn @click="back" text>
              <v-icon left v-text="'mdi-menu-left'" /> no
            </v-btn>
            <v-btn @click="deleteNode" text>yes</v-btn>
          </v-card-actions>
        </span>
      </v-card>
    </v-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive, watch } from '@vue/composition-api';

import { Node } from '@/core/node/node';
import ModelDocumentation from '@/components/model/ModelDocumentation.vue';

export default Vue.extend({
  name: 'NetworkParamEdit',
  components: {
    ModelDocumentation,
  },
  props: {
    node: Node,
    position: Object,
  },
  setup(props) {
    const state = reactive({
      content: null,
      node: props.node as Node,
      position: props.position,
      show: true,
      items: [
        {
          id: 'paramsSelect',
          icon: 'mdi-checkbox-marked-outline',
          title: 'Set parameter view',
          onClick: () => {
            state.content = 'paramsSelect';
            window.dispatchEvent(new Event('resize'));
          },
          append: true,
        },

        {
          id: 'setWeights',
          icon: 'mdi-contrast',
          title: 'Set all synaptic weights',
          onClick: () => {
            state.content = 'nodeWeights';
          },
          append: true,
        },
        {
          id: 'paramsReset',
          icon: 'mdi-restart',
          title: 'Reset parameters',
          onClick: () => {
            state.node.resetParameters();
            state.show = false;
          },
          append: false,
        },
        {
          id: 'nodeColor',
          icon: 'mdi-format-color-fill',
          title: 'Colorize node',
          onClick: () => {
            state.content = 'nodeColor';
            window.dispatchEvent(new Event('resize'));
          },
          append: true,
        },
        {
          id: 'modelDescription',
          icon: 'mdi-information-outline',
          title: 'Model documentation',
          onClick: () => {
            state.content = 'modelDocumentation';
            setTimeout(() => {
              window.dispatchEvent(new Event('resize'));
            }, 300);
          },
        },
        {
          id: 'setSpatial',
          icon: 'mdi-axis-arrow',
          title: 'Toggle spatial',
          onClick: () => {
            state.node.initSpatial(
              state.node.spatial.hasPositions() ? {} : { numDimensions: 2 }
            );
            state.show = false;
          },
          append: false,
        },
        {
          id: 'nodeDelete',
          icon: 'mdi-trash-can-outline',
          title: 'Delete node',
          onClick: () => {
            state.content = 'nodeDelete';
          },
          append: false,
        },
      ],
    });

    /**
     * Update colors of network and activity.
     */
    const updateColor = () => {
      state.node.network.networkChanges();
      state.node.network.project.activityGraph.updateColor();
    };

    /**
     * Reset node color.
     */
    const resetColor = () => {
      state.node.view.color = null;
      updateColor();
    };

    /**
     * Triggers when parameter is changed.
     */
    const paramChange = () => {
      state.node.nodeChanges();
    };

    /**
     * Delete node.
     */
    const deleteNode = () => {
      state.show = false;
      state.node.remove();
    };

    /**
     * Set weigths of all connection in this node.
     */
    const setWeights = (mode: string) => {
      state.node.setWeights(mode);
      state.show = false;
    };

    /**
     * Return to main menu content.
     */
    const back = () => {
      state.content = null;
    };

    watch(
      () => [props.node, props.position],
      () => {
        state.content = null;
        state.show = true;
        state.node = props.node as Node;
        state.position = props.position;
      }
    );

    return {
      back,
      deleteNode,
      paramChange,
      resetColor,
      setWeights,
      state,
      updateColor,
    };
  },
});
</script>

<style>
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

.v-list-item__action {
  margin: 0;
}
</style>
