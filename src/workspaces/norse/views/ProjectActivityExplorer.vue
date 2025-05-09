<template>
  <!-- <v-toolbar density="compact">
    <v-btn icon="mdi:mdi-plus" />
    <v-btn icon="mdi:mdi-minus" />
  </v-toolbar> -->

  <ActivityChartGraph :graph="currentProject.activityGraph.activityChartGraph" />
</template>

<script setup lang="ts">
import ActivityChartGraph from "@/components/activityChart/ActivityChartGraph.vue";

import { currentProject } from "../stores/project/projectStore";
</script>
