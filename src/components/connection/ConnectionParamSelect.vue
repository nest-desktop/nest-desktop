<template>
  <div class="connectionParamSelect">
    <v-list dense>
      <v-list-item-group
        @change="selectionChange"
        active-class=""
        multiple
        v-model="state.visibleParams.connection"
      >
        <v-list-item
          :key="param.id"
          class="mx-0"
          style="font-size: 12px"
          v-for="param of state.connection.params"
        >
          <template #default="{ active }">
            <v-list-item-content class="pa-1">
              <v-row no-gutters>
                {{ param.options.label }}
                <v-spacer />
                {{ param.toJSON().value }}
                {{ param.options.unit }}
              </v-row>
            </v-list-item-content>

            <v-list-item-action class="mx-0 my-1">
              <v-checkbox :input-value="active" color="black" hide-details />
            </v-list-item-action>
          </template>
        </v-list-item>
      </v-list-item-group>

      <v-list-item-group
        @change="selectionChange"
        active-class=""
        multiple
        v-model="state.visibleParams.synapse"
      >
        <v-list-item
          :key="param.id"
          class="mx-0"
          style="font-size: 12px"
          v-for="param of state.connection.synapse.params"
        >
          <template #default="{ active }">
            <v-list-item-content class="pa-1">
              <v-row no-gutters>
                {{ param.options.label }}
                <v-spacer />
                {{ param.toJSON().value }}
                {{ param.options.unit }}
              </v-row>
            </v-list-item-content>

            <v-list-item-action class="mx-0 my-1">
              <v-checkbox
                :input-value="active"
                class="shrink mr-2"
                color="black"
                hide-details
              />
            </v-list-item-action>
          </template>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive, onMounted } from '@vue/composition-api';

import { Connection } from '@/core/connection/connection';
import { ModelParameter } from '@/core/parameter/modelParameter';
import { Parameter } from '@/core/parameter/parameter';

type VisibleParams = {
  connection: Number[];
  synapse: Number[];
};

export default Vue.extend({
  name: 'ConnectionParamSelect',
  props: {
    connection: Connection,
    visibleParams: Object as () => VisibleParams,
  },
  setup(props) {
    const state = reactive({
      connection: props.connection as Connection,
      visibleParams: (props.visibleParams as VisibleParams) || {
        connection: [],
        synapse: [],
      },
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
    const update = () => {
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
      update();
    };

    const hideAllParams = () => {
      state.connection.hideAllParams();
      state.connection.synapse.hideAllParams();
      update();
    };

    onMounted(() => {
      update();
    });

    return {
      hideAllParams,
      paramChange,
      selectionChange,
      showAllParams,
      state,
    };
  },
});
</script>
