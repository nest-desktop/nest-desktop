<template>
  <v-layout id="ProjectGraphEditor" full-height>
    <NESTNetworkGraphEditor v-if="projectViewStore.state.views.graph === 'network'" :network="currentProject.network" />
    <ProjectCodeGraphEditor v-else-if="projectViewStore.state.views.graph === 'code'" :code="currentProject.code" />
  </v-layout>
</template>

<script setup lang="ts">
import ProjectCodeGraphEditor from "@/codeGraph/ProjectCodeGraphEditor.vue";

import NESTNetworkGraphEditor from "../networkGraph/components/networkGraph/NetworkGraphEditor.vue";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();
const projectViewStore = appStore.currentWorkspace?.views.project;

import { currentProject } from "../stores/project/projectStore";
</script>
