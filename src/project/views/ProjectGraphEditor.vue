<template>
  <v-layout v-if="projectStore.state.project" id="ProjectGraphEditor" full-height>
    <NetworkGraphEditor
      v-if="projectViewStore.state.views.graph === 'network'"
      :network="projectStore.state.project.network"
    />
    <ProjectCodeGraphEditor
      v-else-if="projectViewStore.state.views.graph === 'code'"
      :code="projectStore.state.project.code"
    />
  </v-layout>
</template>

<script setup lang="ts">
import { NetworkGraphEditor } from "@/networkGraph/components";
import { ProjectCodeGraphEditor } from "@/codeGraph/components";
import { getCurrentStore, getCurrentViewStore } from "@/app";

const projectViewStore = getCurrentViewStore("project");
const projectStore = getCurrentStore("project");
</script>
