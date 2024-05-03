<template>
  <v-card :color="nodeGroup.view.color" class="ma-1" variant="tonal">
    <v-card-title>
      <v-btn
        :key="index"
        @click="node.state.select()"
        class="btn-avatar"
        flat
        icon
        v-for="(node, index) in nodeGroup.nodes"
      >
        <NodeAvatar :node size="48px" />
      </v-btn>
    </v-card-title>
  </v-card>
</template>

<script lang="ts" setup>
import { NodeGroup } from "@/helpers/node/nodeGroup";
import NodeAvatar from "./avatar/NodeAvatar.vue";

defineProps<{ nodeGroup: NodeGroup }>();
</script>

<style>
.btn-avatar {
  position: relative;
  z-index: 1;
}
</style>
