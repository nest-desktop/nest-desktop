<template>
  <!-- <v-toolbar density="compact">
    <v-btn icon="mdi:mdi-plus"></v-btn>
    <v-btn icon="mdi:mdi-minus"></v-btn>
  </v-toolbar> -->

  <ActivityChartGraph :graph="graph.activityChartGraph" />
</template>

<script lang="ts" setup>
import { computed } from "vue";

import ActivityChartGraph from "@/components/activityChart/ActivityChartGraph.vue";
import { BaseActivityGraph } from "@/helpers/activity/activityGraph";

import { useNorseProjectStore } from "../stores/project/projectStore";
const projectStore = useNorseProjectStore();

const graph = computed(
  () => projectStore.state.project.activityGraph as BaseActivityGraph
);
</script>
