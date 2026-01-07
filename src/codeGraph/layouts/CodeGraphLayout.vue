<template>
  <v-layout id="codeGraphLayout" full-height style="display: flex; flex-direction: column">
    <NavBar
      :editor-states="codeGraphStore.state.editorStates"
      :routes
      :view-model
      @click:remove="codeGraphStore.removeEditorState"
    />

    <splitpanes
      :maximize-panes="false"
      class="default-theme"
      style="display: flex; overflow: hidden"
      @splitter-dblclick="() => resize()"
    >
      <pane :size>
        <CodeGraphEditor :view-model>
          <template #sidebarCodeEditor="{ node }">
            <CodeEditor
              v-model="node.script"
              :locked="node.lockCode"
              @update:locked="(v: boolean) => (node.lockCode = v)"
            />
          </template>
        </CodeGraphEditor>
      </pane>

      <pane :size="100 - size">
        <CodeEditor
          v-if="viewModel.code"
          v-model="viewModel.code.script"
          :locked="viewModel.code.lockCode"
          @update:locked="(v: boolean) => (viewModel.code.lockCode = v)"
        />
      </pane>
    </splitpanes>
  </v-layout>
</template>

<script setup lang="ts">
import type { RouteLocationNormalizedGeneric } from "vue-router";
import { onBeforeRouteUpdate } from "vue-router";
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import { Splitpanes, Pane } from "splitpanes";

import { components } from "@babsey/code-graph";
const { CodeGraphEditor, NavBar } = components;

import CodeEditor from "../components/CodeEditor.vue";

import { initCodeGraph, useCodeGraphStore } from "../stores/codeGraphStore";
const codeGraphStore = useCodeGraphStore();
const viewModel = computed(() => codeGraphStore.viewModel);

import { useAppStore } from "@/app";
const appStore = useAppStore();

const currentWorkspace = computed(() => appStore.state.currentWorkspace);

const routes = { edit: currentWorkspace.value + "CodeGraphEdit", new: currentWorkspace.value + "CodeGraphNew" };

const size = ref(70);
const resize = () => (size.value = size.value == 100 ? 70 : 100);

onMounted(() => {
  viewModel.value.subscribe();
  codeGraphStore.subscribe();

  viewModel.value.engine.start();
});

onBeforeUnmount(() => {
  viewModel.value.engine.stop();

  viewModel.value.unsubscribe();
  codeGraphStore.unsubscribe();
});

onBeforeRouteUpdate((to: RouteLocationNormalizedGeneric) => initCodeGraph(to));
</script>

<style lang="scss">
#codeGraphLayout {
  background-color: var(--baklava-editor-background-pattern-default);

  .nav-tabs .nav-link.active {
    background-color: var(--baklava-toolbar-background) !important;
  }
}
</style>
