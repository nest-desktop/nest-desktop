<template>
  <NetworkGraphEditorToolbar>
    <template #ContextMenuList="{ graph }">
      <ConnectionMenuList v-if="graph.state.contextMenu.connection" :connection="graph.state.contextMenu.connection" />
      <NESTNodeMenuList v-if="graph.state.contextMenu.node" :node="graph.state.contextMenu.node" />
      <NodeGroupMenuList v-if="graph.state.contextMenu.nodeGroup" :node-group="graph.state.contextMenu.nodeGroup" />
    </template>
  </NetworkGraphEditorToolbar>

  <NESTNetworkGraph :key="network.project.id" :network />
</template>

<script setup lang="ts">
import { NetworkGraphEditorToolbar } from "@/networkGraph/components";
import { ConnectionMenuList, NodeGroupMenuList } from "@/network/components";

import { NESTNodeMenuList } from "../../network/components";
import type { NESTNetwork } from "../../network";

import NESTNetworkGraph from "./NetworkGraph.vue";

defineProps<{ network: NESTNetwork }>();
</script>
