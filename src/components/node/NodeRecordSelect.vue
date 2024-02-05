<template>
  <v-select
    :items="node.recordables"
    @update:modelValue="node.changes()"
    attach
    chips
    class="pa-1"
    clearable
    density="compact"
    hideDetails
    itemTitle="id"
    label="Record from"
    multiple
    persistentHint
    returnObject
    v-model="node.records"
    variant="outlined"
  >
    <template #chip="{ item }">
      <node-record-chip :nodeRecord="item.value" />
    </template>

    <template #item="{ item, props }">
      <v-list-item :value="item.value" @click="props.onClick">
        <template #prepend="{ isSelected }">
          <v-checkbox-btn :modelValue="isSelected" />
        </template>

        <template #append>
          <node-record-chip :nodeRecord="item.value" />
        </template>

        {{ item.value.labelCapitalize }}
        <span v-if="item.value.unit">({{ item.value.unit }})</span>
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
