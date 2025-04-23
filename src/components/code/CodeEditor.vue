<template>
  <v-toolbar class="px-2" color="transparent" density="compact">
    <v-btn-group variant="text">
      <v-btn icon="mdi:mdi-refresh" size="small" @click="() => code.graph.onUpdate()" />
      <v-btn icon="mdi:mdi-sort" size="small" @click="() => (state.showTree = !state.showTree)" />
    </v-btn-group>
    <div style="height: 100%; display: flex; justify-content: flex-end">
      <v-checkbox
        v-model="codeGraphStore.state.autosort"
        density="compact"
        hide-details
        label="autosort"
        @update:modelValue="() => code.graph.onUpdate()"
      />
    </div>
    <v-spacer />
    <v-btn-group variant="text">
      <v-btn icon="mdi:mdi-download" size="small" />
      <v-btn icon="mdi:mdi-dots-vertical" size="small" />
    </v-btn-group>
  </v-toolbar>

  <CodeTreeview v-if="state.showTree" :code />
  <CodeMirror v-if="code" :disabled="state.disabled" :code="code" />
</template>

<script setup lang="ts">
import { computed, reactive } from "vue";

import CodeTreeview from "../codeGraph/CodeTreeview.vue";
import CodeMirror from "./CodeMirror.vue";
import { TCode } from "@/types";

import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";
const codeGraphStore = useCodeGraphStore();

defineProps<{ code: TCode }>();

const state = reactive<{
  disabled: boolean;
  showTree: boolean;
}>({
  disabled: false,
  showTree: false,
});
</script>
