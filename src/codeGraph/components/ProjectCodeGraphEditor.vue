<template>
  <v-layout id="ProjectCodeGraphEditor" full-height>
    <CodeGraphEditor :view-model="code.viewModel">
      <template #sidebarCodeEditor="{ node }">
        <CodeEditor
          v-model="node.script"
          :locked="node.lockCode"
          @update:locked="(v: boolean) => (node.lockCode = v)"
        />
      </template>
    </CodeGraphEditor>
  </v-layout>
</template>

<script setup lang="ts">
import { components } from "@babsey/code-graph";
const { CodeGraphEditor } = components;

import CodeEditor from "./CodeEditor.vue";

import type { ProjectCode } from "../projectCode";

defineProps<{ code: ProjectCode }>();
</script>

<style lang="scss">
:root {
  --baklava-node-color-background: rgba(27, 32, 44, 0.5);
}
</style>
