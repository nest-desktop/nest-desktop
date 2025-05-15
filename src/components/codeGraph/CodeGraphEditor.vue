<template>
  <BaklavaEditor :view-model="viewModel">
    <template #palette>
      <NodePalette />
    </template>

    <template #node="nodeProps">
      <CodeGraphNode v-bind="nodeProps" @update="onUpdate(nodeProps.node as AbstractCodeNode)" />
    </template>

    <template #sidebar="nodeProps">
      <CodeGraphSidebar v-bind="nodeProps" />
    </template>

    <!-- <template #contextMenu="contextMenu">
      <ContextMenu
        v-if="viewModel.settings.contextMenu.enabled"
        v-model="contextMenu.show.value"
        :items="contextMenu.items.value"
        :x="contextMenu.x.value"
        :y="contextMenu.y.value"
        @click="contextMenu.onClick"
      />
    </template> -->
  </BaklavaEditor>
</template>

<script setup lang="ts">
import { BaklavaEditor, useBaklava } from "@baklavajs/renderer-vue";
import { Editor } from "baklavajs";

// import { CodeGraph } from "@/helpers/codeGraph/codeGraph";
import { AbstractCodeNode } from "@/helpers/codeGraph/codeNode";
// import { provideTemporaryConnection } from "@/helpers/codeGraph/temporaryConnection";
import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";
// import { useContextMenu } from "@/helpers/codeGraph/contextMenu";

import NodePalette from "./NodePalette.vue";
import CodeGraphNode from "./CodeGraphNode.vue";
import CodeGraphSidebar from "./CodeGraphSidebar.vue";
// import { toRef } from "vue";

// const ContextMenu = Components.ContextMenu;

const codeGraphStore = useCodeGraphStore();
const viewModel = useBaklava(codeGraphStore.editor as Editor);
// const contextMenu = useContextMenu(toRef(viewModel));
// window.view = viewModel;
// window.graph = props.graph;

const onUpdate = (node: AbstractCodeNode) => node.events.update.emit(null);

// const temporaryConnection = provideTemporaryConnection();
</script>
