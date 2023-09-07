<template>
  <v-tabs stacked>
    <v-tab
      :to="{ name: 'NorseNetworkEditor', params: { projectId: project.id } }"
      size="small"
      title="Edit network"
    >
      <v-icon icon="nest:network" />
      Editor
    </v-tab>
    <v-tab
      :to="{ name: 'NorseActivityExplorer', params: { projectId: project.id } }"
      size="small"
      title="Explore activity"
    >
      <v-icon class="rotate-270" icon="mdi-border-style" />
      Explorer
    </v-tab>
    <v-tab
      :to="{ name: 'NorseLabBook', params: { projectId: project.id } }"
      size="small"
      title="Lab book"
    >
      <v-icon icon="mdi-book-open-outline" />
      Lab book
    </v-tab>
  </v-tabs>

  <v-spacer />

  <v-app-bar-title>
    {{ project.name }}
  </v-app-bar-title>

  <v-spacer />

  <simulation-button class="mx-2" :simulation="project.simulation" />
</template>

<script lang="ts" setup>
import { computed } from "vue";

import SimulationButton from "@/components/simulation/SimulationButton.vue";

import { NorseProject } from "@norse/helpers/project/norseProject";

const props = defineProps({
  project: NorseProject,
});

const project = computed(() => props.project as NorseProject);
</script>
