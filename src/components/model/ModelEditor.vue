<template>
  <div class="modelEditor">
    <v-container>
      <v-card class="ma-2">
        <v-card-title v-text="state.model.label" />
        <v-card-text>
          <ParameterEdit
            :key="param.id"
            :param="param"
            :value.sync="param.value"
            v-for="param of state.model.params"
          />
        </v-card-text>
      </v-card>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { onMounted, reactive, watch } from '@vue/composition-api';

import ParameterEdit from '@/components/parameter/ParameterEdit.vue';

import core from '@/core';

/**
 * Model editor to configure models.
 */
export default Vue.extend({
  name: 'ModelEditor',
  components: {
    ParameterEdit,
  },
  props: {
    id: String,
  },
  setup(props) {
    const state = reactive({
      modelId: '',
      model: {},
    });

    onMounted(() => {
      state.modelId = props.id as string;
      state.model = core.app.getModel(state.modelId);
    });

    watch(
      () => props.id,
      (id: string) => {
        state.modelId = id as string;
        state.model = core.app.getModel(state.modelId);
      }
    );
    return { state };
  },
});
</script>
