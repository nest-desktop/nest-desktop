<template>
  <v-row class="my-auto" no-gutters v-if="nodeSpatial.positions">
    <span class="my-1">Positions</span>
    <v-spacer />

    <v-chip
      :title="nodeSpatial.positions.name + ' positions'"
      class="mx-1"
      label
      size="x-small"
      variant="outlined"
    >
      <v-icon
        :icon="
          nodeSpatial.positions?.name === 'grid'
            ? 'custom:dotsGridIcon'
            : 'custom:diceMultipleOutlineIcon'
        "
      />
    </v-chip>

    <v-chip
      class="mx-1"
      label
      size="x-small"
      title="dimensions"
      v-if="nodeSpatial.positions.name === 'free'"
      variant="outlined"
    >
      {{ nodeSpatial.positions.numDimensions }}D
    </v-chip>

    <v-chip
      class="mx-1"
      label
      size="x-small"
      title="shape"
      v-if="nodeSpatial.positions.name === 'grid'"
      variant="outlined"
    >
      {{ nodeSpatial.positions.shape }}
    </v-chip>

    <v-chip
      class="mx-1"
      label
      size="x-small"
      title="size"
      v-if="nodeSpatial.positions.name === 'free'"
      variant="outlined"
    >
      {{ nodeSpatial.node.size }}
    </v-chip>

    <v-chip
      class="mx-1"
      label
      size="x-small"
      title="edge wrap"
      v-if="nodeSpatial.positions.edgeWrap"
      variant="outlined"
    >
      <v-icon icon="mdi:mdi-format-text-wrapping-wrap" size="small" />
    </v-chip>
  </v-row>
</template>

<script lang="ts" setup>
import { NESTNodeSpatial } from "../../helpers/node/nodeSpatial/nodeSpatial";

defineProps<{ nodeSpatial: NESTNodeSpatial }>();
</script>
