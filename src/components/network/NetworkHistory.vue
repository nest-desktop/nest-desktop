<template>
  <div class="networkHistory">
    <v-btn-toggle dense group>
      <v-btn
        :disabled="projectView.countBefore() <= 0"
        @click="projectView.state.project.network.oldest()"
        class="mx-0"
      >
        <v-icon v-text="'mdi-page-first'" />
      </v-btn>

      <v-btn
        :disabled="projectView.countBefore() <= 0"
        @click="projectView.state.project.network.older()"
        class="mx-0"
      >
        <v-badge
          :content="projectView.countBefore()"
          :value="projectView.countBefore()"
          color="project darken-1"
          offset-y="8"
        >
          <v-icon v-text="'mdi-undo-variant'" />
        </v-badge>
      </v-btn>

      <v-btn
        :disabled="projectView.countAfter() <= 0"
        @click="projectView.state.project.network.newer()"
        class="mx-0"
      >
        <v-badge
          :content="projectView.countAfter()"
          :value="projectView.countAfter()"
          color="project darken-1"
          offset-y="8"
        >
          <v-icon v-text="'mdi-redo-variant'" />
        </v-badge>
      </v-btn>

      <v-btn
        :disabled="projectView.countAfter() <= 0"
        @click="projectView.state.project.network.newest()"
        class="mx-0"
      >
        <v-icon v-text="'mdi-page-last'" />
      </v-btn>
    </v-btn-toggle>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import core from '@/core';

export default Vue.extend({
  name: 'NetworkHistory',
  setup() {
    return {
      projectView: core.app.project.view,
    };
  },
});
</script>
