<template>
  <StimulatorAvatar
    :color="node.view.color"
    :label="node.view.label"
    :size="size || '40px'"
    v-if="node.elementType === 'stimulator'"
  />
  <RecorderAvatar
    :color="node.view.color"
    :label="node.view.label"
    :size="size || '40px'"
    v-else-if="node.elementType === 'recorder'"
  />
  <NeuronAvatar
    :color="node.view.color"
    :label="node.view.label"
    :size="size || '40px'"
    :weight="node.view.synWeights"
    v-else
  />
</template>

<script lang="ts" setup>
import { TNode } from "@/types/nodeTypes";

import NeuronAvatar from "./NeuronAvatar.vue";
import RecorderAvatar from "./RecorderAvatar.vue";
import StimulatorAvatar from "./StimulatorAvatar.vue";

defineProps<{ node: TNode; size?: string }>();
</script>
