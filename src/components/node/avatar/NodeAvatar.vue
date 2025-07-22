<template>
  <StimulatorAvatar v-if="node.elementType === 'stimulator'" :color="node.color">
    {{ node.label }}
  </StimulatorAvatar>
  <RecorderAvatar v-else-if="node.elementType === 'recorder'" :color="node.color">
    {{ node.label }}
  </RecorderAvatar>
  <NeuronAvatar v-else-if="node.elementType === 'neuron'" :color="node.color" :weight="node.state.synWeights">
    {{ node.label }}
  </NeuronAvatar>
  <v-avatar v-else :color="nodeGroup.color" class="node-avatar" variant="tonal">
    {{ node.label }}
  </v-avatar>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { TNode, TNodeGroup } from "@/types";

import NeuronAvatar from "./NeuronAvatar.vue";
import RecorderAvatar from "./RecorderAvatar.vue";
import StimulatorAvatar from "./StimulatorAvatar.vue";

const props = defineProps<{
  node: TNode | TNodeGroup;
}>();

const node = computed(() => props.node as TNode);
const nodeGroup = computed(() => props.node as TNodeGroup);
</script>

<style lang="scss">
.node-avatar {
  font-weight: 800;
  font-size: 0.85em;
  z-index: 1;
}
</style>
