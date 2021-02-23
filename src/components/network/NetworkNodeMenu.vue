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
        >
        </v-card-title>

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
            v-show="param.visible || true"
          >
            <v-list>
              <v-row>
                <v-list-item style="font-size:12px; min-height:32px">
                  <template v-slot:default>
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
                        @change="paramChange"
                        class="shrink mr-2"
                        color="black"
                        hide-details
                        v-model="param.visible"
                      ></v-checkbox>
                    </v-list-item-action>
                  </template>
                </v-list-item>
              </v-row>
            </v-list>
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

<script>
import Vue from 'vue';
import { reactive, watch } from '@vue/composition-api';
import ModelDocumentation from '@/components/model/ModelDocumentation.vue';

export default Vue.extend({
  name: 'NetworkParamEdit',
  components: {
    ModelDocumentation,
  },
  props: {
    node: Object,
    position: Object,
  },
  setup(props, { root }) {
    const state = reactive({
      content: null,
      node: props.node,
      position: props.position,
      show: true,
      items: [
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
          id: 'setWeights',
          icon: 'mdi-dumbbell',
          title: 'Set weights',
          onClick: () => {
            state.content = 'nodeWeights';
          },
          append: true,
        },
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
          id: 'setSpatial',
          icon: 'mdi-axis-arrow',
          title: 'Set spatial',
          onClick: () => {
            state.node.initSpatial({ pos: [] });
            state.show = false;
          },
          append: false,
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

    const updateColor = () => {
      state.node.network.networkChanges();
      state.node.network.project.activityGraph.updateColor();
    };

    const resetColor = () => {
      state.node.view.color = null;
      updateColor();
    };

    const paramChange = () => {
      state.node.nodeChanges();
    };

    const setSpatial = () => {
      state.node.initSpatial({ pos: [] });
    };

    const deleteNode = () => {
      state.show = false;
      state.node.remove();
    };

    const setWeights = mode => {
      state.node.setWeights(mode);
      state.show = false;
    };

    const back = () => {
      state.content = null;
    };

    watch(
      () => props.node,
      () => {
        state.content = null;
        state.show = true;
        state.node = props.node;
        state.position = props.position;
      }
    );

    return {
      back,
      deleteNode,
      paramChange,
      resetColor,
      setSpatial,
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
