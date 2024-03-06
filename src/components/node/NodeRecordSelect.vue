<template>
  <div>
    <v-select
      :items="node.recordables"
      @update:modelValue="node.changes()"
      baseColor="primary"
      chips
      class="pa-1"
      clearable
      closableChips
      color="primary"
      density="compact"
      hideDetails
      itemTitle="title"
      itemValue="groupId"
      label="Record from"
      multiple
      persistentHint
      returnObject
      v-model="node.records"
      variant="outlined"
    >
      <template #chip="{ item }">
        <node-record-chip
          :nodeRecord="item.raw as NodeRecord"
          @click="(e) => e.preventDefault()"
        />
      </template>
    </v-select>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import NodeRecordChip from "@/components/node/NodeRecordChip.vue";
import { NodeRecord } from "@/helpers/node/nodeRecord";
import { Node, NodePropTypes } from "@/types/nodeTypes";

const props = defineProps({
  node: NodePropTypes,
});

const node = computed(() => props.node as Node);
</script>
