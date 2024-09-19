<template>
  <div class="networkEditor">
    <v-toolbar color="transparent" density="compact">
      <v-btn-toggle
        class="ma-2"
        mandatory
        v-model="network.state.state.elementTypeIdx"
        variant="text"
      >
        <IconBtn
          :icon="item.icon"
          :key="index"
          :title="item.title"
          @click="network.nodes.unselectNodes()"
          size="x-small"
          v-for="(item, index) in network.elementTypes"
        />
      </v-btn-toggle>

      <v-spacer />

      <v-menu>
        <template #activator="{ props }">
          <v-btn icon="mdi:mdi-dots-vertical" size="small" v-bind="props" />
        </template>

        <v-list density="compact">
          <v-list-item
            :key="index"
            v-bind="item"
            v-for="(item, index) in items"
          >
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>

    <slot name="model" />

    <slot name="nodes">
      <div :key="network.nodes.length">
        <div :key="index" v-for="(node, index) in network.nodes.all">
          <NodeEditor :node="(node as TNode)" v-if="node.isNode" />

          <NodeGroup
            :nodeGroup="(node as TNodeGroup)"
            v-else-if="node.isGroup"
          />
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
      network.value.nodes.nodeItems.forEach(
        (node: TNode) => (node.view.state.expansionPanels = [])
      );
    },
    prependIcon: "mdi:mdi-collapse-all-outline",
    title: "collapse all",
  },
  {
    id: "expandAll",
    onClick: () => {
      network.value.nodes.nodeItems.forEach(
        (node: TNode) =>
          (node.view.state.expansionPanels = range(node.connections.length + 1))
      );
    },
    prependIcon: "mdi:mdi-expand-all-outline",
    title: "expand all",
  },
];
</script>
