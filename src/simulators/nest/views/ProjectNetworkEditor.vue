<template>
  <v-layout class="networkGraphLayout" full-height id="networkGraphLayout">
    <NetworkEditorToolbar>
      <template #ContextMenuList="{ graph }">
        <ConnectionMenuList
          :connection="(graph.state.contextMenu.connection as NESTConnection)"
          v-if="graph.state.contextMenu.connection"
        />
        <NESTNodeMenuList
          :node="(graph.state.contextMenu.node as NESTNode)"
          v-if="graph.state.contextMenu.node"
        />
        <NodeGroupMenuList
          :nodeGroup="(graph.state.contextMenu.nodeGroup as NodeGroup)"
          v-if="graph.state.contextMenu.nodeGroup"
        />
      </template>
    </NetworkEditorToolbar>
    <NetworkGraph :key="network.project.id" :network>
      <template #marker="{ connection }">
        <circle
          fill="transparent"
          r="4"
          stroke="currentcolor"
          transform="translate(5,5)"
          v-if="connection.view.markerEndLabel === 'assigned'"
        />
      </template>

      <template #components>
        <g id="nodeGroups" />
        <g id="modelAssigned" />
        <g id="connections" />
        <g id="nodes" />
      </template>
    </NetworkGraph>
  </v-layout>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import ConnectionMenuList from "@/components/connection/ConnectionMenuList.vue";
import NetworkEditorToolbar from "@/components/network/NetworkEditorToolbar.vue";
import NetworkGraph from "@/components/network/NetworkGraph.vue";
import NodeGroupMenuList from "@/components/node/NodeGroupMenuList.vue";
import { NodeGroup } from "@/helpers/node/nodeGroup";
import { TProjectStore } from "@/stores/project/defineProjectStore";

import NESTNodeMenuList from "../components/node/NESTNodeMenuList.vue";
import { NESTConnection } from "../helpers/connection/connection";
import { NESTNetwork } from "../helpers/network/network";
import { NESTNode } from "../helpers/node/node";

import { useNESTProjectStore } from "../stores/project/projectStore";
const projectStore: TProjectStore = useNESTProjectStore();

const network = computed(
  () => projectStore.state.project.network as NESTNetwork
);
</script>
