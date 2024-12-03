<template>
  <div class="networkEditor">
    <v-toolbar color="transparent" density="compact">
      <v-btn-toggle v-model="network.state.state.elementTypeIdx" class="ma-2" mandatory variant="text">
        <IconBtn
          v-for="(item, index) in network.elementTypes"
          :key="index"
          :icon="item.icon"
          :title="item.title"
          size="x-small"
          @click="network.nodes.unselectNodes()"
        />
      </v-btn-toggle>

      <v-spacer />

      <v-menu>
        <template #activator="{ props: btnProps }">
          <v-btn icon="mdi:mdi-dots-vertical" size="small" v-bind="btnProps" />
        </template>

        <v-list density="compact">
          <v-list-item v-for="(item, index) in items" :key="index" v-bind="item" />
        </v-list>
      </v-menu>
    </v-toolbar>

    <slot name="model" />

    <slot name="nodes">
      <div :key="network.nodes.length">
        <div v-for="(node, index) in network.nodes.all" :key="index">
          <NodeEditor v-if="node.isNode" :node="(node as TNode)" />

          <NodeGroup v-else-if="node.isGroup" :node-group="(node as TNodeGroup)" />
        </div>
      </div>
    </slot>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import IconBtn from "../common/IconBtn.vue";
import NodeEditor from "../node/NodeEditor.vue";
import NodeGroup from "../node/NodeGroup.vue";
import { NodeGroup as TNodeGroup } from "@/helpers/node/nodeGroup";
import { TNetwork, TNode } from "@/types";
import { range } from "@/utils/array";

const props = defineProps<{ network: TNetwork }>();
const network = computed(() => props.network);

const items = [
  {
    id: "collapseAll",
    onClick: () => {
      network.value.nodes.nodeItems.forEach((node: TNode) => (node.view.state.expansionPanels = []));
    },
    prependIcon: "mdi:mdi-collapse-all-outline",
    title: "collapse all",
  },
  {
    id: "expandAll",
    onClick: () => {
      network.value.nodes.nodeItems.forEach(
        (node: TNode) => (node.view.state.expansionPanels = range(node.connections.length + 1)),
      );
    },
    prependIcon: "mdi:mdi-expand-all-outline",
    title: "expand all",
  },
];
</script>
