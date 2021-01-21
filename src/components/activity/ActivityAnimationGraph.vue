<template>
  <div id="activityAnimationGraph">
    <div ref="activityAnimationScene" style="width:100%; height:800px"></div>
  </div>
</template>

<script>
import Vue from 'vue';
import { reactive, onMounted, onUnmounted, watch } from '@vue/composition-api';

import { ActivityAnimationSceneSphere } from '@/core/activity/animationScenes/activityAnimationSceneSphere';

export default Vue.extend({
  name: 'ActivityAnimationGraph',
  props: {
    graph: Object,
  },
  setup(props, { refs }) {
    const state = reactive({
      graph: props.graph,
      scene: null,
    });

    const update = () => {
      state.graph = props.graph;
      setTimeout(() => {
        state.scene = new ActivityAnimationSceneSphere(
          state.graph,
          refs.activityAnimationScene
        );
      }, 1);
    };

    watch(
      () => props.graph,
      () => update()
    );

    onMounted(() => {
      update();
    });

    onUnmounted(() => {
      state.scene.destroy();
    });

    return { state };
  },
});
</script>
