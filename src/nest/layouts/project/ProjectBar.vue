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
    {{ projectStore.project.name }}
  </v-app-bar-title>

  <v-spacer />

  <simulation-button class="mx-2" />

  <!-- <v-btn variant="outlined" @click="projectStore.project.startSimulation()">
    Simulate
  </v-btn> -->

</template>

<script lang="ts" setup>
import SimulationButton from "@nest/components/simulation/SimulationButton.vue";
import { useProjectStore } from "@nest/store/project/projectStore";
const projectStore = useProjectStore();

</script>
