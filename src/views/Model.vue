<template>
  <div model="model" v-if="state.model">
    <v-app-bar app clipped-left color="model" dark dense flat>
      <v-toolbar-title>
        <v-icon class="ma-2">mdi-engine-outline</v-icon>
        {{ state.model.label }}
      </v-toolbar-title>
    </v-app-bar>

    <v-main>
      <ModelDocumentation :id="state.modelId" />
    </v-main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { onMounted, reactive, watch } from '@vue/composition-api';
import ModelDocumentation from '@/components/model/ModelDocumentation.vue';
import core from '@/core/index';

export default Vue.extend({
  name: 'Model',
  components: {
    ModelDocumentation,
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
      id => {
        state.modelId = id as string;
        state.model = core.app.getModel(state.modelId);
      }
    );
    return { state };
  },
});
</script>
