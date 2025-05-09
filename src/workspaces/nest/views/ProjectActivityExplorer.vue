<template>
  <!-- <v-toolbar density="compact">
    <v-btn icon="mdi:mdi-plus" />
    <v-btn icon="mdi:mdi-minus" />
  </v-toolbar> -->

  <ActivityChartGraph
    v-if="projectViewStore.state.views.activity === 'abstract'"
    :graph="currentProject.activityGraph.activityChartGraph"
  />
  <ActivityAnimationGraph
    v-else-if="projectViewStore.state.views.activity === 'spatial'"
    :graph="currentProject.activityGraph.activityAnimationGraph"
  />
</template>

<script setup lang="ts">
import ActivityChartGraph from "@/components/activityChart/ActivityChartGraph.vue";

import ActivityAnimationGraph from "../components/activityAnimation/ActivityAnimationGraph.vue";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();
const projectViewStore = appStore.currentWorkspace.views.project;

import { currentProject } from "../stores/project/projectStore";
</script>
