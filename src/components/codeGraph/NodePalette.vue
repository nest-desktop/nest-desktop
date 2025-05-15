<template>
  <div class="baklava-node-palette pa-0">
    <!-- <v-text-field
      v-model="searchQuery"
      hide-details
      density="compact"
      placeholder="Enter python module"
      variant="outlined"
    /> -->

    <v-combobox
      v-model="searchQuery"
      :items="categoryNames"
      class="mt-2"
      clearable
      density="compact"
      hide-details
      label="Python module"
      variant="outlined"
    />

    <v-list v-if="categories" class="pa-0" density="compact" theme="dark">
      <template v-for="c in filteredCategories" :key="c.name">
        <v-list-subheader :title="c.name" />
        <v-list-item v-for="(ni, nt) in c.nodeTypes" :key="nt" class="pa-0 ma-0" style="margin: 2px 0 !important">
          <PaletteEntry :type="nt" :title="ni.title" class="pa-0 ma-0" @pointerdown="onDragStart(nt, ni)" />
        </v-list-item>
      </template>
    </v-list>
  </div>

  <transition name="fade">
    <div v-if="draggedNode" class="baklava-dragged-node" :style="draggedNodeStyles">
      <PaletteEntry :type="draggedNode.type" :title="draggedNode.nodeInformation.title" />
    </div>
  </transition>
</template>

<script setup lang="ts">
import { AbstractNode, INodeTypeInformation } from "@baklavajs/core";
import { CSSProperties, Ref, computed, inject, reactive, ref } from "vue";
import { usePointer } from "@vueuse/core";
import { useViewModel, useTransform, useNodeCategories } from "@baklavajs/renderer-vue";

import PaletteEntry from "./PaletteEntry.vue";
// import { useViewModel, useTransform, useNodeCategories } from "../utility";

interface IDraggedNode {
  type: string;
  nodeInformation: INodeTypeInformation;
}

const { viewModel } = useViewModel();
const { x: mouseX, y: mouseY } = usePointer();
const { transform } = useTransform();
const categories = useNodeCategories(viewModel);

const editorEl = inject<Ref<HTMLElement | null>>("editorEl");

const searchQuery = ref<string | null>("");
const draggedNode = ref<IDraggedNode | null>(null);

const categoryNames = categories.value.map((c) => c.name);

const filteredCategories = computed(() =>
  searchQuery.value == null || searchQuery.value === ""
    ? categories.value
    : categories.value.filter(
        (c) => searchQuery.value != null && c.name.toLowerCase().includes(searchQuery.value.toLowerCase()),
      ),
);

const draggedNodeStyles = computed<CSSProperties>(() => {
  if (!draggedNode.value || !editorEl?.value) {
    return {};
  }
  const { left, top } = editorEl.value.getBoundingClientRect();
  return {
    top: `${mouseY.value - top}px`,
    left: `${mouseX.value - left}px`,
  };
});

const onDragStart = (type: string, nodeInformation: INodeTypeInformation) => {
  draggedNode.value = {
    type,
    nodeInformation,
  };

  const onDragEnd = () => {
    const instance = reactive(new nodeInformation.type()) as AbstractNode;
    viewModel.value.displayedGraph.addNode(instance);

    const rect = editorEl!.value!.getBoundingClientRect();
    const [x, y] = transform(mouseX.value - rect.left, mouseY.value - rect.top);
    instance.position.x = x;
    instance.position.y = y;

    draggedNode.value = null;
    document.removeEventListener("pointerup", onDragEnd);
  };
  document.addEventListener("pointerup", onDragEnd);
};
</script>

<style lang="scss">
.baklava-node-palette {
  .v-expansion-panel {
    background-color: transparent;
    color: rgba(var(--v-theme-surface), var(--v-high-emphasis-opacity));
  }
}
</style>
