<template>
  <div>
    <v-select
      :key="node.hash"
      :items="node.recordables"
      @update:model-value="nextTick(() => node.changes())"
      base-color="primary"
      chips
      class="pa-1"
      clearable
      closable-chips
      color="primary"
      density="compact"
      hide-details
      item-title="title"
      item-value="groupId"
      label="Record from"
      multiple
      persistent-hint
      return-object
      v-model="node.records"
    >
      <template #chip="{ item }" v-if="node.records.length > 0">
        <NodeRecordChip
          :nodeRecord="(node.getNodeRecord(item.value) as NodeRecord)"
          v-if="node.getNodeRecord(item.value)"
        />
      </template>

      <template #item="{ item, props }" v-if="node.records.length > 0">
        <v-list-item v-bind="props" density="compact" title="">
          <v-checkbox
            :label="item.title"
            :model-value="node.records.includes(item.raw)"
            density="compact"
            hide-details
          >
            <template #append>
              <NodeRecordChip
                :nodeRecord="(node.getNodeRecord(item.value) as NodeRecord)"
                class="my-auto"
                v-if="node.getNodeRecord(item.value)"
              />
            </template>
          </v-checkbox>
        </v-list-item>
      </template>
    </v-select>
  </div>
</template>

<script lang="ts" setup>
import { nextTick } from "vue";

import NodeRecordChip from "./NodeRecordChip.vue";
import { NodeRecord } from "@/helpers/node/nodeRecord";
import { TNode } from "@/types";

defineProps<{ node: TNode }>();
</script>
