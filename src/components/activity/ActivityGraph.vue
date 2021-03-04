<template>
  <div class="activityGraph" v-if="state.graph">
    <v-dialog v-model="state.dialog" max-width="290">
      <v-card>
        <v-card-title v-text="'Download plot'" />

        <v-card-text>
          <v-row no-gutters>
            <v-col cols="8">
              <v-subheader>
                Image format
              </v-subheader>
            </v-col>

            <v-col cols="4">
              <v-select
                :items="state.imageFormats"
                dense
                label="Select image format"
                single-line
                v-model="state.toImageButtonOptions.format"
              ></v-select>
            </v-col>
          </v-row>

          <!-- <v-row no-gutters>
            <v-col cols="5">
              <v-subheader>
                Image size
              </v-subheader>
            </v-col>

            <v-col cols="3">
              <v-text-field
                dense
                hide-details
                label="width"
                outlined
                single-line
                v-model="state.toImageButtonOptions.width"
              />
            </v-col>
            <v-col cols="1" class="py-2 text-center" v-text="'x'" />
            <v-col cols="3">
              <v-text-field
                dense
                hide-details
                label="height"
                outlined
                single-line
                v-model="state.toImageButtonOptions.height"
              />
            </v-col>
          </v-row> -->

          <!-- <v-row no-gutters>
            <v-col cols="10">
              <v-slider
                hide-details
                label="scale"
                min="0.5"
                max="2"
                step="0.5"
                v-model="state.toImageButtonOptions.scale"
              />
            </v-col>
            <v-col cols="2" v-text="state.toImageButtonOptions.scale" />
          </v-row> -->
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="state.dialog = false" text v-text="'Cancel'" />
          <v-btn @click="downloadImage" text v-text="'Download'" />
        </v-card-actions>
      </v-card>
    </v-dialog>

    <transition name="fade">
      <div v-if="state.graph.activityChartGraph.data.length > 0">
        <Plotly
          :autoResize="true"
          :autosizable="true"
          :data="state.graph.activityChartGraph.data"
          :displaylogo="false"
          :displayModeBar="true"
          :editable="state.graph.activityChartGraph.options.editable"
          :layout="state.graph.activityChartGraph.layout"
          :modeBarButtons="state.modeBarButtons"
          :toImageButtonOptions="state.toImageButtonOptions"
          :scrollZoom="true"
          style="position: relative; width: 100%; height: calc(100vh - 48px)"
          v-if="state.view == 'abstract'"
        />
      </div>
      <template v-else>No data found. Please simulate first.</template>
    </transition>

    <ActivityAnimationGraph
      :graph="state.graph.activityAnimationGraph"
      v-if="state.view == 'spatial'"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive, onMounted, watch } from '@vue/composition-api';
import { Plotly } from 'vue-plotly';
import * as PlotlyJS from 'plotly.js-dist';

import ActivityAnimationGraph from '@/components/activity/ActivityAnimationGraph.vue';
import { ActivityGraph } from '@/core/activity/activityGraph';

export default Vue.extend({
  name: 'ActivityGraph',
  components: {
    Plotly,
    ActivityAnimationGraph,
  },
  props: {
    graph: ActivityGraph,
    projectId: String,
    view: String,
  },
  setup(props) {
    const state = reactive({
      dialog: false,
      gd: undefined,
      graph: props.graph as ActivityGraph,
      imageFormats: ['jpeg', 'png', 'svg', 'webp'],
      toImageButtonOptions: {
        filename: 'nest-desktop',
        format: 'png', // png, svg, jpeg, webp
        // height: 600,
        // scale: 1, // Multiply title/legend/axis/canvas sizes by this factor
        // width: 800,
      },
      view: props.view,
      modeBarButtons: [
        [
          {
            name: 'Download plot',
            icon: PlotlyJS.Icons.camera,
            click: (gd: any) => {
              state.gd = gd;
              state.dialog = true;
            },
          },
          // 'toImage',
        ],
        ['zoom2d', 'pan2d'],
        ['zoomIn2d', 'zoomOut2d', 'autoScale2d', 'resetScale2d'],
        ['hoverClosestCartesian', 'hoverCompareCartesian'],
      ],
    });

    const downloadImage = () => {
      state.dialog = false;
      const date: string = new Date().toISOString();
      state.toImageButtonOptions.filename = `nest_desktop-${state.graph.project.name}-${date}`;
      PlotlyJS.downloadImage(state.gd, state.toImageButtonOptions);
    };

    /**
     * Update activity graph.
     */
    const update = () => {
      state.graph = undefined;
      setTimeout(() => {
        state.graph = props.graph as ActivityGraph;
        state.view = props.view;
      }, 1);
    };

    watch(
      () => [props.graph, props.view],
      () => update()
    );

    onMounted(() => {
      update();
    });

    return { downloadImage, state };
  },
});
</script>
