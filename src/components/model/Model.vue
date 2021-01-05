<template>
  <div class="model">
    <v-app-bar app clipped-left color="model" dark dense flat>
      <v-toolbar-title>
        <v-icon class="ma-2">mdi-engine-outline</v-icon>
        {{ state.label }}
      </v-toolbar-title>
    </v-app-bar>
  </div>
</template>

<script>
import Vue from 'vue';
import { reactive, watch } from '@vue/composition-api';
import core from '@/core/index';

export default Vue.extend({
  name: 'Model',
  props: {
    id: String,
  },
  setup(props) {
    const model = core.app.getModel(props.id);
    const state = reactive({
      label: model.label,
    });
    watch(
      () => props.id,
      id => {
        const model = core.app.getModel(id);
        state.label = model.label;
      }
    );
    return { state };
  },
});
</script>
