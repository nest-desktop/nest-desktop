<template>
  <div
    :id="node.id"
    ref="el"
    :class="classes"
    :data-node-type="node.type"
    :style="styles"
    class="baklava-node"
    @pointerdown="select"
  >
    <div v-if="viewModel.settings.nodes.resizable" class="__resize-handle" @mousedown="startResize" />

    <div :title="node.type" class="__title" @pointerdown.self.stop="startDrag" @contextmenu.prevent="openContextMenu">
      <CodeNodeInterface
        v-if="node.inputs._node"
        :node
        :intf="node.inputs._node"
        class="--input"
        data-interface-type="_node"
        style="flex-grow: 0"
      />

      <template v-if="!renaming">
        <div class="__title-label" style="flex-grow: 1">
          <span v-if="node.idx > -1">{{ node.idx + 1 }} - </span>{{ node.title }}
        </div>
        <div class="__menu">
          <template v-if="!node.subgraph">
            <v-icon
              :disabled="node.nOutputs === 0"
              :icon="node.state?.integrated ? 'mdi:mdi-tray-arrow-down' : 'mdi:mdi-equal'"
              class="mx-1 --clickable"
              size="xsmall"
              @click="toggleIntegrated"
            />
            <v-icon
              :icon="node.state?.commented ? 'mdi:mdi-pound' : 'mdi:mdi-code-tags'"
              class="mx-1 --clickable"
              size="xsmall"
              @click="toggleCommented"
            />
            <!-- <v-icon
            :icon="node.state.hidden ? 'mdi:mdi-eye-off-outline' : 'mdi:mdi-eye'"
            class="mx-1 --clickable"
            size="xsmall"
            @click="toggleHidden"
          /> -->
            <v-icon icon="mdi:mdi-pencil" class="mx-1 --clickable" size="xsmall" @click="openSidebar" />
          </template>
          <v-icon icon="mdi:mdi-dots-vertical" class="--clickable" size="xsmall" @click="openContextMenu" />
          <ContextMenu v-model="showContextMenu" :x="0" :y="0" :items="contextMenuItems" @click="onContextMenuClick" />
        </div>
      </template>
      <input
        v-else
        ref="renameInputEl"
        v-model="tempName"
        class="baklava-input"
        placeholder="Node Name"
        style="flex-grow: 1"
        type="text"
        @blur="doneRenaming"
        @keydown.enter="doneRenaming"
      />

      <CodeNodeInterface
        v-if="node.outputs._node"
        :node
        :intf="node.outputs._node"
        class="--output"
        data-interface-type="_node"
      />
    </div>

    <div class="__content" :class="classesContent" @keydown.delete.stop @contextmenu.prevent>
      <!-- Outputs -->
      <div class="__outputs">
        <template v-for="output in displayedOutputs" :key="output.id">
          <div v-if="node.state?.hidden">
            <div
              v-if="output.port"
              :id="output.id"
              :data-interface-type="output.type ?? ''"
              :title="output.name"
              class="baklava-node-interface --output --connected"
            >
              <div class="__port" />
            </div>
          </div>

          <slot v-else name="nodeInterface" type="output" :node :intf="output">
            <NodeInterface :node :intf="output" :data-interface-type="output.type ?? ''" />
          </slot>
        </template>
      </div>

      <!-- Inputs -->
      <div class="__inputs">
        <template v-for="input in displayedInputs" :key="input.id">
          <div v-if="node.state?.hidden">
            <div
              v-if="input.port"
              :id="input.id"
              :data-interface-type="input.type ?? ''"
              :title="input.name"
              class="baklava-node-interface --input --connected"
            >
              <div class="__port" />
            </div>
          </div>

          <slot v-else :node :intf="input" name="nodeInterface" type="input">
            <NodeInterface :node :intf="input" :data-interface-type="input.type ?? ''" :title="input.name" />
          </slot>
        </template>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onUpdated, onMounted, onBeforeUnmount } from "vue";
import { AbstractNode, GRAPH_NODE_TYPE_PREFIX, IGraphNode } from "@baklavajs/core";
import { Components, useGraph, useViewModel } from "@baklavajs/renderer-vue";

import { AbstractCodeNode } from "@/helpers/codeGraph/codeNode";
import CodeNodeInterface from "./CodeNodeInterface.vue";

const ContextMenu = Components.ContextMenu;
const NodeInterface = Components.NodeInterface;

// import VerticalDots from "../icons/VerticalDots.vue";
const props = withDefaults(
  defineProps<{
    node: AbstractNode;
    selected?: boolean;
    dragging?: boolean;
  }>(),
  { selected: false },
);

const node = computed(() => props.node as AbstractCodeNode);

const emit = defineEmits<{
  (e: "select"): void;
  (e: "start-drag", ev: PointerEvent): void;
  (e: "update"): void;
}>();

const { viewModel } = useViewModel();
const { graph, switchGraph } = useGraph();

const el = ref<HTMLElement | null>(null);
const renaming = ref(false);
const tempName = ref("");
const renameInputEl = ref<HTMLInputElement | null>(null);
const isResizing = ref(false);
let resizeStartWidth = 0;
let resizeStartMouseX = 0;

const showContextMenu = ref(false);
const contextMenuItems = computed(() => {
  const items = [
    { value: "edit", label: "Edit" },
    { value: "rename", label: "Rename" },
    { value: "delete", label: "Delete" },
  ];

  if (props.node.type.startsWith(GRAPH_NODE_TYPE_PREFIX)) {
    items.push({ value: "editSubgraph", label: "Edit Subgraph" });
  }

  return items;
});

const classes = computed(() => ({
  "--selected": props.selected,
  "--dragging": props.dragging,
  "--two-column": !!props.node.twoColumn,
  "--hidden": node.value.state?.hidden,
}));

const classesContent = computed(() => ({
  "--reverse-y": props.node.reverseY ?? viewModel.value.settings.nodes.reverseY,
}));

const styles = computed(() => ({
  top: `${props.node.position?.y ?? 0}px`,
  left: `${props.node.position?.x ?? 0}px`,
  "--width": `${props.node.width ?? viewModel.value.settings.nodes.defaultWidth}px`,
}));

const displayedInputs = computed(() => Object.values(props.node.inputs).filter((ni) => !ni.hidden));
const displayedOutputs = computed(() => Object.values(props.node.outputs).filter((ni) => !ni.hidden));

const select = () => {
  emit("select");
};

const startDrag = (ev: PointerEvent) => {
  if (!props.selected) {
    select();
  }

  emit("start-drag", ev);
};

const openContextMenu = () => {
  showContextMenu.value = true;
};

const openSidebar = () => {
  const sidebar = viewModel.value.displayedGraph.sidebar;
  sidebar.nodeId = props.node.id;
  // sidebar.optionName = props.intf.name;
  sidebar.visible = true;
};

const onContextMenuClick = async (action: string) => {
  switch (action) {
    case "edit":
      openSidebar();
      break;
    case "delete":
      graph.value.removeNode(props.node);
      break;
    case "rename":
      tempName.value = props.node.title;
      renaming.value = true;
      await nextTick();
      renameInputEl.value?.focus();
      break;
    case "editSubgraph":
      switchGraph((props.node as AbstractNode & IGraphNode).template);
      break;
  }
};

const doneRenaming = () => {
  props.node.title = tempName.value;
  renaming.value = false;
};

const onRender = () => {
  if (el.value) {
    viewModel.value.hooks.renderNode.execute({ node: props.node, el: el.value });
  }
};

const startResize = (ev: MouseEvent) => {
  isResizing.value = true;
  resizeStartWidth = props.node.width;
  resizeStartMouseX = ev.clientX;
  ev.preventDefault();
};

const toggleCommented = () => {
  if (!node.value.state) return;
  node.value.state.commented = !node.value.state.commented;
  emit("update");
};

// const toggleHidden = () => {
//   node.value.state.hidden = !node.value.state.hidden;
//   emit("update");
// };

const toggleIntegrated = () => {
  if (!node.value.state) return;
  node.value.state.integrated = !node.value.state.integrated;
  emit("update");
};

const doResize = (ev: MouseEvent) => {
  if (!isResizing.value) return;
  const deltaX = ev.clientX - resizeStartMouseX;
  const newWidth = resizeStartWidth + deltaX / graph.value.scaling;
  const minWidth = viewModel.value.settings.nodes.minWidth;
  const maxWidth = viewModel.value.settings.nodes.maxWidth;
  props.node.width = Math.max(minWidth, Math.min(maxWidth, newWidth));
};

const stopResize = () => {
  isResizing.value = false;
};

onMounted(() => {
  onRender();

  window.addEventListener("mousemove", doResize);
  window.addEventListener("mouseup", stopResize);
});
onUpdated(onRender);

onBeforeUnmount(() => {
  window.removeEventListener("mousemove", doResize);
  window.removeEventListener("mouseup", stopResize);
});
</script>
