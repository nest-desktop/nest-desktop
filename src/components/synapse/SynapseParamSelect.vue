<template>
  <div class="synapseParamSelect">
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
          v-for="param of state.synapse.params"
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
                :color="state.synapse.connection.source.view.color"
                :input-value="active"
                class="shrink mr-2"
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

import { Synapse } from '@/core/synapse/synapse';
import { SynapseParameter } from '@/core/synapse/synapseParameter';

export default Vue.extend({
  name: 'SynapseParamSelect',
  props: {
    synapse: Synapse,
    paramsIdx: Array,
  },
  setup(props) {
    const state = reactive({
      synapse: props.synapse as Synapse,
      paramsIdx: (props.paramsIdx as Number[]) || [],
    });

    /**
     * Triggers when parameter is changed.
     */
    const selectionChange = () => {
      state.synapse.params.forEach(
        (param: SynapseParameter) =>
          (param.state.visible = state.paramsIdx.includes(param.idx))
      );
      state.synapse.synapseChanges();
    };

    /**
     * Set an array of visible parameters for checkbox.
     */
    const update = () => {
      state.paramsIdx = state.synapse.params
        .filter((param: SynapseParameter) => param.visible)
        .map((param: SynapseParameter) => param.idx);
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
