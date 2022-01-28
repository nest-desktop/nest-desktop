<template>
  <div class="nodeMenu" v-if="state.node">
    <v-menu
      :close-on-content-click="false"
      :position-x="state.position.x"
      :position-y="state.position.y"
      :value="state.show"
      transition="slide-y-transition"
    >
      <v-card :color="state.node.view.color" flat style="min-width: 300px" tile>
        <v-card-title class="pa-0">
          <v-row no-gutters>
            <v-col cols="12">
              <NodeModelSelect :node="state.node" />
            </v-col>
          </v-row>
        </v-card-title>

        <span v-if="state.content == undefined">
          <v-list dense>
            <v-list-item>
              <v-list-item-icon>
                <v-icon v-text="'mdi-contrast'" />
              </v-list-item-icon>
              <v-list-item-title v-text="'Set all synaptic weights'" />

              <v-btn-toggle
                :color="state.node.view.color"
                :value="state.weight[state.node.view.weight]"
                class="synWeightButton"
                dense
                group
                rounded
              >
                <v-btn
                  @click="state.node.setWeights('inhibitory')"
                  icon
                  small
                  title="inhibitory"
                >
                  <v-icon small v-text="'mdi-minus'" />
                </v-btn>

                <v-btn
                  @click="state.node.setWeights('excitatory')"
                  icon
                  small
                  title="excitatory"
                >
                  <v-icon small v-text="'mdi-plus'" />
                </v-btn>
              </v-btn-toggle>
            </v-list-item>

            <v-list-item
              :key="index"
              @click="item.onClick"
              v-for="(item, index) in state.items"
              v-show="item.show()"
            >
              <v-list-item-icon>
                <v-icon v-text="item.icon" />
              </v-list-item-icon>
              <v-list-item-title v-text="item.title" />

              <v-list-item-action v-if="item.append">
                <v-icon small v-text="'mdi-menu-right'" />
              </v-list-item-action>
              <v-list-item-action v-if="item.input === 'checkbox'">
                <v-checkbox
                  :input-value="state[item.value]"
                  :color="state.node.view.color"
                />
              </v-list-item-action>
              <v-list-item-action v-if="item.input === 'switch'">
                <v-switch
                  :color="state.node.view.color"
                  :value="state[item.value]"
                  dense
                  hide-details
                />
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </span>

        <span v-if="state.content === 'nodeParamEdit'">
          <v-card-text class="py-1 px-0">
            <NodeParamEdit :node="state.node" />
          </v-card-text>

          <v-card-actions>
            <v-btn @click="backMenu" outlined small text>
              <v-icon left v-text="'mdi-menu-left'" /> back
            </v-btn>
          </v-card-actions>
        </span>

        <span v-if="state.content === 'nodeColor'">
          <v-color-picker
            @update:color="nodeColorChange"
            flat
            show-swatches
            style="border-radius: 0"
            v-model="state.node.view.color"
          />

          <v-card-actions>
            <v-btn @click="backMenu" outlined small text>
              <v-icon left v-text="'mdi-menu-left'" /> back
            </v-btn>
            <v-spacer />
            <v-btn @click="resetColor" outlined small text v-text="'reset'" />
          </v-card-actions>
        </span>

        <span v-if="state.content === 'modelDocumentation'">
          <ModelDocumentation :id="state.node.modelId" />
        </span>

        <span v-if="state.content === 'nodeDelete'">
          <v-card-title v-text="'Are you sure to delete this node?'" />

          <v-card-actions>
            <v-btn @click="backMenu" outlined small text>
              <v-icon left v-text="'mdi-menu-left'" /> back
            </v-btn>
            <v-spacer />
            <v-btn
              @click="deleteNode"
              outlined
              small
              v-text="'delete'"
            />
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
import NodeModelSelect from '@/components/node/NodeModelSelect.vue';
import NodeParamEdit from '@/components/node/NodeParamEdit.vue';

export default Vue.extend({
  name: 'NetworkNodeMenu',
  components: {
    ModelDocumentation,
    NodeModelSelect,
    NodeParamEdit,
  },
  props: {
    node: Node,
    position: Object, // Menu position
  },
  setup(props) {
    const state = reactive({
      content: undefined as string | undefined,
      node: props.node as Node,
      position: props.position,
      show: true,
      spatialNode: false,
      visibleParams: [],
      weight: {
        excitatory: 1,
        inhibitory: 0,
        mixed: null,
      },
      items: [
        {
          icon: 'mdi-axis-arrow',
          id: 'nodeSpatial',
          input: 'switch',
          onClick: () => {
            state.node.toggleSpatial();
            state.spatialNode = state.node.spatial.hasPositions();
          },
          show: () => !state.node.model.isRecorder(),
          title: 'Spatial node',
          value: 'spatialNode',
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
          (param.state.visible = state.visibleParams.includes(param.idx))
      );
      state.node.nodeChanges();
    };

    /**
     * Update colors of network and activity.
     */
    const nodeColorChange = () => {
      state.node.network.networkChanges();
      state.node.network.updateRecordsColor();
    };

    /**
     * Reset node color.
     */
    const resetColor = () => {
      state.node.view.color = null;
      nodeColorChange();
    };

    /**
     * Delete node.
     */
    const deleteNode = () => {
      state.node.remove();
      closeMenu();
    };

    /**
     * Set weights of all connection in this node.
     */
    const setWeights = (mode: string) => {
      state.node.setWeights(mode);
      closeMenu();
    };

    /**
     * Set an array of visible parameters for checkbox.
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
      state.content = undefined;
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
      state.content = undefined;
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
      nodeColorChange,
      paramChange,
      resetColor,
      selectionChange,
      setWeights,
      showAllParams,
      state,
    };
  },
});
</script>

<style>
.synWeightButton {
  border: 1px solid rgba(0, 0, 0, 0.12);
}
</style>
