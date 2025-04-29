<template>
  <div class="baklava-node-palette pa-0">
    <v-list class="pa-0" density="compact" theme="dark">
      <v-list-group v-for="c1 in nestedCategories" :key="c1.name">
        <template #activator="{ props }">
          <v-list-item v-bind="props" :title="c1.name" />
        </template>

        <v-list v-if="c1.categories" class="pa-0" density="compact">
          <v-list-group v-for="c2 in c1.categories" :key="c2.name">
            <template #activator="{ props }">
              <v-list-item v-bind="props" :title="'.' + c2.name" style="border-left: 2px solid currentColor" />
            </template>

            <v-list-item
              v-for="(ni, nt) in c2.nodeTypes"
              :key="nt"
              style="padding: 1px !important; border-left: 2px solid currentColor"
            >
              <PaletteEntry :title="ni.title" :type="nt" class="pa-0 ma-0" @pointerdown="onDragStart(nt, ni)" />
            </v-list-item>
          </v-list-group>
        </v-list>

        <v-list-item
          v-for="(ni, nt) in c1.nodeTypes"
          :key="nt"
          style="padding: 1px !important; border-left: 2px solid currentColor"
        >
          <PaletteEntry :title="ni.title" :type="nt" class="pa-0 ma-0" @pointerdown="onDragStart(nt, ni)" />
        </v-list-item>
      </v-list-group>
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

const nestedCategories = computed(() => {
  const c1 = categories.value.filter((c) => !c.name.includes("."));
  const c2 = categories.value.filter((c) => c.name.includes("."));
  c2.forEach((c2Item) => {
    const c1Name = c2Item.name.split(".")[0];
    const c2Name = c2Item.name.split(".")[1];
    const c1Item = c1.find((c) => c.name === c1Name) || { name: c1Name, nodeTypes: [] };
    if (!c1.includes(c1Item)) {
      c1.push(c1Item);
      c1.sort((a, b) => (a.name > b.name ? 1 : -1));
    }
    if (!c1Item.categories) c1Item["categories"] = [];
    c1Item.categories.push({ ...c2Item, name: c2Name });
  });
  return c1;
});

const editorEl = inject<Ref<HTMLElement | null>>("editorEl");

const draggedNode = ref<IDraggedNode | null>(null);

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
