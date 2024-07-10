<template>
  <v-chip
    class="ma-2"
    density="compact"
    style="position: absolute; top: 72px; z-index: 1000"
    variant="outlined"
  >
    {{ modelStore.state.projectId }}
  </v-chip>
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
