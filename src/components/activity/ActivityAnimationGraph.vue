<template>
  <div id="activityAnimationGraph">
    <div ref="activityAnimationScene" style="width:100%; height:800px" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive, onMounted, onUnmounted, watch } from '@vue/composition-api';

import { ActivityAnimationGraph } from '@/core/activity/activityAnimationGraph';

export default Vue.extend({
  name: 'ActivityAnimationGraph',
  props: {
    graph: ActivityAnimationGraph,
  },
  setup(props, { refs }) {
    const state = reactive({
      graph: props.graph as ActivityAnimationGraph,
    });

    const update = () => {
      state.graph = props.graph as ActivityAnimationGraph;
      state.graph.initScene(refs['activityAnimationScene']);
    };

    onMounted(() => {
      update();
    });

    onUnmounted(() => {
      state.graph.scene.destroy();
    });

    watch(
      () => props.graph,
      () => update()
    );

    return { state };
  },
});
</script>
