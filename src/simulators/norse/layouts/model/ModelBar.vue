<template>
  <v-tabs stacked>
    <v-tab size="small" title="Explore activity" to="explore">
      <v-icon icon="mdi-chart-scatter-plot" />
      Explorer
    </v-tab>
    <v-tab size="small" title="Edit network" to="edit">
      <v-icon icon="mdi-pencil" />
      Editor
    </v-tab>
  </v-tabs>

  <v-spacer />

  <v-app-bar-title> {{ modelStore.modelId }} </v-app-bar-title>

  <v-spacer />

  <v-btn variant="outlined"> Simulate </v-btn>
</template>

<script lang="ts" setup>
import { useNorseModelStore } from "@norse/store/model/norseModelStore";
const modelStore = useNorseModelStore();
</script>
