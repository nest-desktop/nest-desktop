<template>
  <div>
    <v-select
      :key="node.hash"
      :items="node.recordables"
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
      @update:model-value="nextTick(() => node.changes())"
      label="Record from"
      multiple
      persistent-hint
      return-object
      v-model="node.records"
    >
      <template
        v-if="node.records.length > 0"
        #chip="{ item }"
      >
        <NodeRecordChip
          v-if="node.getNodeRecord(item.value)"
          :node-record="(node.getNodeRecord(item.value) as NodeRecord)"
        />
      </template>

      <template
        v-if="node.records.length > 0"
        #item="{ item, props }"
      >
        <v-list-item
          v-bind="props"
          density="compact"
          title=""
        >
          <v-checkbox
            :label="item.title"
            :model-value="node.records.includes(item.raw)"
            density="compact"
            hide-details
          >
            <template #append>
              <NodeRecordChip
                v-if="node.getNodeRecord(item.value)"
                :node-record="(node.getNodeRecord(item.value) as NodeRecord)"
                class="my-auto"
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
