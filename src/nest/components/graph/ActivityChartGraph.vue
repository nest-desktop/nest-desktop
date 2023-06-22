<template>
  <v-layout class="activityGraphLayout" full-height id="activityGraphLayout">
    <v-dialog max-width="300" v-model="state.graph.state.dialog">
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
          <v-btn @click="closeDialog" size="small" variant="outlined">
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
import { onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";

const props = defineProps(["graph"]);

const state = reactive({
  graph: props.graph,
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
  state.graph = props.graph;
  const ref: any = activityChartGraph.value;
  if (ref) {
    state.graph.newPlot(ref);

    // On zoom behavior
    ref.on("plotly_relayout", () => {
      state.graph.restyle();
    });

    // On resize behavior
    ref.on("plotly_resize", () => {
      state.graph.restyle();
    });

    state.graph.resizeObserver.observe(ref);
  }
};

/**
 * Close dialog.
 */
const closeDialog = () => {
  state.graph.state.dialog = false;
};

/**
 * Download image of the current plot.
 */
const downloadImage = () => {
  closeDialog();
  const date: string = new Date().toISOString();
  state.toImageButtonOptions.filename = `nest_desktop-${state.graph.project.name}-${date}`;
  state.graph.downloadImage(state.toImageButtonOptions);
};

onMounted(() => {
  init();
  window.addEventListener("darkmode", () => state.graph.relayout());
});

onBeforeUnmount(() => {
  closeDialog();
  state.graph.resizeObserver.disconnect();
  window.removeEventListener("darkmode", () => state.graph.relayout());
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
