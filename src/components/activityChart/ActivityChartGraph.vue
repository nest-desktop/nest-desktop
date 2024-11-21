<template>
  <v-layout class="activityGraphLayout" full-height>
    <div class="activityChartGraph full-height" ref="activityChartGraph" />
  </v-layout>
</template>

<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  ref,
  watch,
} from "vue";

import { ActivityChartGraph } from "@/helpers/activityChartGraph/activityChartGraph";

const props = defineProps<{ graph: ActivityChartGraph }>();
const graph = computed(() => props.graph);

const activityChartGraph = ref(null);

const init = () => {
  const ref: any = activityChartGraph.value;

  if (ref) {
    graph.value?.newPlot(ref);

    // On zoom behavior
    ref.on("plotly_relayout", () => {
      graph.value?.restyle();
    });

    // On resize behavior
    ref.on("plotly_resize", () => {
      graph.value?.restyle();
    });

    // if (graph.value?.plotData) {
    //   graph.value.react();
    // }
  }
};

const relayout = () => graph.value?.relayout();

onBeforeUnmount(() => {
  // graph.value.deleteTraces();
  window.removeEventListener("relayout", relayout);
});

onMounted(() => {
  init();
  window.addEventListener("relayout", relayout);
});

watch(
  () => props.graph,
  () => init()
);
</script>

<style lang="scss">
.activityGraphLayout {
  .activityChartGraph {
    width: 100%;
  }
}
</style>
