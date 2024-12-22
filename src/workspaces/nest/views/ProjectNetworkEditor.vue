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
    <NetworkGraph :key="currentProject.id" :network="currentProject.network">
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
import ConnectionMenuList from "@/components/connection/ConnectionMenuList.vue";
import NetworkEditorToolbar from "@/components/network/NetworkEditorToolbar.vue";
import NetworkGraph from "@/components/network/NetworkGraph.vue";
import NodeGroupMenuList from "@/components/node/NodeGroupMenuList.vue";
import { NodeGroup } from "@/helpers/node/nodeGroup";

import NESTNodeMenuList from "../components/node/NESTNodeMenuList.vue";
import { NESTConnection } from "../helpers/connection/connection";
import { NESTNode } from "../helpers/node/node";

import { currentProject } from "../stores/project/projectStore";
</script>
