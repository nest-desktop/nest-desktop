<template>
  <div class="connectionParamEdit" v-if="state.connection">
    <v-select
      :items="connection.config.rules"
      @change="paramChange()"
      dense
      hide-details
      item-value="value"
      item-text="label"
      label="Connection rule"
      class="ml-1 pa-1"
      v-model="state.connection.rule"
    />

    <ParameterEdit
      :color="state.connection.source.view.color"
      :key="'conn' + state.connection.idx + '-' + param.id"
      :options="param"
      :value.sync="param.value"
      @update:value="paramChange"
      v-for="param in state.connection.filteredParams"
    />

    <ParameterEdit
      :color="state.connection.source.view.color"
      :key="'syn' + state.connection.idx + '-' + param.id"
      :param="param"
      :value.sync="param.value"
      @update:value="paramChange"
      v-for="param in state.connection.synapse.filteredParams"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive, watch, onMounted } from '@vue/composition-api';

import { Connection } from '@/core/connection/connection';
import ParameterEdit from '@/components/parameter/ParameterEdit.vue';

export default Vue.extend({
  name: 'ConnectionParamsEdit',
  components: {
    ParameterEdit,
  },
  props: {
    connection: Connection,
  },
  setup(props) {
    const state = reactive({
      connection: props.connection as Connection,
    });

    /**
     * Triggers when connection parameter is changed.
     */
    const paramChange = () => {
      state.connection.connectionChanges();
    };

    const update = () => {
      state.connection = props.connection as Connection;
    };

    onMounted(() => {
      update();
    });

    watch(
      () => props.connection,
      () => {
        update();
      }
    );

    return {
      paramChange,
      state,
    };
  },
});
</script>
