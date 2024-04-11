<template>
  <!-- <v-toolbar density="compact">
    <v-btn icon="mdi:mdi-plus"></v-btn>
    <v-btn icon="mdi:mdi-minus"></v-btn>
  </v-toolbar> -->

  <activity-chart-graph :graph />
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { ActivityChartGraph as ActivityChartGraphClass } from "@/helpers/activityChartGraph/activityChartGraph";
import ActivityChartGraph from "@/components/activity/activityChartGraph/ActivityChartGraph.vue";

import { usePyNNProjectStore } from "../stores/project/projectStore";
const projectStore = usePyNNProjectStore();

const graph = computed(
  () =>
    projectStore.state.project.activityGraph
      .activityChartGraph as ActivityChartGraphClass
);
</script>
