<template>
  <NodeMenuList :node>
    <template #prependItem="{ node: nestNode }">
      <v-list-item v-if="!nestNode.model?.isRecorder">
        <!-- <template #prepend>
            <v-icon icon="mdi:mdi-contrast" />
          </template> -->

        <v-checkbox
          :class="{
            'text-blue': nestNode.view.state.synWeights === 'excitatory',
            'text-red': nestNode.view.state.synWeights === 'inhibitory',
          }"
          :indeterminate="!nestNode.view.state.synWeights"
          :model-value="nestNode.view.state.synWeights"
          density="compact"
          false-icon="mdi:mdi-minus"
          false-value="inhibitory"
          hide-details
          indeterminate-icon="mdi:mdi-plus-minus-variant"
          true-icon="mdi:mdi-plus"
          true-value="excitatory"
          @update:model-value="(value) => updateSynWeights(nestNode, value)"
        >
          <template #label>
            <span class="ml-7">Set all synaptic weights</span>
          </template>
        </v-checkbox>
      </v-list-item>
    </template>
  </NodeMenuList>
</template>

<script setup lang="ts">
import { NodeMenuList } from "@/network/components";

import type { NESTNode } from "@/workspaces/nest/types";

import { useNetworkGraph } from "@/networkGraph/useNetworkGraph";
const networkGraph = useNetworkGraph();

defineProps<{ node?: NESTNode }>();

/**
 * Update synaptic weights.
 *
 * @param value string
 */
const updateSynWeights = (node: NESTNode, value: string | null) => {
  if (value == null) return;

  node.view.synWeights = value;
  node.changes({ preventSimulation: true });

  networkGraph.value?.render();
};
</script>
