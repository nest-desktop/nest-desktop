<template>
  <div style="pointer-events: none">
    <v-btn icon size="small">
      <NodeAvatar :node="connection.source" size="32px" />
    </v-btn>

    <v-btn
      :color="connection.source.view.color"
      :icon="connection.synapse.icon"
      size="small"
      variant="text"
    />

    <v-btn icon size="small">
      <NodeAvatar :node="connection.target" size="32px" />
    </v-btn>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { Connection, ConnectionPropTypes } from "@/types/connectionTypes";
import NodeAvatar from "@/components/node/avatar/NodeAvatar.vue";

const props = defineProps({
  connection: ConnectionPropTypes,
});

const connection = computed(() => props.connection as Connection);
</script>
