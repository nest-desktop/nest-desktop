<template>
  <Card
    :color="nodeGroup.view.color"
    @mouseenter="nodeGroup.view.focus()"
    @mouseleave="nodeGroup.parentNodes.unfocusNode()"
    class="node-group ma-1"
    v-if="nodeGroup.show"
  >
    <v-card-title class="node-group-title">
      <v-row no-gutters>
        <v-btn
          @click.stop="nodeGroup.toggleSelection()"
          class="mx-1"
          flat
          icon
          variant="tonal"
        >
          <NodeAvatar :node="nodeGroup" size="48" />
        </v-btn>

        <v-btn-group class="mx-4" multiple rounded="xl">
          <v-btn
            :key="index"
            @click.stop="
              () => {
                node.parentNodes.unselectNodes();
                node.toggleSelection();
              }
            "
            class="btn-avatar px-0"
            size="small"
            v-for="(node, index) in nodeGroup.nodes"
          >
            <NodeAvatar :node="(node as TNode)" size="32" />
          </v-btn>
        </v-btn-group>

        <v-spacer />

        <Menu>
          <NodeGroupMenuList :nodeGroup />
        </Menu>
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
            :connection="(connection as TConnection)"
            :key="index"
            v-for="(connection, index) in nodeGroup.connections"
          />
        </v-expansion-panels>
      </v-row>
    </v-card-actions>
  </Card>
</template>

<script lang="ts" setup>
import Card from "../common/Card.vue";
import ConnectionEditor from "../connection/ConnectionEditor.vue";
import Menu from "../common/Menu.vue";
import NodeAvatar from "./avatar/NodeAvatar.vue";
import NodeGroupMenuList from "./NodeGroupMenuList.vue";
import { NodeGroup } from "@/helpers/node/nodeGroup";
import { TConnection, TNode } from "@/types";

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
