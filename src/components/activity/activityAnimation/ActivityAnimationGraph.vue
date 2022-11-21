<template>
  <div class="activityAnimationGraph" ref="activityAnimationGraph" />
</template>

<script lang="ts">
import Vue from 'vue';
import { onBeforeUnmount, onMounted, ref } from '@vue/composition-api';

import { ActivityAnimationGraph } from '@/core/activity/activityAnimation/activityAnimationGraph';

export default Vue.extend({
  name: 'ActivityAnimationGraph',
  props: {
    graph: ActivityAnimationGraph,
  },
  setup(props) {
    let graph: ActivityAnimationGraph;
    const activityAnimationGraph = ref(null);

    const init = () => {
      graph = props.graph as ActivityAnimationGraph;
      graph.initScene(activityAnimationGraph.value);
    };

    onMounted(init);

    onBeforeUnmount(() => {
      graph.destroyScene();
    });

    return {
      activityAnimationGraph,
    };
  },
});
</script>

<style>
.activityAnimationGraph {
  height: calc(100vh - 48px - 24px);
  width: 100%;
}
</style>
