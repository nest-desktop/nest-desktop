<template>
  <div class="networkEditor">
    <v-toolbar class="networkToolbar" color="transparent" density="compact" extended extension-height="12">
      <!-- <template #extension>
        <v-fab
          class="ms-4"
          color="primary"
          icon="mdi:mdi-plus"
          location="bottom left"
          size="40"
          absolute
          title="Create a new node"
        />
      </template> -->

      <template #append>
        <v-btn-toggle
          v-model="network.state.state.elementTypeIdx"
          class="ma-2"
          mandatory
          style="font-size: 11px"
          variant="text"
        >
          <IconBtn
            v-for="(item, index) in network.elementTypes"
            :key="index"
            :icon="item.icon"
            :title="item.title"
            size="x-small"
            @click="network.nodes.unselectNodes()"
          />
        </v-btn-toggle>

        <v-menu>
          <template #activator="{ props: btnProps }">
            <v-btn icon="mdi:mdi-dots-vertical" size="small" v-bind="btnProps" />
          </template>

          <v-list density="compact">
            <v-list-item v-for="(item, index) in items" :key="index" v-bind="item" />
          </v-list>
        </v-menu>
      </template>
    </v-toolbar>

    <slot name="model" />

    <slot name="nodes">
      <div v-for="(node, index) in network.nodes.all" :key="index">
        <NodeEditor :node />
        <!-- <NodeGroupEditor v-if="node.isGroup" :node-group="node" /> -->
      </div>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { IconBtn } from "@/components";
import type { TNetwork, TNode } from "@/types";
import { range } from "@/utils";

import { NodeEditor } from "../node/components";
// import { NodeGroupEditor } from "../nodeGroup/components";

const props = defineProps<{ network: TNetwork }>();
const network = computed(() => props.network);

const items = [
  {
    id: "collapseAll",
    onClick: () => {
      network.value.nodes.all.forEach((node: TNode) => (node.view.state.expansionPanels = []));
    },
    prependIcon: "mdi:mdi-collapse-all-outline",
    title: "collapse all",
  },
  {
    id: "expandAll",
    onClick: () => {
      network.value.nodes.all.forEach(
        (node: TNode) => (node.view.state.expansionPanels = range(node.connections.length + 1)),
      );
    },
    prependIcon: "mdi:mdi-expand-all-outline",
    title: "expand all",
  },
];
</script>

<!-- <style lang="scss" scoped>
.networkToolbar {
  position: sticky;
  position: -webkit-sticky; /* for Safari */
  top: 0em;
  z-index: 2;

  .v-toolbar__content {
    overflow: auto !important;
  }
}
</style> -->
