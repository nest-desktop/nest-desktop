<template>
  <div ref="activityChartGraph" class="activityChartGraph" />
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

import type { ActivityChartGraph } from "../../helpers/activityChartGraph/activityChartGraph";

const props = defineProps<{ graph: ActivityChartGraph }>();
const graph = computed(() => props.graph);

const activityChartGraph = ref<HTMLDivElement>();

const init = () => {
  const ref = activityChartGraph.value;

  if (ref) {
    graph.value?.newPlot(ref);

    // @ts-expect-error Property 'on' does not exist on type 'HTMLDivElement'.
    ref.on("plotly_relayout", restyle);

    // @ts-expect-error Property 'on' does not exist on type 'HTMLDivElement'.
    ref.on("plotly_resize", restyle);

    // if (graph.value?.plotData) {
    //   graph.value.react();
    // }
  }
};

const relayout = () => graph.value?.relayout();
const restyle = () => graph.value?.restyle();

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
  () => init(),
);
</script>

<style lang="scss">
.activityChartGraph {
  width: 100%;
  height: calc(100vh - 48px - 24px);
}
</style>
