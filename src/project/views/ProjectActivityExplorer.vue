<template>
  <!-- <v-toolbar density="compact">
    <v-btn icon="mdi:mdi-plus" />
    <v-btn icon="mdi:mdi-minus" />
  </v-toolbar> -->

  <ActivityChartGraph :graph="projectStore.state.project?.activityGraph.activityChartGraph" />
</template>

<script setup lang="ts">
import { ActivityChartGraph } from "@/activityGraph/components";
import { getCurrentStore } from "@/app";

const projectStore = getCurrentStore("project");
</script>
