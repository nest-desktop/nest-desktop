<template>
  <div class="networkParamEditor">
    <v-toolbar color="transparent" density="compact">
      <v-btn-toggle class="mx-1" mandatory v-model="nodes.state.elementTypeIdx">
        <icon-btn
          :icon="item.icon"
          :key="index"
          size="x-small"
          v-for="(item, index) in nodeTypes"
        >
          {{ item.title }}
        </icon-btn>
      </v-btn-toggle>
      <v-spacer />
      <v-btn icon="mdi-dots-vertical" size="small" />
    </v-toolbar>

    <div :key="nodes.length">
      <div :key="index" v-for="(node, index) in nodes.all">
        <node-editor
          :node="(node as Node)"
          @mouseenter="node.state.focus()"
          @mouseleave="node.nodes.unfocusNode()"
          v-if="showNode(node as Node)"
          />
          <!-- :style="{opacity: showNode(node as Node) ? 1 : 0.2}" -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import IconBtn from "@/components/common/IconBtn.vue";

import NodeEditor from "@nest/components/node/NodeEditor.vue";
import { Node } from "@nest/core/node/node";
import { useProjectStore } from "@nest/store/project/projectStore";
import { Nodes } from "@nest/core/node/nodes";
import { NetworkState } from "@nest/core/network/networkState";

const projectStore = useProjectStore();

const networkState = computed(() => projectStore.project.network.state as NetworkState);
const nodes = computed(() => projectStore.project.network.nodes as Nodes);

const nodeTypes = [
  { icon: "mdi-all-inclusive", id: "all", title: "all" },
  { icon: "nest:stimulator", id: "stimulator", title: "stimulator" },
  { icon: "nest:neuron-shape", id: "neuron", title: "neuron" },
  { icon: "nest:recorder", id: "recorder", title: "recorder" },
  // { icon: "custom:copyModel", id: "model", title: "model" },
];

/**
 * Show node in list.
 */
const showNode = (node: Node) => {
  const elementTypeIdx = nodes.value.state.elementTypeIdx;

  if (elementTypeIdx === 4) {
    return false;
  } else if (nodes.value.state.selectedNode) {
    // selected view
    return node.state.isSelected;
  } else if (elementTypeIdx === 0) {
    // all view
    return true;
  } else if (elementTypeIdx < nodeTypes.length) {
    // element type view
    return nodeTypes[elementTypeIdx].id === node.model.elementType;
  } else {
    // custom view
    return networkState.value.state.displayIdx.nodes.includes(node.idx);
  }
};
</script>
