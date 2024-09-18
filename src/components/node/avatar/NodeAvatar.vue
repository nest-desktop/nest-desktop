<template>
  <StimulatorAvatar
    :color="node.view.color"
    v-if="node.elementType === 'stimulator'"
  >
    {{ node.view.label }}
  </StimulatorAvatar>
  <RecorderAvatar
    :color="node.view.color"
    v-else-if="node.elementType === 'recorder'"
  >
    {{ node.view.label }}
  </RecorderAvatar>
  <NeuronAvatar
    :color="node.view.color"
    :weight="node.view.synWeights"
    v-else-if="node.elementType === 'neuron'"
  >
    {{ node.view.label }}
  </NeuronAvatar>
  <v-avatar
    :color="nodeGroup.view.color"
    class="node-avatar"
    v-else
    variant="tonal"
  >
    {{ node.view.label }}
  </v-avatar>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { NodeGroup } from "@/helpers/node/nodeGroup";
import { TNode } from "@/types";

import NeuronAvatar from "./NeuronAvatar.vue";
import RecorderAvatar from "./RecorderAvatar.vue";
import StimulatorAvatar from "./StimulatorAvatar.vue";

const props = defineProps<{
  node: NodeGroup | TNode;
}>();

const node = computed(() => props.node as TNode);
const nodeGroup = computed(() => props.node as NodeGroup);
</script>

<style lang="scss">
.node-avatar {
  font-weight: 800;
  font-size: 0.85em;
  z-index: 1;
}
</style>
