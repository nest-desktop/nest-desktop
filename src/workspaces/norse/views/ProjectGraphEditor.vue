<template>
  <v-layout id="networkGraphLayout" class="networkGraphLayout" full-height>
    <NetworkEditorToolbar />

    <NetworkGraph
      v-if="projectViewStore.state.views.graph === 'network'"
      :key="currentProject.id"
      :network="currentProject.network"
    />

    <CodeGraphEditor v-if="projectViewStore.state.views.graph === 'code'" :graph="currentProject.code.graph" />
  </v-layout>
</template>

<script setup lang="ts">
import CodeGraphEditor from "@/components/codeGraph/CodeGraphEditor.vue";

import NetworkGraph from "@/components/network/NetworkGraph.vue";
import NetworkEditorToolbar from "@/components/network/NetworkEditorToolbar.vue";

import { currentProject } from "../stores/project/projectStore";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();
const projectViewStore = appStore.currentWorkspace.views.project;
</script>
