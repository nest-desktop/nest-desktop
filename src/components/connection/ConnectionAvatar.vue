<template>
  <div>
    <v-btn
      class="rounded-circle"
      icon
      size="small"
      variant="text"
      @click="connection.source.toggleSelection()"
      @click.right.prevent="connection.source.unselect()"
    >
      <NodeAvatar :node="connection.source" />
    </v-btn>

    <v-btn :color="connection.sourceNode.view.color" :icon="connection.synapse.icon" size="small" variant="text" />

    <v-btn
      class="rounded-circle"
      icon
      size="small"
      variant="text"
      @click="connection.target.toggleSelection()"
      @click.right.prevent="connection.target.unselect()"
    >
      <NodeAvatar :node="connection.target" />
    </v-btn>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { TConnection } from "@/types";
import NodeAvatar from "../node/avatar/NodeAvatar.vue";

const props = defineProps<{ connection: TConnection }>();
const connection = computed(() => props.connection);
</script>
