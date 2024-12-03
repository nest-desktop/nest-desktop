<template>
  <!-- <v-toolbar density="compact">
    <v-btn icon="mdi:mdi-plus" />
    <v-btn icon="mdi:mdi-minus" />
  </v-toolbar> -->

  <ActivityChartGraph v-if="projectViewStore.state.views.activity === 'abstract'" :graph="graph.activityChartGraph" />
  <ActivityAnimationGraph
    v-else-if="projectViewStore.state.views.activity === 'spatial'"
    :graph="graph.activityAnimationGraph"
  />
</template>

<script lang="ts" setup>
import { computed } from "vue";

import ActivityChartGraph from "@/components/activityChart/ActivityChartGraph.vue";
import { TProjectStore } from "@/stores/project/defineProjectStore";

import { NESTActivityGraph } from "../helpers/activity/activityGraph";
import ActivityAnimationGraph from "../components/activityAnimation/ActivityAnimationGraph.vue";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();
const projectViewStore = appStore.currentSimulator.views.project;

import { useNESTProjectStore } from "../stores/project/projectStore";
const projectStore: TProjectStore = useNESTProjectStore();

const graph = computed(() => projectStore.state.project.activityGraph as NESTActivityGraph);
</script>
