<template>
  <!-- <v-toolbar density="compact">
    <v-btn icon="mdi:mdi-plus" />
    <v-btn icon="mdi:mdi-minus" />
  </v-toolbar> -->

  <ActivityChartGraph
    :graph="graph.activityChartGraph"
    v-if="projectStore.state.tab.activityView === 'abstract'"
  />
  <ActivityAnimationGraph
    :graph="graph.activityAnimationGraph"
    v-else-if="projectStore.state.tab.activityView === 'spatial'"
  />
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { NESTActivityGraph } from "../helpers/activity/activityGraph";
import ActivityAnimationGraph from "../components/activityAnimation/ActivityAnimationGraph.vue";
import ActivityChartGraph from "@/components/activityChart/ActivityChartGraph.vue";
import { TProjectStore } from "@/stores/project/defineProjectStore";

import { useNESTProjectStore } from "../stores/project/projectStore";
const projectStore: TProjectStore = useNESTProjectStore();

const graph = computed(
  () => projectStore.state.project.activityGraph as NESTActivityGraph
);
</script>
