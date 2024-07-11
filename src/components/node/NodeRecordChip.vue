<template>
  <v-menu transition="slide-y-transition">
    <template #activator="{ props }">
      <v-chip
        :color="nodeRecord.state.color"
        :title="nodeRecord.title"
        class="nodeRecordChip"
        label
        size="small"
        variant="outlined"
        v-bind="props"
      >
        {{ nodeRecord.id }}
        <div class="mx-1">{{ nodeRecord.uuid.slice(0, 6) }}</div>
      </v-chip>
    </template>

    <v-color-picker
      @update:model-value="updateRecordsColor()"
      flat
      show-swatches
      style="border-radius: 0"
      v-model="nodeRecord.state.color"
    />
  </v-menu>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { NodeRecord } from "@/helpers/node/nodeRecord";

const props = defineProps<{ nodeRecord: NodeRecord }>();
const nodeRecord = computed(() => props.nodeRecord);

/**
 * Triggers when record color is changed.
 */
const updateRecordsColor = () => {
  nodeRecord.value.node.network.project.activityGraph.activityChartGraph.updateRecordsColor();
};
</script>

<style lang="scss">
.nodeRecordChip {
  margin: 0 1px;
}
</style>
