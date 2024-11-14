<template>
  <v-label class="pl-3" style="width: 100%" v-if="nodeSpatial.positions">
    Positions
    <v-spacer />

    <v-chip
      :title="nodeSpatial.positions.name + ' positions'"
      class="mx-1"
      label
      size="x-small"
    >
      <v-icon
        :icon="
          nodeSpatial.positions?.name === 'grid'
            ? 'custom:dots-grid'
            : 'custom:dice-multiple-outline'
        "
      />
    </v-chip>

    <v-chip
      class="mx-1"
      label
      size="x-small"
      title="dimensions"
      v-if="nodeSpatial.positions.name === 'free'"
    >
      {{ nodeSpatial.positions.numDimensions }}D
    </v-chip>

    <v-chip
      class="mx-1"
      label
      size="x-small"
      title="shape"
      v-if="nodeSpatial.positions.name === 'grid'"
    >
      {{ nodeSpatial.positions.shape }}
    </v-chip>

    <v-chip
      class="mx-1"
      label
      size="x-small"
      title="size"
      v-if="nodeSpatial.positions.name === 'free'"
    >
      {{ nodeSpatial.node.size }}
    </v-chip>

    <v-chip
      class="mx-1"
      label
      size="x-small"
      title="edge wrap"
      v-if="nodeSpatial.positions.edgeWrap"
    >
      <v-icon icon="mdi:mdi-format-text-wrapping-wrap" size="small" />
    </v-chip>

    <v-btn icon size="x-small" variant="text">
      <v-icon icon="mdi:mdi-pencil" />
      <NodePositionMenu :nodeSpatial />
    </v-btn>
  </v-label>
</template>

<script lang="ts" setup>
import { NESTNodeSpatial } from "../../helpers/node/nodeSpatial/nodeSpatial";
import NodePositionMenu from "./NodePositionMenu.vue";

defineProps<{ nodeSpatial: NESTNodeSpatial }>();
</script>
