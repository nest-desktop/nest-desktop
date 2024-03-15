<template>
  <StimulatorAvatar
    :color="node.view.color"
    :label="node.view.label"
    :size="props.size"
    v-if="node.elementType === 'stimulator'"
  />
  <RecorderAvatar
    :color="node.view.color"
    :label="node.view.label"
    :size="props.size"
    v-else-if="node.elementType === 'recorder'"
  />
  <NeuronAvatar
    :color="node.view.color"
    :label="node.view.label"
    :size="props.size"
    :weight="node.view.synWeights"
    v-else
  />
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { TNode, TNodeProps } from "@/types/nodeTypes";

import NeuronAvatar from "./NeuronAvatar.vue";
import RecorderAvatar from "./RecorderAvatar.vue";
import StimulatorAvatar from "./StimulatorAvatar.vue";

const props = defineProps({
  node: TNodeProps,
  size: { type: String, default: "40px" },
});

const node = computed(() => props.node as TNode);
</script>
