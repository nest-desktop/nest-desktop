<template>
  <!-- <v-toolbar color="transparent" density="compact">
    <v-spacer />
    <v-btn icon="mdi:mdi-download" size="small" />
    <v-btn icon="mdi:mdi-dots-vertical" size="small" />
  </v-toolbar> -->

  <!-- <v-btn
    :icon="state.disabled ? 'mdi:mdi-pencil-off' : 'mdi:mdi-pencil'"
    @click="state.disabled = !state.disabled"
    class="ma-2"
    size="small"
    style="position: absolute; right: 10px; z-index: 10"
    title="Edit mode"
  /> -->

  <!-- <v-btn
    icon="mdi:mdi-content-copy"
    position="absolute"
    size="small"
    style="right: 12px; top: 4px; z-index: 1000"
    variant="text"
  /> -->

  <CodeMirror v-if="code" :disabled="state.disabled" :code="code" />
</template>

<script setup lang="ts">
import { reactive } from "vue";

import CodeMirror from "./CodeMirror.vue";
import { TCode } from "@/types";

defineProps<{ code: TCode }>();

const state = reactive<{
  disabled: boolean;
}>({
  disabled: false,
});
</script>
