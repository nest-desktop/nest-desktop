<template>
  <StimulatorAvatar
    :color="node.view.color"
    :text="node.view.label"
    :size="size || 40"
    v-if="node.elementType === 'stimulator'"
  />
  <RecorderAvatar
    :color="node.view.color"
    :text="node.view.label"
    :size="size || 40"
    v-else-if="node.elementType === 'recorder'"
  />
  <NeuronAvatar
    :color="node.view.color"
    :text="node.view.label"
    :size="size || 40"
    :weight="node.view.synWeights"
    v-else-if="node.elementType === 'neuron'"
  />
  <v-avatar
    :color="nodeGroup.view.color"
    :size="size || 40"
    :text="nodeGroup.view.label"
    v-else
    variant="tonal"
  />
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { NodeGroup } from "@/helpers/node/nodeGroup";
import { TNode } from "@/types/nodeTypes";

import NeuronAvatar from "./NeuronAvatar.vue";
import RecorderAvatar from "./RecorderAvatar.vue";
import StimulatorAvatar from "./StimulatorAvatar.vue";

const props = defineProps<{
  node: NodeGroup | TNode;
  size?: number | string;
}>();

const node = computed(() => props.node as TNode);
const nodeGroup = computed(() => props.node as NodeGroup);
</script>
