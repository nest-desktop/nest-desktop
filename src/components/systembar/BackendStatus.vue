<template>
  <div class="backendStatus">
    <v-chip
      :disabled="!state.enabled"
      :title="state.title"
      @click="check()"
      class="pr-0"
      label
      outlined
      x-small
    >
      {{ state.backend.text }}
      <v-icon
        :color="state.enabled ? (state.ready ? 'green' : 'red') : 'grey'"
        v-text="'mdi-circle-medium'"
      />
    </v-chip>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { onMounted, reactive, watch } from '@vue/composition-api';

import core from '@/core';

export default Vue.extend({
  name: 'BackendStatus',
  props: {
    backend: Object,
  },
  setup(props) {
    const state = reactive({
      enabled: false,
      backend: props.backend,
      ready: false,
      title: '',
    });

    const getBackend = () => core.app.backends[state.backend['id']];

    const check = () => {
      getBackend()
        .check()
        .then(() => {
          if (state.backend['id'] === 'nestSimulator') {
            core.app.model.fetchModelsNEST();
          }
        })
        .finally(() => {
          update();
        });
    };

    const updateTitle = () => {
      state.title = `The backend ${state.backend['text']} is `;
      state.title += !state.enabled
        ? 'disabled.'
        : !state.ready
        ? 'not running.'
        : 'running.';
    };

    const update = () => {
      const backend = getBackend();
      state.enabled = backend.enabled;
      state.ready = backend.state.ready;
      updateTitle();
    };

    watch(() => {
      const backendState = getBackend().state;
      return [backendState.enabled, backendState.ready];
    }, update);

    onMounted(update);

    return { check, core, state };
  },
});
</script>

<style>
.backendStatus {
  height: 18px;
  line-height: 18px;
}
</style>
