<template>
  <div class="activityGraph" v-if="state.graph.data">
    <Plotly
      :config="state.graph.config"
      :data="state.graph.data"
      :layout="state.graph.layout"
      :style="state.graph.style"
      :useResizeHandler="true"
    />
  </div>
</template>

<script>
import Vue from 'vue';
import { reactive, watch } from '@vue/composition-api';
import { Plotly } from 'vue-plotly';

export default Vue.extend({
  name: 'ActivityGraph',
  components: {
    Plotly,
  },
  props: {
    graph: Object,
  },
  setup(props) {
    const state = reactive({
      graph: props.graph.activityChartGraph,
    });
    watch(
      () => props.graph,
      graph => {
        state.graph = graph.activityChartGraph;
      }
    );
    return { state };
  },
});
</script>
