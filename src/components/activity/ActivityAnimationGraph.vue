<template>
  <div
    class="activityAnimationGraph"
    ref="activityAnimationGraph"
    style="width: 100%; height: 800px"
  />
</template>

<script lang="ts">
import Vue from 'vue';
import { onMounted, onUnmounted } from '@vue/composition-api';

import { ActivityAnimationGraph } from '@/core/activity/activityAnimationGraph';

export default Vue.extend({
  name: 'ActivityAnimationGraph',
  props: {
    graph: ActivityAnimationGraph,
  },
  setup(props, { refs }) {
    let graph: ActivityAnimationGraph;

    onMounted(() => {
      graph = props.graph as ActivityAnimationGraph;
      graph.initScene(refs['activityAnimationGraph']);
    });

    onUnmounted(() => {
      graph.scene.destroy();
    });

    return {};
  },
});
</script>
