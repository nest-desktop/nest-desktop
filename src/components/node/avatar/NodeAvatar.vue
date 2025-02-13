<template>
  <StimulatorAvatar v-if="node.elementType === 'stimulator'" :color="node.view.color">
    {{ node.view.label }}
  </StimulatorAvatar>
  <RecorderAvatar v-else-if="node.elementType === 'recorder'" :color="node.view.color">
    {{ node.view.label }}
  </RecorderAvatar>
  <NeuronAvatar v-else-if="node.elementType === 'neuron'" :color="node.view.color" :weight="node.view.synWeights">
    {{ node.view.label }}
  </NeuronAvatar>
  <v-avatar v-else :color="nodeGroup.view.color" class="node-avatar" variant="tonal">
    {{ node.view.label }}
  </v-avatar>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { TNode, TNodeGroup } from "@/types";

import NeuronAvatar from "./NeuronAvatar.vue";
import RecorderAvatar from "./RecorderAvatar.vue";
import StimulatorAvatar from "./StimulatorAvatar.vue";

const props = defineProps<{
  node: TNodeGroup | TNode;
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
