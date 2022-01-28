<template>
  <div class="activityGraph">
    <v-dialog v-model="state.dialog" max-width="290">
      <v-card>
        <v-card-title v-text="'Download plot'" />

        <v-card-text>
          <v-row no-gutters>
            <v-col cols="8">
              <v-subheader v-text="'Image format'" />
            </v-col>

            <v-col cols="4">
              <v-select
                :items="state.imageFormats"
                dense
                label="Select image format"
                single-line
                v-model="state.toImageButtonOptions.format"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="state.dialog = false" text v-text="'Cancel'" />
          <v-btn @click="downloadImage" text v-text="'Download'" />
        </v-card-actions>
      </v-card>
    </v-dialog>

    <div
      style="position: absolute; left: 0; top: 0; z-index: 1000"
      v-if="state.graph.project.app.config.devMode"
    >
      <v-chip
        class="ma-1"
        label
        outlined
        small
        v-if="state.graph.codeHash"
        v-text="state.graph.codeHash.slice(0, 6)"
      />
    </div>

    <transition name="fade">
      <div v-if="!state.loading">
        <Plotly
          :autoResize="true"
          :autoSizable="true"
          :data="state.graph.activityChartGraph.data"
          :displaylogo="false"
          :displayModeBar="true"
          :editable="true"
          :layout="state.graph.activityChartGraph.layout"
          :modeBarButtons="state.modeBarButtons"
          :scrollZoom="true"
          :toImageButtonOptions="state.toImageButtonOptions"
          style="position: relative; width: 100%; height: calc(100vh - 48px)"
          v-if="state.view === 'abstract'"
        />

        <ActivityAnimationGraph
          :graph="state.graph.activityAnimationGraph"
          v-if="state.view === 'spatial'"
        />
      </div>
    </transition>

    <v-snackbar :timeout="-1" v-model="state.snackbar.show">
      {{ state.snackbar.text }}

      <template #action="{ attrs }">
        <v-btn
          @click="state.snackbar.show = false"
          outlined
          small
          v-bind="attrs"
          v-if="state.snackbar.actions.length === 0"
        >
          Close
        </v-btn>
        <template v-if="state.snackbar.actions.length > 0">
          <v-btn
            :key="actionIdx"
            :disabled="action.disabled"
            @click="action.onClick"
            outlined
            small
            v-bind="attrs"
            v-for="(action, actionIdx) in state.snackbar.actions"
            v-text="action.text"
          />
        </template>
      </template>
    </v-snackbar>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive, onMounted, watch } from '@vue/composition-api';
import { Plotly } from 'vue-plotly';
import * as PlotlyJS from 'plotly.js-dist-min';

import { ActivityGraph } from '@/core/activity/activityGraph';
import ActivityAnimationGraph from '@/components/activity/activityAnimation/ActivityAnimationGraph.vue';
import core from '@/core';

export default Vue.extend({
  name: 'ActivityGraph',
  components: {
    Plotly,
    ActivityAnimationGraph,
  },
  props: {
    activitiesHash: Array,
    codeHash: String,
    graph: ActivityGraph,
    graphCodeHash: String,
    view: String,
  },
  setup(props) {
    const projectView = core.app.project.view;
    const state = reactive({
      dialog: false,
      gd: undefined,
      graph: props.graph as ActivityGraph,
      imageFormats: ['jpeg', 'png', 'svg', 'webp'],
      loading: false,
      snackbar: {
        actions: [],
        show: false,
        text: '',
      },
      toImageButtonOptions: {
        filename: 'nest-desktop',
        format: 'png', // png, svg, jpeg, webp
        // height: 600,
        // scale: 1, // Multiply title/legend/axis/canvas sizes by this factor
        // width: 800,
      },
      view: props.view || 'abstract',
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

    /**
     * Download image of the activity chart graph.
     */
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
      state.loading = true;
      state.view = props.view || 'abstract';
      state.graph = props.graph as ActivityGraph;
      if (state.view === 'abstract') {
        state.loading = false;
      } else {
        setTimeout(() => {
          state.loading = false;
        }, 1);
      }
    };

    /**
     * Start simulation.
     */
    const simulate = () => {
      if (projectView.config.simulateWithInsite) {
        state.graph.project.runSimulationInsite();
      } else {
        state.graph.project.runSimulation();
      }
    };

    /**
     * Check if there are any activities or changes to the network
     * which should be displayed via snackbar message.
     */
    const showHelp = () => {
      const buttonProps = [
        {
          text: 'Simulate',
          onClick: () => simulate(),
          disabled: state.graph.project.simulation.running,
        },
      ];

      state.snackbar.show = false;
      if (!projectView.config.showHelp) {
        return;
      }
      if (!state.graph.project.state.hasActivities) {
        showSnackbar('No simulation results found.', buttonProps);
      } else if (state.graph.codeHash !== state.graph.project.code.hash) {
        showSnackbar(
          'Code changes detected. Activity might be not correctly displayed.',
          buttonProps
        );
      }
    };

    /**
     * Show snackbar.
     */
    const showSnackbar = (text: string, actions: any[] = []) => {
      state.snackbar.text = text;
      state.snackbar.actions = actions;
      state.snackbar.show = true;
    };

    onMounted(() => {
      update();
      setTimeout(() => showHelp(), 500);
    });

    watch(
      () => [
        props.graph,
        props.view,
        props.codeHash,
        props.graphCodeHash,
        props.activitiesHash,
      ],
      (newProps, oldProps) => {
        if (oldProps[0] !== newProps[0] || oldProps[1] !== newProps[1]) {
          update();
        }
        if (
          oldProps[2] !== newProps[2] ||
          oldProps[3] !== newProps[3] ||
          oldProps[4] !== newProps[4]
        ) {
          setTimeout(() => showHelp(), 500);
        }
      }
    );

    return { projectView, downloadImage, state };
  },
});
</script>
