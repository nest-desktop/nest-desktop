<template>
  <div class="backendStatus">
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-chip
          @click="check()"
          class="pr-0"
          label
          outlined
          v-bind="attrs"
          v-on="on"
          x-small
        >
          {{ state.backend.text }}
          <v-icon
            :color="isReady() ? 'green' : 'red'"
            v-text="'mdi-circle-medium'"
          />
        </v-chip>
      </template>
      <div class="text-no-wrap">
        The backend {{ state.backend.text }} is
        <span v-if="!isReady()" v-text="'not'" />
        running.
      </div>
    </v-tooltip>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive } from '@vue/composition-api';

import core from '@/core';

export default Vue.extend({
  name: 'BackendStatus',
  props: {
    backend: Object,
  },
  setup(props) {
    const state = reactive({
      backend: props.backend,
    });

    const check = () => {
      core.app.backends[state.backend['id']].check().then(() => {
        if (state.backend['id'] === 'nestSimulator') {
          core.app.model.fetchModelsNEST();
        }
      });
    };

    const isReady = () => core.app.backends[state.backend['id']].state.ready;

    return { check, core, isReady, state };
  },
});
</script>

<style>
.backendStatus {
  height: 18px;
  line-height: 18px;
}
</style>
