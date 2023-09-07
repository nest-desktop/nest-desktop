<template>
  <v-chip
    :color="nodeRecord.color"
    :title="
      nodeRecord.labelCapitalize +
      (nodeRecord.unit ? ` (${nodeRecord.unit})` : '')
    "
    class="nodeRecordChip"
    label
    size="small"
  >
    {{ nodeRecord.id }}
  </v-chip>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { NodeRecord } from "@/helpers/node/nodeRecord";

const props = defineProps({
  nodeRecord: NodeRecord,
});

const nodeRecord = computed(() => props.nodeRecord as NodeRecord);
</script>

<style lang="scss">
.nodeRecordChip {
  margin: 0 1px;
}
</style>
