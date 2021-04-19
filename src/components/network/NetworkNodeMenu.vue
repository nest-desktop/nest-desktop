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
              <v-list-item-title v-text="item.title" />

              <v-list-item-action v-if="item.append">
                <v-icon small v-text="'mdi-menu-right'" />
              </v-list-item-action>
              <v-list-item-action v-if="item.input === 'checkbox'">
                <v-checkbox :input-value="state[item.value]" />
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
          />

          <v-card-actions>
            <v-btn @click="backMenu" text>
              <v-icon left v-text="'mdi-menu-left'" /> back
            </v-btn>
            <v-btn @click="resetColor" text v-text="'reset'" />
          </v-card-actions>
        </span>

        <span v-if="state.content === 'modelDocumentation'">
          <ModelDocumentation :id="state.node.modelId" />
        </span>

        <span v-if="state.content === 'paramsSelect'">
          <v-list dense>
            <v-list-item-group
              @change="selectionChange"
              active-class=""
              multiple
              v-model="state.visibleParams"
            >
              <v-list-item
                :key="param.id"
                class="mx-0"
                style="font-size:12px;"
                v-for="param of state.node.params"
              >
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
                      color="black"
                      hide-details
                    />
                  </v-list-item-action>
                </template>
              </v-list-item>
            </v-list-item-group>
          </v-list>

          <v-card-actions>
            <v-btn @click="backMenu" text>
              <v-icon left v-text="'mdi-menu-left'" /> back
            </v-btn>
            <v-btn @click="hideAllParams" text v-text="'none'" />
            <v-btn @click="showAllParams" text v-text="'all'" />
          </v-card-actions>
        </span>

        <span v-if="state.content === 'nodeWeights'">
          <v-list dense>
            <v-list-item @click="setWeights('excitatory')">
              <v-list-item-icon>
                <v-icon v-text="'mdi-plus'" />
              </v-list-item-icon>
              <v-list-item-title v-text="'excitatory'" />
            </v-list-item>

            <v-list-item @click="setWeights('inhibitory')">
              <v-list-item-icon>
                <v-icon v-text="'mdi-minus'" />
              </v-list-item-icon>
              <v-list-item-title v-text="'inhibitory'" />
            </v-list-item>
          </v-list>

          <v-card-actions>
            <v-btn @click="backMenu" text>
              <v-icon left v-text="'mdi-menu-left'" /> back
            </v-btn>
          </v-card-actions>
        </span>

        <span v-if="state.content === 'nodeDelete'">
          <v-card-title v-text="'Are you sure to delete node?'" />

          <v-card-actions>
            <v-btn @click="backMenu" text>
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
import { reactive, onMounted } from '@vue/composition-api';

import { Node } from '@/core/node/node';
import { ModelParameter } from '@/core/parameter/modelParameter';
import ModelDocumentation from '@/components/model/ModelDocumentation.vue';

export default Vue.extend({
  name: 'NetworkNodeMenu',
  components: {
    ModelDocumentation,
  },
  props: {
    node: Node,
    position: Object, // Menu position
  },
  setup(props) {
    const state = reactive({
      content: null,
      node: props.node as Node,
      position: props.position,
      show: true,
      spatialNode: false,
      visibleParams: [],
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
          id: 'paramsReset',
          icon: 'mdi-restart',
          title: 'Reset parameters',
          onClick: () => {
            state.node.resetParameters();
            closeMenu();
          },
          append: false,
        },
        {
          id: 'nodeSpatial',
          icon: 'mdi-axis-arrow',
          input: 'checkbox',
          title: 'Spatial node',
          value: 'spatialNode',
          onClick: () => {
            state.node.toggleSpatial();
            state.spatialNode = state.node.spatial.hasPositions();
            closeMenu();
          },
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
          id: 'setWeights',
          icon: 'mdi-contrast',
          title: 'Set all synaptic weights',
          onClick: () => {
            state.content = 'nodeWeights';
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
        // {
        //   id: 'eventsDownload',
        //   icon: 'mdi-download',
        //   title: 'Download events',
        //   onClick: () => {
        //     state.node.activity.downloadEvents();
        //     closeMenu();
        //   },
        // },
        {
          id: 'nodeClone',
          icon: 'mdi-content-copy',
          title: 'Clone node',
          onClick: () => {
            const newNode: any = JSON.parse(
              JSON.stringify(state.node.toJSON())
            );
            newNode.view.position.x += 50;
            newNode.view.color = undefined;
            state.node.network.addNode(newNode);
            state.node.network.networkChanges();
            closeMenu();
          },
        },
        {
          id: 'nodeDelete',
          icon: 'mdi-trash-can-outline',
          title: 'Delete node',
          onClick: () => {
            state.content = 'nodeDelete';
          },
        },
      ],
    });

    /**
     * Triggers when parameter is changed.
     */
    const paramChange = () => {
      state.node.nodeChanges();
    };

    /**
     * Triggers when parameter is changed.
     */
    const selectionChange = () => {
      state.node.params.forEach(
        (param: ModelParameter) =>
          (param.visible = state.visibleParams.includes(param.idx))
      );
      state.node.nodeChanges();
    };

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
     * Delete node.
     */
    const deleteNode = () => {
      state.node.remove();
      closeMenu();
    };

    /**
     * Set weigths of all connection in this node.
     */
    const setWeights = (mode: string) => {
      state.node.setWeights(mode);
      closeMenu();
    };

    /**
     * Set an array of visible parameter for checkbox.
     */
    const setVisibleParams = () => {
      state.visibleParams = state.node.params
        .filter((param: ModelParameter) => param.visible)
        .map((param: ModelParameter) => param.idx);
    };

    const showAllParams = () => {
      state.node.showAllParams();
      setVisibleParams();
    };

    const hideAllParams = () => {
      state.node.hideAllParams();
      setVisibleParams();
    };

    /**
     * Reset states.
     */
    const resetStates = () => {
      state.content = null;
      state.show = true;
    };

    /**
     * Update states.
     */
    const updateStates = () => {
      state.spatialNode = state.node.spatial.hasPositions();
      setVisibleParams();
    };

    /**
     * Return to main menu content.
     */
    const backMenu = () => {
      state.content = null;
    };

    /**
     * Close menu.
     */
    const closeMenu = () => {
      resetStates();
      state.show = false;
    };

    onMounted(() => {
      resetStates();
      updateStates();
    });

    return {
      backMenu,
      deleteNode,
      hideAllParams,
      paramChange,
      resetColor,
      selectionChange,
      setWeights,
      showAllParams,
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
}

.v-list-item__action {
  margin: 0;
}
</style>
