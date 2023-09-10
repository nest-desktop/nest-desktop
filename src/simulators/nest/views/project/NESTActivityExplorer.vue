<template>
  <!-- <v-toolbar density="compact">
    <v-btn icon="mdi-plus"></v-btn>
    <v-btn icon="mdi-minus"></v-btn>
  </v-toolbar> -->

  <activity-chart-graph :graph="graph" />
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { ActivityChartGraph as ActivityChartGraphClass } from "@/helpers/activityChartGraph/activityChartGraph";
import ActivityChartGraph from "@/components/activity/activityChartGraph/ActivityChartGraph.vue";

import { useNESTProjectStore } from "../../store/project/nestProjectStore";

const projectStore = useNESTProjectStore();

const graph = computed(() => projectStore.project.activityGraph.activityChartGraph as ActivityChartGraphClass);

</script>
