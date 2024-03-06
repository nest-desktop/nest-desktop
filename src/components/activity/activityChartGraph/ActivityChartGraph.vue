<template>
  <v-layout class="activityGraphLayout" full-height>
    <v-dialog max-width="300" v-model="state.dialog">
      <v-card>
        <v-card-title>Download plot as image</v-card-title>

        <v-card-text>
          <v-select
            :items="state.imageFormats"
            density="compact"
            hide-details
            label="Select image format"
            v-model="state.toImageButtonOptions.format"
            variant="outlined"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn @click="state.dialog = false" size="small" variant="outlined">
            cancel
          </v-btn>
          <v-btn @click="downloadImage" size="small" variant="outlined">
            download
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div class="activityChartGraph full-height" ref="activityChartGraph" />
  </v-layout>
</template>

<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from "vue";
import { DownloadImgopts } from "plotly.js";

import { ActivityChartGraph } from "@/helpers/activityChartGraph/activityChartGraph";

const props = defineProps({
  graph: ActivityChartGraph,
});

const graph = computed(() => props.graph as ActivityChartGraph);

const state = reactive({
  dialog: false,
  imageFormats: ["jpeg", "png", "svg", "webp"],
  toImageButtonOptions: {
    filename: "nest-desktop",
    format: "png", // png, svg, jpeg, webp
    // height: 600,
    // scale: 1, // Multiply title/legend/axis/canvas sizes by this factor
    // width: 800,
  },
});
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

    if (graph.value?.data) {
      graph.value.react();
    }
  }
};

/**
 * Download image of the current plot.
 */
const downloadImage = () => {
  state.dialog = false;
  const date: string = new Date().toISOString();
  state.toImageButtonOptions.filename = `nest_desktop-${graph.value?.project.name}-${date}`;
  graph.value?.downloadImage(state.toImageButtonOptions as DownloadImgopts);
};

onMounted(() => {
  init();
  window.addEventListener("darkmode", () => graph.value?.relayout());
});

onBeforeUnmount(() => {
  state.dialog = false;
  window.removeEventListener("darkmode", () => graph.value?.relayout());
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
