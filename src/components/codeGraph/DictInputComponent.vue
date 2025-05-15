<!-- DictInputComponent.vue -->

<template>
  <button>{{ intf.name }}</button>
</template>

<script setup lang="ts">
import { AbstractCodeNode } from "@/helpers/codeGraph/codeNode";
import { NodeInputInterface } from "@/helpers/codeGraph/interface/nodeInputInterface";

defineProps<{ intf: NodeInputInterface; node: AbstractCodeNode }>();
</script>
