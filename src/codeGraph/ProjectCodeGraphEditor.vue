<template>
  <v-layout id="ProjectCodeGraphEditor" full-height>
    <CodeGraphEditor :view-model="code.viewModel">
      <template #sidebarCodeEditor="{ node }">
        <CodeEditor v-model="node.script" :locked="node.lockCode" @update:locked="(v) => (node.lockCode = v)" />
      </template>
    </CodeGraphEditor>
  </v-layout>
</template>

<script setup lang="ts">
import { CodeGraphEditor } from "@babsey/code-graph";

import CodeEditor from "./components/CodeEditor.vue";

import { ProjectCode } from "./projectCode";

defineProps<{ code: ProjectCode }>();
</script>
