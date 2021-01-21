<template>
  <div class="activityGraph" v-if="state.graph">
    <Plotly
      :config="state.graph.activityChartGraph.config"
      :data="state.graph.activityChartGraph.data"
      :layout="state.graph.activityChartGraph.layout"
      :style="state.graph.activityChartGraph.style"
      :useResizeHandler="true"
      v-if="state.view == 'abstract'"
    />

    <ActivityAnimationGraph
      :graph="state.graph.activityAnimationGraph"
      v-if="state.view == 'spatial'"
    />
  </div>
</template>

<script>
import Vue from 'vue';
import { reactive, onMounted, watch } from '@vue/composition-api';
import { Plotly } from 'vue-plotly';

import ActivityAnimationGraph from '@/components/activity/ActivityAnimationGraph.vue';

export default Vue.extend({
  name: 'ActivityGraph',
  components: {
    Plotly,
    ActivityAnimationGraph,
  },
  props: {
    graph: Object,
    projectId: String,
    view: String,
  },
  setup(props) {
    const state = reactive({
      graph: props.graph,
      view: props.view,
    });

    const update = () => {
      state.graph = null;
      setTimeout(() => {
        state.graph = props.graph;
        state.view = state.graph.project.hasSpatialActivities
          ? props.view
          : 'abstract';
      }, 1);
    };

    watch(
      () => props.graph,
      () => update()
    );

    watch(
      () => props.view,
      () => update()
    );

    watch(
      () => props.projectId,
      () => update()
    );

    onMounted(() => {
      update();
    });

    return { state };
  },
});
</script>
