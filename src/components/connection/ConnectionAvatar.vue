<template>
  <div style="pointer-events: none">
    <v-btn icon size="small">
      <NodeAvatar :node="connection.sourceNode" :size="32" />
    </v-btn>

    <v-btn
      :color="connection.sourceNode.view.color"
      :icon="connection.synapse.icon"
      size="small"
      variant="text"
    />

    <v-btn icon size="small">
      <NodeAvatar :node="connection.targetNode" :size="32" />
    </v-btn>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { TConnection } from "@/types/connectionTypes";
import NodeAvatar from "../node/avatar/NodeAvatar.vue";

const props = defineProps<{ connection: TConnection }>();
const connection = computed(() => props.connection);
</script>
