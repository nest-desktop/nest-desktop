<template>
  <v-layout id="ProjectGraphEditor" full-height>
    <NetworkGraphEditor v-if="projectViewStore.state.views.graph === 'network'" />
    <ProjectCodeGraphEditor v-else-if="projectViewStore.state.views.graph === 'code'" />
  </v-layout>
</template>

<script setup lang="ts">
import ProjectCodeGraphEditor from "@/components/project/ProjectCodeGraphEditor.vue";

import NetworkGraphEditor from "../components/network/NetworkGraphEditor.vue";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();
const projectViewStore = appStore.currentWorkspace?.views.project;
</script>
