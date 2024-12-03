<template>
  <v-layout id="networkGraphLayout" class="networkGraphLayout" full-height>
    <NetworkEditorToolbar>
      <template #ContextMenuList="{ graph }">
        <ConnectionMenuList
          v-if="graph.state.contextMenu.connection"
          :connection="(graph.state.contextMenu.connection as NESTConnection)"
        />
        <NESTNodeMenuList v-if="graph.state.contextMenu.node" :node="(graph.state.contextMenu.node as NESTNode)" />
        <NodeGroupMenuList
          v-if="graph.state.contextMenu.nodeGroup"
          :node-group="(graph.state.contextMenu.nodeGroup as NodeGroup)"
        />
      </template>
    </NetworkEditorToolbar>
    <NetworkGraph :key="network.project.id" :network>
      <template #marker="{ connection }">
        <circle
          v-if="connection.view.markerEndLabel === 'assigned'"
          fill="transparent"
          r="4"
          stroke="currentcolor"
          transform="translate(5,5)"
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

const network = computed(() => projectStore.state.project.network as NESTNetwork);
</script>
