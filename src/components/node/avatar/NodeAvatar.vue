<template>
  <stimulator-avatar
    :color="node.view.color"
    :label="node.view.label"
    :size="props.size"
    v-if="node.elementType === 'stimulator'"
  />
  <recorder-avatar
    :color="node.view.color"
    :label="node.view.label"
    :size="props.size"
    v-else-if="node.elementType === 'recorder'"
  />
  <neuron-avatar
    :color="node.view.color"
    :label="node.view.label"
    :size="props.size"
    :weight="node.view.synWeights"
    v-else
  />
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { Node, NodePropTypes } from "@/types/nodeTypes";

import NeuronAvatar from "./NeuronAvatar.vue";
import RecorderAvatar from "./RecorderAvatar.vue";
import StimulatorAvatar from "./StimulatorAvatar.vue";

const props = defineProps({
  node: NodePropTypes,
  size: { type: String, default: "40px" },
});

const node = computed(() => props.node as Node);
</script>
