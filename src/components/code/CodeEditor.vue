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

  <CodeMirror v-if="code" :code style="height:100%" />
</template>

<script setup lang="ts">
import CodeMirror from "./CodeMirror.vue";
import { TCode } from "@/types";

defineProps<{ code: TCode }>();
</script>
