<template>
  <div>
    <v-select
      :items="node.recordables"
      @update:model-value="node.changes()"
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
      variant="outlined"
    >
      <template #chip="{ item }">
        <NodeRecordChip
          :nodeRecord="item.raw as NodeRecord"
          @click.prevent=""
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
