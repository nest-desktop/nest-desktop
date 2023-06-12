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

  <v-btn variant="outlined"> Simulate </v-btn>
</template>

<script lang="ts" setup>
import { useProjectStore } from "../../store/projectStore";
const projectStore = useProjectStore();
</script>
