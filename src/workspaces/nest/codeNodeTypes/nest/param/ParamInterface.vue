<template>
  <div :title="intf.state?.script">{{ intf.name }}</div>
</template>

<script setup lang="ts">
import type { ParamInterface } from "./ParamInterface";

defineProps<{ intf: ParamInterface }>();
</script>
