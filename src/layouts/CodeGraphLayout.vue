<template>
  <v-layout id="codeGraphLayout" full-height style="display: flex; flex-direction: column">
    <NavBar />

    <splitpanes
      :maximize-panes="false"
      class="default-theme"
      style="display: flex; overflow: hidden"
      @splitter-dblclick="() => resize()"
    >
      <pane :size>
        <CodeGraphEditor :view-model>
          <template #sidebarCodeEditor="{ node }">
            <CodeEditor v-model="node.script" :locked="node.lockCode" @update:locked="(v) => (node.lockCode = v)" />
          </template>
        </CodeGraphEditor>
      </pane>

      <pane :size="100 - size">
        <CodeEditor v-model="viewModel.code.script" />
      </pane>
    </splitpanes>
  </v-layout>
</template>

<script setup lang="ts">
import type { RouteLocationNormalizedGeneric } from "vue-router";
import { onBeforeRouteUpdate } from "vue-router";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { CodeGraphEditor } from "@babsey/code-graph";
import { Splitpanes, Pane } from "splitpanes";

import CodeEditor from "@/codeGraph/components/CodeEditor.vue";
import NavBar from "@/codeGraph/components/NavBar.vue";

import { initCodeGraph, useCodeGraphStore } from "@/stores/graph/codeGraphStore";
const codeGraphStore = useCodeGraphStore();
const viewModel = computed(() => codeGraphStore.viewModel);

const size = ref(70);
const resize = () => (size.value = size.value == 100 ? 70 : 100);

onMounted(() => {
  codeGraphStore.subscribe();
});

onBeforeUnmount(() => {
  codeGraphStore.unsubscribe();
});

onBeforeRouteUpdate((to: RouteLocationNormalizedGeneric) => {
  initCodeGraph(to);
});
</script>

<style lang="scss">
#codeGraphLayout {
  background-color: var(--baklava-editor-background-pattern-default);

  .nav-tabs .nav-link.active {
    background-color: var(--baklava-toolbar-background) !important;
  }
}
</style>
