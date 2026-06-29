<template>
  <component
    :is="avatarComponents[node.elementType]"
    v-if="node.elementType"
    :color="node.view.color"
    :weight="node.view.synWeights"
    class="node-avatar"
  >
    {{ node.codeNode?.variableName ?? node.view.label }}
  </component>
  <v-avatar v-else :color="nodeGroup.view.color" class="node-avatar">
    {{ node.codeNode?.variableName ?? node.view.label }}
  </v-avatar>
</template>

<script setup lang="ts">
import { computed, type Component } from "vue";

import type { TNode, TNodeGroup } from "@/types";
import { TNodeElementType } from "@/model";

import NeuronAvatar from "./NeuronAvatar.vue";
import RecorderAvatar from "./RecorderAvatar.vue";
import StimulatorAvatar from "./StimulatorAvatar.vue";

const props = defineProps<{
  node: TNode | TNodeGroup;
}>();

const node = computed(() => props.node as TNode);
const nodeGroup = computed(() => props.node as TNodeGroup);

const avatarComponents: Record<TNodeElementType, Component> = {
  stimulator: StimulatorAvatar,
  recorder: RecorderAvatar,
  neuron: NeuronAvatar,
};
</script>

<style lang="scss">
.node-avatar {
  background: transparent !important;
  // font-weight: 800;
  // font-size: 0.85em;
  // z-index: 1;
}
</style>
