<template>
  <ActivityChartGraph :graph="graph.activityChartGraph" v-if="graph" />
</template>

<script lang="ts" setup>
import { computed } from "vue";

import ActivityChartGraph from "@/components/activityChart/ActivityChartGraph.vue";

import { NESTActivityGraph } from "../helpers/activity/activityGraph";
import { TModelStore } from "@/stores/model/defineModelStore";

import { useNESTModelStore } from "../stores/model/modelStore";
const modelStore: TModelStore = useNESTModelStore();

// defineProps<{ modelId: string }>();

const graph = computed(
  () => modelStore.state.project?.activityGraph as NESTActivityGraph
);
</script>
