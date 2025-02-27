<template>
  <v-label v-if="nodeSpatial.positions" class="pl-3" style="width: 100%">
    Positions
    <v-spacer />

    <v-chip :title="nodeSpatial.positions.name + ' positions'" class="mx-1" label size="x-small">
      <v-icon :icon="nodeSpatial.positions?.name === 'grid' ? 'custom:dots-grid' : 'custom:dice-multiple-outline'" />
    </v-chip>

    <v-chip v-if="nodeSpatial.positions.name === 'free'" class="mx-1" label size="x-small" title="dimensions">
      {{ nodeSpatial.positions.numDimensions }}D
    </v-chip>

    <v-chip v-if="nodeSpatial.positions.name === 'grid'" class="mx-1" label size="x-small" title="shape">
      {{ nodeSpatial.positions.shape }}
    </v-chip>

    <v-chip v-if="nodeSpatial.positions.name === 'free'" class="mx-1" label size="x-small" title="size">
      {{ nodeSpatial.node.size }}
    </v-chip>

    <v-chip v-if="nodeSpatial.positions.edgeWrap" class="mx-1" label size="x-small" title="edge wrap">
      <v-icon icon="mdi:mdi-format-text-wrapping-wrap" size="small" />
    </v-chip>

    <v-btn icon size="x-small" variant="text">
      <v-icon icon="mdi:mdi-pencil" />
      <NodePositionMenu :node-spatial />
    </v-btn>
  </v-label>
</template>

<script setup lang="ts">
import { NESTNodeSpatial } from "../../helpers/node/nodeSpatial/nodeSpatial";
import NodePositionMenu from "./NodePositionMenu.vue";

defineProps<{ nodeSpatial: NESTNodeSpatial }>();
</script>
