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

import SimulationButton from "@norse/components/simulation/SimulationButton.vue";
import { Project } from "@norse/core/project/project";
import { useProjectStore } from "@norse/store/project/projectStore";

const projectStore = useProjectStore();
const project = computed(() => projectStore.project as Project);
</script>
