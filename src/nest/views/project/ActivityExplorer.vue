<template>
  <activity-chart-graph
    :key="projectStore.project.activityGraph.state.dataHash"
    :graph="projectStore.project.activityGraph.activityChartGraph"
  />
</template>

<script lang="ts" setup>
import { useProjectStore } from "@nest/store/project/projectStore";
import ActivityChartGraph from "@nest/components/graph/ActivityChartGraph.vue";

const projectStore = useProjectStore();
</script>
