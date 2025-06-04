<template>
  <v-layout id="graphEditorLayout" class="graphEditorLayout" full-height>
    <template v-if="projectViewStore.state.views.graph === 'network'">
      <NetworkEditorToolbar>
        <template #ContextMenuList="{ graph }">
          <ConnectionMenuList
            v-if="graph.state.contextMenu.connection"
            :connection="(graph.state.contextMenu.connection as NESTConnection)"
          />
          <NESTNodeMenuList v-if="graph.state.contextMenu.node" :node="(graph.state.contextMenu.node as NESTNode)" />
          <NodeGroupMenuList
            v-if="graph.state.contextMenu.nodeGroup"
            :node-group="(graph.state.contextMenu.nodeGroup as TNodeGroup)"
          />
        </template>
      </NetworkEditorToolbar>

      <NESTNetworkGraph :key="currentProject.id" :network="currentProject.network" />
    </template>

    <CodeGraphEditor v-if="projectViewStore.state.views.graph === 'code'" />
  </v-layout>
</template>

<script setup lang="ts">
import CodeGraphEditor from "@/components/codeGraph/CodeGraphEditor.vue";
import ConnectionMenuList from "@/components/connection/ConnectionMenuList.vue";
import NetworkEditorToolbar from "@/components/network/NetworkEditorToolbar.vue";
import NodeGroupMenuList from "@/components/node/NodeGroupMenuList.vue";
import { TNodeGroup } from "@/types";

import NESTNetworkGraph from "../components/network/NetworkGraph.vue";
import NESTNodeMenuList from "../components/node/NESTNodeMenuList.vue";
import { NESTConnection } from "../helpers/connection/connection";
import { NESTNode } from "../helpers/node/node";

import { currentProject } from "../stores/project/projectStore";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();
const projectViewStore = appStore.currentWorkspace.views.project;
</script>
