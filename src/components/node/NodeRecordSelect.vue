<template>
  <v-select
    :items="node.recordables"
    @update:model-value="node.changes()"
    attach
    chips
    class="pa-1"
    clearable
    density="compact"
    hide-details
    item-title="id"
    label="Record from"
    multiple
    persistent-hint
    return-object
    v-model="node.records"
    variant="outlined"
  >
    <template #chip="{ item }">
      <node-record-chip :node-record="item.value" />
    </template>

    <template #item="{ item, props }">
      <v-list-item :value="item.value" @click="props.onClick">
        <template #prepend="{ isSelected }">
          <v-checkbox-btn :model-value="isSelected" />
        </template>

        <template #append>
          <node-record-chip :node-record="item.value" />
        </template>

        {{ item.value.labelCapitalize }}
        <span v-if="item.value.unit"> ({{ item.value.unit }})</span>
      </v-list-item>
    </template>
  </v-select>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { Node, NodePropTypes } from "@/types/nodeTypes";
import NodeRecordChip from "./NodeRecordChip.vue";

const props = defineProps({
  node: NodePropTypes,
});

const node = computed(() => props.node as Node);
</script>
