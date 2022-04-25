<template>
  <div class="synapseParamEdit" v-if="state.synapse">
    <SynapseModelSelect
      :synapse="state.synapse"
      v-if="
        state.synapse.models.length > 1 &&
        state.synapse.connection.view.connectOnlyNeurons()
      "
    />

    <ParameterEdit
      :color="state.synapse.connection.source.view.color"
      :key="'syn' + state.synapse.connection.idx + '-' + param.id"
      :param="param"
      :value.sync="param.value"
      @update:value="paramChange"
      v-for="param in state.synapse.filteredParams"
    />

    <v-select
      :color="state.synapse.connection.source.view.color"
      :items="state.synapse.connection.target.receptors"
      @update:value="paramChange"
      class="ma-2"
      item-text="label"
      dense
      hide-details
      item-value="idx"
      label="receptor type"
      v-model="state.synapse.receptorIdx"
      v-show="!state.synapse.connection.source.model.isRecorder"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { onMounted, reactive, watch } from '@vue/composition-api';

import { Synapse } from '@/core/synapse/synapse';
import ParameterEdit from '@/components/parameter/ParameterEdit.vue';
import SynapseModelSelect from '@/components/synapse/SynapseModelSelect.vue';

export default Vue.extend({
  name: 'SynapseParamEdit',
  components: {
    ParameterEdit,
    SynapseModelSelect,
  },
  props: {
    synapse: Synapse,
  },
  setup(props) {
    const state = reactive({
      compIdx: -1,
      synapse: props.synapse as Synapse,
    });

    /**
     * Triggers when synapse parameter is changed.
     */
    const paramChange = () => {
      state.synapse.synapseChanges();
    };

    const update = () => {
      state.synapse = props.synapse as Synapse;
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
