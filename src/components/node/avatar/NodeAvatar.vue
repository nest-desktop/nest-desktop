<template>
  <StimulatorAvatar v-if="node.elementType === 'stimulator'" :color="node.view.color" class="node-avatar">
    {{ node.view.label }}
  </StimulatorAvatar>
  <RecorderAvatar v-else-if="node.elementType === 'recorder'" :color="node.view.color" class="node-avatar">
    {{ node.view.label }}
  </RecorderAvatar>
  <NeuronAvatar
    v-else-if="node.elementType === 'neuron'"
    :color="node.view.color"
    :weight="node.view.synWeights"
    class="node-avatar"
  >
    {{ node.view.label }}
  </NeuronAvatar>
  <v-avatar v-else :color="nodeGroup.view.color" class="node-avatar" variant="tonal">
    {{ node.view.label }}
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

const node = computed(() => props.node);
const nodeGroup = computed(() => props.node);
</script>

<style lang="scss">
.node-avatar {
  cursor: pointer;

  .label {
    font-weight: 900;
    font-size: 0.7em;
    text-transform: uppercase;
    z-index: 1;
  }

  .icon-size {
    --v-icon-size-multiplier: 2;
  }
}
</style>
