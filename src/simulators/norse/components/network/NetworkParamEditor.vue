<template>
  <div class="networkParamEditor">
    <v-toolbar color="transparent" density="compact">
      <v-btn-toggle class="mx-1" mandatory v-model="network.nodes.state.elementTypeIdx">
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

    <div :key="network.nodes.length">
      <div :key="index" v-for="(node, index) in network.nodes.all">
        <node-editor
          :node="(node as NorseNode)"
          @mouseenter="node.state.focus()"
          @mouseleave="node.nodes.unfocusNode()"
          v-if="showNode(node as NorseNode)"
          />
          <!-- :style="{opacity: showNode(node as Node) ? 1 : 0.2}" -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import IconBtn from "@/components/common/IconBtn.vue";

import { NorseNetwork } from "../../helpers/network/norseNetwork"
import { NorseNode } from "../../helpers/node/norseNode";
import NodeEditor from "../node/NodeEditor.vue";

import { useNorseProjectStore } from "../../store/project/norseProjectStore";
const projectStore = useNorseProjectStore();

const network = computed(() => projectStore.project.network as NorseNetwork);

const nodeTypes = [
  { icon: "mdi-all-inclusive", id: "all", title: "all" },
  { icon: "network:stimulator", id: "stimulator", title: "stimulator" },
  { icon: "network:neuron-shape", id: "neuron", title: "neuron" },
  { icon: "network:recorder", id: "recorder", title: "recorder" },
];

/**
 * Show node in list.
 */
const showNode = (node: NorseNode) => {
  const elementTypeIdx = network.value.nodes.state.elementTypeIdx;

  if (elementTypeIdx === 4) {
    return false;
  } else if (network.value.nodes.state.selectedNode) {
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
    return network.value.state.state.displayIdx.nodes.includes(node.idx);
  }
};
</script>
