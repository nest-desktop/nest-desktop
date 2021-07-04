<template>
  <div class="connectionMenu" v-if="state.connection">
    <v-menu
      :close-on-content-click="false"
      :position-x="state.position.x"
      :position-y="state.position.y"
      :value="state.show"
      transition="slide-y-transition"
    >
      <v-card tile flat style="min-width: 300px">
        <!-- <v-card-title
          :style="{ backgroundColor: state.connection.source.view.color }"
          class="py-1"
          style="color:white; height:40px"
        >
        </v-card-title> -->

        <span v-if="state.content === undefined">
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

              <v-list-item-action v-show="item.append">
                <v-icon v-text="'mdi-menu-right'" />
              </v-list-item-action>
              <v-list-item-action v-if="item.input === 'checkbox'">
                <v-checkbox :input-value="state[item.value]" />
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </span>

        <span v-if="state.content === 'paramSelect'">
          <v-card-text class="pa-0">
            <ConnectionParamSelect
              :connection="state.connection"
              :visibleParams="state.visibleParams"
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
          <v-card-text class="px-0">
            <ConnectionParamEdit :connection="state.connection" />
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

export default Vue.extend({
  name: 'ConnectionMenu',
  components: {
    ConnectionParamEdit,
    ConnectionParamSelect,
  },
  props: {
    connection: Connection,
    position: Object,
  },
  setup(props) {
    const state = reactive({
      content: undefined as string | undefined,
      connection: props.connection as Connection,
      position: props.position,
      visibleParams: { connection: [], synapse: [] },
      show: true,
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
        },
        {
          id: 'connectionReverse',
          icon: 'mdi-rotate-3d-variant',
          title: 'Reverse connection',
          onClick: () => {
            state.connection.reverse();
            closeMenu();
          },
        },
        {
          id: 'connectionReverse',
          icon: 'mdi-contrast',
          title: 'Inverse synaptic weight',
          onClick: () => {
            state.connection.synapse.inverseWeight();
            closeMenu();
          },
        },
        {
          id: 'connectionReset',
          icon: 'mdi-restart',
          title: 'Reset connection',
          onClick: () => {
            state.connection.reset();
            closeMenu();
          },
        },
        {
          id: 'connectionDelete',
          icon: 'mdi-trash-can-outline',
          title: 'Delete connection',
          onClick: () => {
            state.content = 'connectionDelete';
          },
          append: true,
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
          (param.visible = state.visibleParams.connection.includes(param.idx))
      );
      state.connection.synapse.params.forEach(
        (param: ModelParameter) =>
          (param.visible = state.visibleParams.synapse.includes(param.idx))
      );
      state.connection.connectionChanges();
    };

    /**
     * Set an array of visible parameter for checkbox.
     */
    const setVisibleParams = () => {
      state.visibleParams.connection = state.connection.params
        .filter((param: Parameter) => param.visible)
        .map((param: Parameter) => param.idx);
      state.visibleParams.synapse = state.connection.synapse.params
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
      state.content = null;
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
      resetAllParams,
      showAllParams,
      selectionChange,
      state,
    };
  },
});
</script>
