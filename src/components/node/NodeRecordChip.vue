<template>
  <v-menu transition="slide-y-transition">
    <template #activator="{ props }">
      <v-chip
        :color="nodeRecord.color"
        :title="nodeRecord.title"
        class="nodeRecordChip"
        label
        size="small"
        variant="outlined"
        v-bind="props"
      >
        {{ nodeRecord.id }}
      </v-chip>
    </template>

    <v-color-picker
      @update:modelValue="updateRecordsColor()"
      flat
      show-swatches
      style="border-radius: 0"
      v-model="nodeRecord.color"
    />
  </v-menu>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { NodeRecord } from "@/helpers/node/nodeRecord";

const props = defineProps({
  nodeRecord: NodeRecord,
});

const nodeRecord = computed(() => props.nodeRecord as NodeRecord);

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
