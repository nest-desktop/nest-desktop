<template>
  <v-card
    :color="nodeGroup.view.color"
    @mouseenter="nodeGroup.view.focus()"
    @mouseleave="nodeGroup.parentNodes.unfocusNode()"
    class="node-group ma-1"
    variant="outlined"
    v-if="nodeGroup.show"
  >
    <v-card-title class="node-group-title">
      <v-row no-gutters>
        <v-btn @click.stop="nodeGroup.select()" class="mx-1" flat icon>
          <NodeAvatar :node="nodeGroup" size="48px" />
        </v-btn>

        <v-divider inset vertical />

        <v-btn-group class="mx-4" multiple rounded="xl" variant="outlined">
          <v-btn
            :key="index"
            @click.stop="node.select()"
            class="btn-avatar px-0"
            size="small"
            v-for="(node, index) in nodeGroup.nodes"
          >
            <NodeAvatar :node size="32px" />
          </v-btn>
        </v-btn-group>

        <v-spacer />

        <v-btn
          class="menu d-print-none ma-auto"
          color="primary"
          icon
          size="small"
          variant="text"
        >
          <v-icon icon="mdi:mdi-dots-vertical" />
          <NodeGroupMenu :nodeGroup />
        </v-btn>
      </v-row>
    </v-card-title>

    <v-card-actions
      style="min-height: 40px"
      v-if="nodeGroup.connections.length > 0"
    >
      <v-row>
        <v-expansion-panels
          :key="nodeGroup.connections.length"
          v-model="nodeGroup.view.expansionPanelIdx"
          variant="accordion"
        >
          <ConnectionEditor
            :connection
            :key="index"
            v-for="(connection, index) in nodeGroup.connections"
          />
        </v-expansion-panels>
      </v-row>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { NodeGroup } from "@/helpers/node/nodeGroup";
import ConnectionEditor from "../connection/ConnectionEditor.vue";
import NodeAvatar from "./avatar/NodeAvatar.vue";
import NodeGroupMenu from "./NodeGroupMenu.vue";

defineProps<{ nodeGroup: NodeGroup }>();
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
