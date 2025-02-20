<template>
  <!-- <v-toolbar density="compact">
    <v-btn icon="mdi:mdi-plus" />
    <v-btn icon="mdi:mdi-minus" />
  </v-toolbar> -->

  <ActivityChartGraph :graph="currentProject.activityGraph.activityChartGraph" />
</template>

<script lang="ts" setup>
import ActivityChartGraph from "@/components/activityChart/ActivityChartGraph.vue";

import { currentProject } from "../stores/project/projectStore";
</script>
