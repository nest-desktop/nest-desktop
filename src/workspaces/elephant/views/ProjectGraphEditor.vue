<template>
  <v-layout full-height>
    <CodeGraphEditor :graph="currentProject.code.graph" />
  </v-layout>
</template>

<script setup lang="ts">
import CodeGraphEditor from "@/components/codeGraph/CodeGraphEditor.vue";

import { currentProject } from "../stores/project/projectStore";
</script>
