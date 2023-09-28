<template>
  <v-tabs stacked>
    <v-tab title="Edit network" size="small" to="edit">
      <v-icon icon="nest:network" />
      Editor
    </v-tab>
    <v-tab title="Explore activity" size="small" to="explore">
      <v-icon class="rotate-270" icon="mdi-border-style" />
      Explorer
    </v-tab>
    <v-tab title="Lab book" size="small" to="lab">
      <v-icon icon="mdi-book-open-outline" />
      Lab book
    </v-tab>
  </v-tabs>

  <v-spacer />

  <v-app-bar-title>
    {{ project.name }}
  </v-app-bar-title>

  <v-spacer />

  <simulation-button class="mx-2" />
</template>

<script lang="ts" setup>
import { computed } from "vue";

import SimulationButton from "@nest/components/simulation/SimulationButton.vue";
import { NESTProject } from "@nest/helpers/project/nestProject";

import { useNESTProjectStore } from "@nest/store/project/nestProjectStore";
const projectStore = useNESTProjectStore();

const project = computed(() => projectStore.project as NESTProject);
</script>
