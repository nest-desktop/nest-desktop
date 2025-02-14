<template>
  <v-toolbar color="transparent" density="compact">
    <v-spacer />
    <v-btn icon="mdi:mdi-download" size="small" />
    <v-btn icon="mdi:mdi-dots-vertical" size="small" />
  </v-toolbar>

  <!-- <v-btn
    :icon="state.disabled ? 'mdi:mdi-pencil-off' : 'mdi:mdi-pencil'"
    @click="state.disabled = !state.disabled"
    class="ma-2"
    size="small"
    style="position: absolute; right: 10px; z-index: 10"
    title="Edit mode"
  /> -->

  <CodeMirror v-if="code" :disabled="state.disabled" :code="code" />
</template>

<script lang="ts" setup>
import { reactive } from "vue";

import CodeMirror from "./CodeMirror.vue";
import IconBtn from "../common/IconBtn.vue";
import { TCode } from "@/types";

defineProps<{ code: TCode }>();

const state = reactive<{
  disabled: boolean;
}>({
  disabled: false,
});
</script>
