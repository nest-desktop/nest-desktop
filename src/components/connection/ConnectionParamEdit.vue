<template>
  <div class="connectionParamEdit" v-if="state.connection">
    <v-row
      class="px-1"
      no-gutters
      v-if="
        state.connection.sourceSlice.visible ||
        state.connection.targetSlice.visible
      "
    >
      <v-col :cols="6">
        <span v-if="state.connection.sourceSlice.visible">
          <div class="mb-1 mx-1" style="font-size:12px" v-text="'Source'" />
          <v-row no-gutters>
            <v-col
              :cols="4"
              :key="'conn' + state.connection.idx + '-' + param.id"
              v-for="param in state.connection.sourceSlice.params"
            >
              <v-card @dblclick="enableSliceParam(param)" class="px-1" flat>
                <v-text-field
                  :disabled="param.state.disabled"
                  :label="param.label"
                  @change="paramChange"
                  dense
                  hide-details
                  type="number"
                  v-model="param.value"
                />
              </v-card>
            </v-col>
          </v-row>
        </span>
      </v-col>
      <v-col :cols="6">
        <span v-if="state.connection.targetSlice.visible">
          <div class="mb-1 mx-1" style="font-size:12px" v-text="'Target'" />
          <v-row no-gutters>
            <v-col
              :cols="4"
              :key="'conn' + state.connection.idx + '-' + param.id"
              v-for="param in state.connection.targetSlice.params"
            >
              <v-card @dblclick="enableSliceParam(param)" class="px-1" flat>
                <v-text-field
                  :disabled="param.state.disabled"
                  :label="param.label"
                  @change="paramChange"
                  dense
                  hide-details
                  type="number"
                  v-model="param.value"
                />
              </v-card>
            </v-col>
          </v-row>
        </span>
      </v-col>
    </v-row>

    <v-row class="py-4" no-gutters>
      <v-col>
        <v-select
          :items="connection.config.rules"
          @change="paramChange()"
          dense
          hide-details
          item-value="value"
          item-text="label"
          label="connection rule"
          class="px-2"
          v-model="state.connection.rule"
        />
      </v-col>
    </v-row>

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
