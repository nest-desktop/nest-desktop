<template>
  <div class="connectionParamSelect">
    <v-list class="pa-0" dense>
      <v-list-item-group
        @change="selectionChange"
        active-class=""
        multiple
        v-model="state.paramsIdx"
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
                <v-col
                  class="d-flex justify-space-between"
                  v-html="param.labelRow"
                />
              </v-row>
            </v-list-item-content>

            <v-list-item-action class="mx-0 my-1">
              <v-checkbox
                :color="state.connection.source.view.color"
                :input-value="active"
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
import { onMounted, reactive, watch } from '@vue/composition-api';

import { Connection } from '@/core/connection/connection';
import { Parameter } from '@/core/parameter/parameter';

export default Vue.extend({
  name: 'ConnectionParamSelect',
  props: {
    connection: Connection,
    paramsIdx: Array,
  },
  setup(props) {
    const state = reactive({
      connection: props.connection as Connection,
      paramsIdx: (props.paramsIdx as Number[]) || [],
    });

    /**
     * Triggers when parameter is changed.
     */
    const selectionChange = () => {
      state.connection.params.forEach(
        (param: Parameter) =>
          (param.state.visible = state.paramsIdx.includes(param.idx))
      );
      state.connection.connectionChanges();
    };

    /**
     * Set an array of visible parameter for checkbox.
     */
    const update = () => {
      state.paramsIdx = state.connection.params
        .filter((param: Parameter) => param.visible)
        .map((param: Parameter) => param.idx);
    };

    onMounted(() => {
      update();
    });

    watch(
      () => props.paramsIdx,
      () => {
        state.paramsIdx = props.paramsIdx as Number[];
      }
    );

    return {
      selectionChange,
      state,
    };
  },
});
</script>
