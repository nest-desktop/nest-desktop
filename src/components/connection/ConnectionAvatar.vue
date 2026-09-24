<template>
  <div>
    <NodeAvatar
      :node="connection.source"
      @click="connection.source.toggleSelection()"
      @click.right.prevent="connection.source.unselect()"
    />

    <v-icon :color="connection.sourceNode.view.color" :icon="connection.synapse.icon" class="mx-2" />

    <NodeAvatar
      :node="connection.target"
      @click="connection.target.toggleSelection()"
      @click.right.prevent="connection.target.unselect()"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { TConnection } from "@/types";
import NodeAvatar from "../node/avatar/NodeAvatar.vue";

const props = defineProps<{ connection: TConnection }>();
const connection = computed(() => props.connection);
</script>
