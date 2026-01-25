<template>
  <Card
    v-if="nodeGroup.show"
    :color="nodeGroup.view.color"
    class="node-group ma-1"
    @mouseenter="nodeGroup.view.focus()"
    @mouseleave="nodeGroup.parentNodes.unfocusNode()"
  >
    <v-card-title class="node-group-title">
      <v-row no-gutters>
        <v-btn class="mx-1" flat icon variant="tonal" @click.stop="nodeGroup.toggleSelection()">
          <NodeAvatar :node="nodeGroup" size="48" />
        </v-btn>

        <v-btn-group class="mx-4" multiple rounded="xl">
          <v-btn
            v-for="(node, index) in nodeGroup.nodes"
            :key="index"
            class="btn-avatar px-0"
            size="small"
            @click.stop="
              () => {
                node.parentNodes.unselectNodes();
                node.toggleSelection();
              }
            "
          >
            <NodeAvatar :node size="32" />
          </v-btn>
        </v-btn-group>

        <v-spacer />

        <Menu>
          <NodeGroupMenuList :node-group />
        </Menu>
      </v-row>
    </v-card-title>

    <v-card-actions v-if="nodeGroup.connections.length > 0" style="min-height: 40px">
      <v-row>
        <v-expansion-panels
          :key="nodeGroup.connections.length"
          v-model="nodeGroup.view.expansionPanelIdx"
          variant="accordion"
        >
          <ConnectionEditor v-for="(connection, index) in nodeGroup.connections" :key="index" :connection />
        </v-expansion-panels>
      </v-row>
    </v-card-actions>
  </Card>
</template>

<script setup lang="ts">
import { toRef } from "vue";

import type { TNodeGroup } from "@/types";
import { Card, Menu } from "@/components";

import { ConnectionEditor, NodeAvatar } from "@/network/components";

import NodeGroupMenuList from "./NodeGroupMenuList.vue";

const props = defineProps<{ nodeGroup: TNodeGroup }>();
const nodeGroup = toRef(props, "nodeGroup");
</script>

<style lang="scss">
.btn-avatar {
  position: relative;
  z-index: 1;
}

.node-group {
  .node-group-title {
    .menu {
      opacity: 0;
    }

    &:hover {
      .menu {
        opacity: 1;
      }
    }
  }
}
</style>
