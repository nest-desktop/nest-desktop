<template>
  <div class="backendStatus">
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-chip label outlined x-small class="pr-0" v-bind="attrs" v-on="on">
          {{ state.backend.text }}
          <v-icon
            :color="
              core.app.backends[state.backend.id].state.ready ? 'green' : 'red'
            "
            v-text="'mdi-circle-medium'"
          />
        </v-chip>
      </template>
      <div class="text-no-wrap">
        The backend {{ state.backend.text }} is
        <span
          v-if="!core.app.backends[state.backend.id].state.ready"
          v-text="'not'"
        />
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

    return { core, state };
  },
});
</script>

<style>
.backendStatus {
  height: 18px;
  line-height: 18px;
}
</style>
