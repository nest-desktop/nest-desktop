<template>
  <v-tabs stacked>
    <v-tab title="Edit network" size="small" to="edit">
      <v-icon icon="nest:networkIcon" />
      Editor
    </v-tab>
    <v-tab title="Explore activity" size="small" to="explore">
      <v-icon class="rotate-90" icon="mdi-border-style" />
      Explorer
    </v-tab>
    <v-tab title="Lab book" size="small" to="lab">
      <v-icon icon="mdi-book-open-outline" />
      Lab book
    </v-tab>
  </v-tabs>

  <v-spacer />

  <v-app-bar-title> {{ projectStore.projectId }} </v-app-bar-title>

  <v-spacer />

  <v-btn variant="outlined"> Simulate </v-btn>
</template>

<script lang="ts" setup>
import { useProjectStore } from '@/store/projectStore';

const projectStore = useProjectStore();

</script>
