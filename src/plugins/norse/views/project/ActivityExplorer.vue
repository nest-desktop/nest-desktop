<template>
  <!-- <v-toolbar density="compact">
    <v-btn icon="mdi-plus"></v-btn>
    <v-btn icon="mdi-minus"></v-btn>
  </v-toolbar> -->

  <activity-chart-graph :graph="graph" />
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { ActivityChartGraph as ActivityChartGraphClass } from "@/graph/activityGraph/activityChartGraph";
import ActivityChartGraph from "@/components/activity/activityChartGraph/ActivityChartGraph.vue";

import { useNorseProjectStore } from "@norse/store/project/norseProjectStore";

const projectStore = useNorseProjectStore();

const graph = computed(() => projectStore.project.activityGraph.activityChartGraph as ActivityChartGraphClass);
</script>
