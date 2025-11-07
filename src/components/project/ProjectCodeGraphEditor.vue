<template>
  <v-layout id="ProjectCodeGraphEditor" full-height>
    <CodeGraphEditor :view-model="codeViewModel">
      <template #sidebarCodeEditor="{ node }">
        <CodeEditor v-model="node.script" :locked="node.lockCode" @update:locked="(v) => (node.lockCode = v)" />
      </template>
    </CodeGraphEditor>
  </v-layout>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { CodeGraphEditor } from "@babsey/code-graph";

import CodeEditor from "@/codeGraph/components/CodeEditor.vue";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();
const projectStore = computed(() => appStore.currentWorkspace.stores.projectStore);
const project = computed(() => projectStore.value.state.project);
const codeViewModel = computed(() => project.value.code.viewModel);
</script>
