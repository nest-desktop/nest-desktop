<template>
  <div class="activityGraph">
    <div
      class="activityGraphHeader"
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
        <ActivityChartGraph
          :graph="state.graph.activityChartGraph"
          v-if="state.view === 'abstract'"
        />

        <ActivityAnimationGraph
          :graph="state.graph.activityAnimationGraph"
          v-if="state.view === 'spatial'"
        />
      </div>
    </transition>

    <v-snackbar :timeout="-1" v-model="state.graph.project.state.snackbar.show">
      {{ state.graph.project.state.snackbar.text }}

      <template #action="{ attrs }">
        <v-btn
          @click="state.graph.project.state.closeSnackbar()"
          outlined
          small
          v-bind="attrs"
          v-if="state.graph.project.state.snackbar.actions.length === 0"
        >
          Close
        </v-btn>
        <template v-if="state.graph.project.state.snackbar.actions.length > 0">
          <v-btn
            :disabled="action.disabled"
            :key="actionIdx"
            @click="action.onClick"
            outlined
            small
            v-bind="attrs"
            v-for="(action, actionIdx) in state.graph.project.state.snackbar
              .actions"
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

import { ActivityGraph } from '@/core/activity/activityGraph';
import ActivityChartGraph from '@/components/activity/activityChart/ActivityChartGraph.vue';
import ActivityAnimationGraph from '@/components/activity/activityAnimation/ActivityAnimationGraph.vue';
import core from '@/core';

export default Vue.extend({
  name: 'ActivityGraph',
  components: {
    ActivityChartGraph,
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
      graph: props.graph as ActivityGraph,
      loading: false,
      view: props.view || 'abstract',
    });

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
     * Check if there are any activities or changes to the network
     * which should be displayed via snackbar message.
     */
    const showHelp = () => {
      const buttonProps = [
        {
          text: 'Simulate',
          onClick: () => state.graph.project.startSimulation(),
          disabled: state.graph.project.simulation.state.running,
        },
      ];

      if (state.graph.project.state.snackbar.important) {
        return;
      }
      state.graph.project.state.closeSnackbar();
      if (!projectView.config.showHelp) {
        return;
      }
      if (!state.graph.project.state.activities.hasSomeEvents) {
        state.graph.project.state.showSnackbar(
          'No simulation results found.',
          buttonProps
        );
      } else if (
        state.graph.codeHash !== state.graph.project.simulation.code.hash
      ) {
        state.graph.project.state.showSnackbar(
          'Code changes detected. Activity might be not correctly displayed.',
          buttonProps
        );
      }
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

    return { projectView, state };
  },
});
</script>

<style>
.activityGraph .activityGraphHeader {
  position: absolute;
  left: 0;
  top: 0;
  z-index: 1;
}
</style>
