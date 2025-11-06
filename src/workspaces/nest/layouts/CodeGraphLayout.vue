<template>
  <v-layout id="projectGraphEditor" full-height>
    <splitpanes
      :maximize-panes="false"
      class="default-theme"
      style="display: flex; overflow: hidden; height: calc(100vh - 40px)"
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
        <CodeEditor v-if="viewModel.code" v-model="viewModel.code.state.script" />
      </pane>
    </splitpanes>
  </v-layout>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { CodeGraphEditor } from "@babsey/code-graph";
import { Splitpanes, Pane } from "splitpanes";

import CodeEditor from "@/codeGraph/components/CodeEditor.vue";

import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";
const codeGraphStore = useCodeGraphStore();
const viewModel = computed(() => codeGraphStore.viewModel);

const size = ref(70);
const resize = () => (size.value = size.value == 100 ? 70 : 100);
</script>
