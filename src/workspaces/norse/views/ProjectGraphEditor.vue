<template>
  <v-layout id="ProjectGraphEditor" full-height>
    <NetworkGraphEditor v-if="projectViewStore.state.views.graph === 'network'" :network="currentProject.network" />
    <ProjectCodeGraphEditor v-else-if="projectViewStore.state.views.graph === 'code'" :code="currentProject.code" />
  </v-layout>
</template>

<script setup lang="ts">
import NetworkGraphEditor from "@/networkGraph/NetworkGraphEditor.vue";
import ProjectCodeGraphEditor from "@/codeGraph/ProjectCodeGraphEditor.vue";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();
const projectViewStore = appStore.currentWorkspace?.views.project;
console.log(projectViewStore)

import { currentProject } from "../stores/project/projectStore";
</script>
