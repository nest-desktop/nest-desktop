<template>
  <NetworkGraphEditorToolbar>
    <template #ContextMenuList="{ graph }">
      <ConnectionMenuList
        v-if="graph.state.contextMenu.connection"
        :connection="graph.state.contextMenu.connection as NESTConnection"
      />
      <NESTNodeMenuList v-if="graph.state.contextMenu.node" :node="graph.state.contextMenu.node as NESTNode" />
      <NodeGroupMenuList
        v-if="graph.state.contextMenu.nodeGroup"
        :node-group="graph.state.contextMenu.nodeGroup as TNodeGroup"
      />
    </template>
  </NetworkGraphEditorToolbar>

  <NESTNetworkGraph :key="network.project.id" :network />
</template>

<script setup lang="ts">
import ConnectionMenuList from "@/networkGraph/components/connection/ConnectionMenuList.vue";
import NetworkGraphEditorToolbar from "@/networkGraph/components/NetworkGraphEditorToolbar.vue";
import NodeGroupMenuList from "@/networkGraph/components/node/NodeGroupMenuList.vue";
import type { TNodeGroup } from "@/types";

import NESTNodeMenuList from "../node/NESTNodeMenuList.vue";
import type { NESTNetwork, NESTNode, NESTConnection } from "../../types";

import NESTNetworkGraph from "./NetworkGraph.vue";

defineProps<{ network: NESTNetwork }>();
</script>
