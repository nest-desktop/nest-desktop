<template>
  <v-layout v-if="currentProject" id="ProjectGraphEditor" full-height>
    <NetworkGraphEditor v-if="projectViewStore.state.views.graph === 'network'" :network="currentProject.network" />
    <ProjectCodeGraphEditor v-else-if="projectViewStore.state.views.graph === 'code'" :code="currentProject.code" />
  </v-layout>
</template>

<script setup lang="ts">
import { ProjectCodeGraphEditor } from "@/codeGraph/components";
import { getCurrentViewStore } from "@/app";

import { NetworkGraphEditor } from "../../networkGraph/components";
import { currentProject } from "../stores/projectStore";

const projectViewStore = getCurrentViewStore("project");
</script>
