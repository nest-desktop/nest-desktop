<template>
  <div class="connectionParamEdit" v-if="state.connection">
    <v-row class="mx-1 my-2" v-if="state.connection.sourceSlice.visible">
      <v-col
        :cols="4"
        :key="'conn' + state.connection.idx + '-' + param.id"
        class="pa-1"
        v-for="param in state.connection.sourceSlice.params"
      >
        <v-card @dblclick="enableSliceParam(param)" flat>
          <v-text-field
            :disabled="param.state.disabled"
            :label="'source ' + param.label"
            @change="paramChange"
            dense
            hide-details
            type="number"
            v-model="param.value"
          />
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mx-1 my-2" v-if="state.connection.targetSlice.visible">
      <v-col
        :cols="4"
        :key="'conn' + state.connection.idx + '-' + param.id"
        class="pa-1"
        v-for="param in state.connection.targetSlice.params"
      >
        <v-card @dblclick="enableSliceParam(param)" flat>
          <v-text-field
            :disabled="param.state.disabled"
            :label="'target ' + param.label"
            @change="paramChange"
            dense
            hide-details
            type="number"
            v-model="param.value"
          />
        </v-card>
      </v-col>
    </v-row>

    <v-select
      :items="connection.config.rules"
      @change="paramChange()"
      dense
      hide-details
      item-value="value"
      item-text="label"
      label="connection rule"
      class="px-2 py-3"
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive, watch, onMounted } from '@vue/composition-api';

import { Connection } from '@/core/connection/connection';
import { Parameter } from '@/core/parameter/parameter';
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

    const enableSliceParam = (param: Parameter) => {
      param.state.disabled = false;

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

    return { enableSliceParam, paramChange, state };
  },
});
</script>
