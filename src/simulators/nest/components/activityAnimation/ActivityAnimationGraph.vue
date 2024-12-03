<template>
  <div
    ref="activityAnimationGraph"
    class="activityAnimationGraph"
  />
</template>

<script lang="ts" setup>
import { onBeforeUnmount, onMounted, ref } from "vue";

import { ActivityAnimationGraph } from "../../helpers/activityAnimationGraph/activityAnimationGraph";

const props = defineProps<{ graph: ActivityAnimationGraph }>();
const activityAnimationGraph = ref<HTMLDivElement>();

onMounted(() => props.graph.initScene(activityAnimationGraph.value));
onBeforeUnmount(() => props.graph.destroyScene());
</script>

<style>
.activityAnimationGraph {
  height: calc(100vh - 48px - 25px);
  width: 100%;
}
</style>
