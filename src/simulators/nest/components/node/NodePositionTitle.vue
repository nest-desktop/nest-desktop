<template>
  <div class="NodePositionTitle" v-if="nodeSpatial.positions">
    <v-row no-gutters>
      Positions
      <v-spacer />

      <v-chip
        :icon="
          nodeSpatial.positions.name === 'grid'
            ? '$dotsGrid'
            : '$diceMultipleOutline'
        "
        :title="nodeSpatial.positions.name"
        class="mx-1"
        label
        size="small"
        variant="outlined"
      />

      <v-chip
        class="mx-1"
        label
        size="small"
        v-if="nodeSpatial.positions.name === 'free'"
        variant="outlined"
      >
        {{ nodeSpatial.positions.numDimensions }}D
      </v-chip>

      <v-chip
        class="mx-1"
        label
        size="small"
        v-if="nodeSpatial.positions.name === 'grid'"
        variant="outlined"
      >
        {{ nodeSpatial.positions.shape }}
      </v-chip>

      <v-chip
        class="mx-1"
        label
        size="small"
        v-if="nodeSpatial.positions.name === 'free'"
        variant="outlined"
      >
        {{ nodeSpatial.node.size }}
      </v-chip>

      <v-chip
        class="mx-1"
        label
        small
        v-if="nodeSpatial.positions.edgeWrap"
        variant="outlined"
      >
        <v-icon icon="mdi:mdi-format-text-wrapping-wrap" small />
      </v-chip>
    </v-row>
  </div>
</template>

<script lang="ts" setup>
import { NESTNodeSpatial } from "../../helpers/node/nodeSpatial/nodeSpatial";

defineProps<{ nodeSpatial: NESTNodeSpatial }>();
</script>
