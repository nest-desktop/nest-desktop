<template>
  <div>{{ intf.name || node.label }}</div>
</template>

<script setup lang="ts">
import { AbstractCodeNode } from "@/helpers/codeGraph/codeNode";
import { CodeNodeInterface } from "@/helpers/codeGraph/interface/codeNodeInterface";

defineProps<{ node: AbstractCodeNode; intf: CodeNodeInterface }>();
</script>
