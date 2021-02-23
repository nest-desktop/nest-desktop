<template>
  <div class="activityGraph" v-if="state.graph">
    <transition name="fade">
      <div v-if="state.graph.activityChartGraph.data.length > 0">
        <Plotly
          :autoResize="true"
          :data="state.graph.activityChartGraph.data"
          :layout="state.graph.activityChartGraph.layout"
          :displayModeBar="true"
          :toImageButtonOptions="
            state.graph.activityChartGraph.options.toImageButtonOptions
          "
          :autosizable="true"
          :editable="state.graph.activityChartGraph.options.editable"
          :displaylogo="false"
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
      graph: props.graph as ActivityGraph,
      view: props.view,
    });

    /**
     * Update activity graph.
     */
    const update = () => {
      state.graph = undefined;
      setTimeout(() => {
        state.graph = props.graph as ActivityGraph;
        state.view = state.graph.project.hasSpatialActivities
          ? props.view
          : 'abstract';
      }, 1);
    };

    watch(
      () => [props.graph, props.view],
      () => update()
    );

    onMounted(() => {
      update();
    });

    return { state };
  },
});
</script>
