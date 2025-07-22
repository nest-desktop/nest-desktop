<template>
  <div ref="el" class="baklava-sidebar" :class="{ '--open': graph.sidebar.visible }" :style="styles">
    <div v-if="resizable" class="__resizer" @mousedown="startResize" />

    <div class="__header">
      <button tabindex="-1" class="__close" @click="close">&times;</button>
      <div class="__node-name">
        <b>{{ node ? node.title : "" }}</b>
      </div>
      <v-spacer />
      <v-btn icon="mdi:mdi-dots-vertical" size="x-small" variant="text" />
    </div>

    <div v-for="intf in displayedInterfaces" :key="intf.id" class="__interface">
      <v-row no-gutters>
        <v-checkbox
          v-model="intf.hidden"
          density="compact"
          false-icon="mdi:mdi-checkbox-marked-outline"
          hide-details
          true-icon="mdi:mdi-checkbox-blank-outline"
          @update:model-value="() => node?.events.update.emit(null)"
        />
        <component
          :is="intf.component"
          v-model="intf.value"
          :node="node"
          :intf="intf"
          style="width: calc(100% - 32px)"
        />
      </v-row>
    </div>

    <v-spacer />

    <template v-if="node">
      <div class="__interface">
        <label>Variable name</label>
        <input
          v-model="node.variableName"
          type="text"
          class="baklava-input"
          title="Variable name"
          @blur="doneRenaming"
          @keydown.enter="doneRenaming"
        />
      </div>
      <v-toolbar density="compact">
        <v-btn icon="mdi:mdi-backup-restore" size="x-small" title="reset" @click="node.codeTemplate = ''" />
      </v-toolbar>

      <codemirror v-model="node.codeTemplate" />
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, toRef } from "vue";
import { useGraph, useViewModel } from "@baklavajs/renderer-vue";

const { viewModel } = useViewModel();
const { graph } = useGraph();

const el = ref<HTMLElement | null>(null);

const width = toRef(viewModel.value.settings.sidebar, "width");
const resizable = computed(() => viewModel.value.settings.sidebar.resizable);
let resizeStartWidth = 0;
let resizeStartMouseX = 0;

const node = computed(() => {
  const id = graph.value.sidebar.nodeId;
  return graph.value.nodes.find((x) => x.id === id);
});

const styles = computed(() => ({
  width: `${width.value}px`,
}));

const displayedInterfaces = computed(() => {
  if (!node.value) return [];

  const allIntfs = [...Object.values(node.value.inputs), ...Object.values(node.value.outputs)];
  return allIntfs.filter((intf) => intf.displayInSidebar && intf.component);
});

const close = () => {
  graph.value.sidebar.visible = false;
};

const doneRenaming = () => {
  node.value?.events.update.emit(null);
};

const startResize = (event: MouseEvent) => {
  resizeStartWidth = width.value;
  resizeStartMouseX = event.clientX;
  window.addEventListener("mousemove", onMouseMove);
  window.addEventListener(
    "mouseup",
    () => {
      window.removeEventListener("mousemove", onMouseMove);
    },
    { once: true },
  );
};

const onMouseMove = (event: MouseEvent) => {
  const maxwidth = el.value?.parentElement?.getBoundingClientRect().width ?? 500;
  const deltaX = event.clientX - resizeStartMouseX;
  let newWidth = resizeStartWidth - deltaX;
  if (newWidth < 300) {
    newWidth = 300;
  } else if (newWidth > 0.9 * maxwidth) {
    newWidth = 0.9 * maxwidth;
  }
  width.value = newWidth;
};
</script>
