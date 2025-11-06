<template>
  <v-layout id="ProjectCodeGraphEditor" full-height>
    <CodeGraphEditor :view-model>
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

import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";
const codeGraphStore = useCodeGraphStore();
const viewModel = computed(() => codeGraphStore.viewModel);
</script>
