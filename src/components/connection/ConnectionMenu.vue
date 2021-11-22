<template>
  <div class="connectionMenu" v-if="state.connection">
    <v-menu
      :close-on-content-click="false"
      :position-x="state.position.x"
      :position-y="state.position.y"
      :value="state.show"
      transition="slide-y-transition"
    >
      <v-card tile flat style="background-color: white; min-width: 300px">
        <v-card-title class="pa-0">
          <v-row no-gutters>
            <v-col cols="3" class="py-0" style="text-align: center">
              <v-btn
                :color="connection.source.view.color"
                :dark="projectView.config.coloredToolbar"
                :text="!projectView.config.coloredToolbar"
                block
                depressed
                height="40"
                tile
                v-text="connection.source.view.label"
              />
            </v-col>
            <v-col cols="6">
              <v-btn block color="white" depressed height="40" tile>
                <v-chip
                  label
                  outlined
                  small
                  v-if="connection.network.project.app.config.devMode"
                  v-text="connection.hash.slice(0, 6)"
                />
                <v-icon v-text="'mdi-arrow-right-bold-outline'" />
              </v-btn>
            </v-col>
            <v-col cols="3" class="py-0" style="text-align: center">
              <v-btn
                :color="connection.target.view.color"
                :dark="projectView.config.coloredToolbar"
                :text="!projectView.config.coloredToolbar"
                block
                depressed
                height="40"
                tile
                v-text="connection.target.view.label"
              />
            </v-col>
          </v-row>
        </v-card-title>

        <span v-if="state.content == undefined">
          <v-list dense>
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

              <v-list-item-action v-show="item.append">
                <v-icon small v-text="'mdi-menu-right'" />
              </v-list-item-action>
              <v-list-item-action v-if="item.input === 'checkbox'">
                <v-checkbox :input-value="state[item.value]" />
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </span>

        <span v-if="state.content === 'paramSelect'">
          <v-card-text class="px-0 py-1">
            <ConnectionParamSelect
              :connection="state.connection"
              :paramsIdx="state.connectionParamsIdx"
            />
            <SynapseParamSelect
              :synapse="state.connection.synapse"
              :paramsIdx="state.synapseParamsIdx"
            />
          </v-card-text>

          <v-card-actions>
            <v-btn @click="backMenu" outlined small text>
              <v-icon left v-text="'mdi-menu-left'" /> back
            </v-btn>
            <v-spacer />
            <v-btn @click="hideAllParams" outlined small text v-text="'none'" />
            <v-btn @click="showAllParams" outlined small text v-text="'all'" />
          </v-card-actions>
        </span>

        <span v-if="state.content === 'paramEdit'">
          <v-card-text class="px-0" style="max-width: 300px">
            <ConnectionParamEdit :connection="state.connection" />
            <SynapseParamEdit :synapse="state.connection.synapse" />
          </v-card-text>

          <v-card-actions>
            <v-btn @click="backMenu" outlined small text>
              <v-icon left v-text="'mdi-menu-left'" /> back
            </v-btn>
            <v-spacer />
            <v-btn
              @click="resetAllParams"
              outlined
              small
              text
              v-text="'reset'"
            />
          </v-card-actions>
        </span>

        <span v-if="state.content === 'connectionDelete'">
          <v-card-title v-text="'Are you sure to delete this connection?'" />

          <v-card-actions>
            <v-btn @click="backMenu" outlined small text>
              <v-icon left v-text="'mdi-menu-left'" /> back
            </v-btn>
            <v-spacer />
            <v-btn
              @click="deleteConnection"
              color="warning"
              outlined
              small
              text
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

import { Connection } from '@/core/connection/connection';
import { ModelParameter } from '@/core/parameter/modelParameter';
import { Parameter } from '@/core/parameter/parameter';
import ConnectionParamEdit from '@/components/connection/ConnectionParamEdit.vue';
import ConnectionParamSelect from '@/components/connection/ConnectionParamSelect.vue';
import core from '@/core';
import SynapseParamEdit from '@/components/synapse/SynapseParamEdit.vue';
import SynapseParamSelect from '@/components/synapse/SynapseParamSelect.vue';

export default Vue.extend({
  name: 'ConnectionMenu',
  components: {
    ConnectionParamEdit,
    ConnectionParamSelect,
    SynapseParamEdit,
    SynapseParamSelect,
  },
  props: {
    connection: Connection,
    position: Object,
  },
  setup(props) {
    const projectView = core.app.project.view;
    const state = reactive({
      connection: props.connection as Connection,
      connectionParamsIdx: [],
      content: undefined as string | undefined,
      position: props.position,
      show: true,
      synapseParamsIdx: [],
      items: [
        {
          id: 'paramSelect',
          icon: 'mdi-checkbox-marked-outline',
          title: 'Set parameter view',
          onClick: () => {
            state.content = 'paramSelect';
            window.dispatchEvent(new Event('resize'));
          },
          append: true,
          show: () => true,
        },
        {
          id: 'paramEdit',
          icon: 'mdi-pencil-outline',
          title: 'Edit parameter',
          onClick: () => {
            state.content = 'paramEdit';
            window.dispatchEvent(new Event('resize'));
          },
          append: true,
          show: () => true,
        },
        {
          id: 'connectionReverse',
          icon: 'mdi-rotate-3d-variant',
          title: 'Reverse connection',
          onClick: () => {
            state.connection.reverse();
            closeMenu();
          },
          show: () => true,
        },
        {
          id: 'sourceSlice',
          icon: 'mdi-code-brackets',
          title: 'Toggle source slicing',
          onClick: () => {
            state.connection.sourceSlice.toggleVisible();
            state.connection.connectionChanges();
            closeMenu();
          },
          show: () => state.connection.source.size > 1,
        },
        {
          id: 'targetSlice',
          icon: 'mdi-code-brackets',
          title: 'Toggle target slicing',
          onClick: () => {
            state.connection.targetSlice.toggleVisible();
            state.connection.connectionChanges();
            closeMenu();
          },
          show: () => state.connection.target.size > 1,
        },
        {
          id: 'synapticWeightInverse',
          icon: 'mdi-contrast',
          title: 'Inverse synaptic weight',
          onClick: () => {
            state.connection.synapse.inverseWeight();
            closeMenu();
          },
          show: () => true,
        },
        {
          id: 'connectionReset',
          icon: 'mdi-restart',
          title: 'Reset connection',
          onClick: () => {
            state.connection.reset();
            closeMenu();
          },
          show: () => true,
        },
        {
          id: 'connectionDelete',
          icon: 'mdi-trash-can-outline',
          title: 'Delete connection',
          onClick: () => {
            state.content = 'connectionDelete';
          },
          append: true,
          show: () => true,
        },
      ],
    });

    /**
     * Triggers when parameter is changed.
     */
    const paramChange = () => {
      state.connection.connectionChanges();
    };

    /**
     * Triggers when parameter is changed.
     */
    const selectionChange = () => {
      state.connection.params.forEach(
        (param: Parameter) =>
          (param.state.visible = state.connectionParamsIdx.includes(param.idx))
      );
      state.connection.synapse.params.forEach(
        (param: ModelParameter) =>
          (param.state.visible = state.synapseParamsIdx.includes(param.idx))
      );
      state.connection.connectionChanges();
    };

    /**
     * Set an array of visible parameter for checkbox.
     */
    const setVisibleParams = () => {
      state.connectionParamsIdx = state.connection.params
        .filter((param: Parameter) => param.visible)
        .map((param: Parameter) => param.idx);
      state.synapseParamsIdx = state.connection.synapse.params
        .filter((param: ModelParameter) => param.visible)
        .map((param: ModelParameter) => param.idx);
    };

    const showAllParams = () => {
      state.connection.showAllParams();
      state.connection.synapse.showAllParams();
      setVisibleParams();
    };

    const hideAllParams = () => {
      state.connection.hideAllParams();
      state.connection.synapse.hideAllParams();
      setVisibleParams();
    };

    const resetAllParams = () => {
      state.connection.resetAllParams();
    };

    /**
     * Delete connection.
     */
    const deleteConnection = () => {
      state.connection.remove();
      closeMenu();
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
      updateStates();
    });

    return {
      backMenu,
      deleteConnection,
      hideAllParams,
      paramChange,
      projectView,
      resetAllParams,
      selectionChange,
      showAllParams,
      state,
    };
  },
});
</script>
