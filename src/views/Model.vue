<template>
  <div class="model" v-if="state.model">
    <v-app-bar app clipped-left color="model" dark dense flat>
      <v-toolbar-title>
        <v-icon class="ma-2">mdi-engine-outline</v-icon>
        {{ state.model.label }}
      </v-toolbar-title>
      <v-btn
        :href="state.url"
        absolute
        bottom
        fab
        light
        right
        small
        target="_blank"
        v-show="state.url.length > 0"
      >
        <v-icon v-text="'$github'" />
      </v-btn>
    </v-app-bar>

    <v-main>
      <ModelDocumentation :id="state.modelId" />
    </v-main>
  </div>
</template>

<script>
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
      url: '',
    });

    const reset = () => {
      state.url = '';
    };

    onMounted(() => {
      state.modelId = props.id;
      state.model = core.app.getModel(state.modelId);
      state.url = `https://raw.githubusercontent.com/nest/nest-simulator/master/models/${state.modelId}.h`;
    });

    watch(
      () => props.id,
      id => {
        state.modelId = id;
        state.model = core.app.getModel(state.modelId);
        state.url = `https://raw.githubusercontent.com/nest/nest-simulator/master/models/${state.modelId}.h`;
      }
    );
    return { state };
  },
});
</script>
