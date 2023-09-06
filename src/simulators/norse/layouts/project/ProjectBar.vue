<template>
  <v-tabs stacked>
    <v-tab size="small" title="Edit network"  to="edit">
      <v-icon icon="nest:network" />
      Editor
    </v-tab>
    <v-tab size="small" title="Explore activity" to="explore">
      <v-icon class="rotate-270" icon="mdi-border-style" />
      Explorer
    </v-tab>
    <v-tab size="small" title="Lab book" to="lab">
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
})

const project = computed(() => props.project as NorseProject);
</script>
