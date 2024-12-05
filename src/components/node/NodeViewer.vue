<template>
  <Card v-if="node" :color="node.view.color" class="node my-1" rounded="1">
    <v-card-title>
      <v-row class="ma-0 text-button">
        <NodeAvatar :node :size="48" title="Graphical representation" />
        <v-spacer />
        <div class="my-auto" title="Node model">
          {{ node.modelId }}
        </div>
        <v-spacer />
        <div class="my-auto" title="Population size">
          {{ node.size }}
        </div>
      </v-row>
    </v-card-title>

    <v-card-text class="pa-0">
      <v-list v-if="node.paramsVisible.length > 0">
        <ParamViewer v-for="(paramId, index) in node.paramsVisible" :key="index" :param="node.params[paramId]" />
      </v-list>
    </v-card-text>

    <v-card-actions v-if="node.connections.length > 0" class="pa-0" style="min-height: 40px">
      <v-expansion-panels :key="node.connections.length" multiple variant="accordion">
        <ConnectionViewer
          v-for="(connection, index) in node.connections"
          :key="index"
          :connection="(connection as BaseConnection)"
        />
      </v-expansion-panels>
    </v-card-actions>
  </Card>
</template>

<script lang="ts" setup>
import Card from "../common/Card.vue";
import ConnectionViewer from "../connection/ConnectionViewer.vue";
import NodeAvatar from "./avatar/NodeAvatar.vue";
import ParamViewer from "../parameter/ParamViewer.vue";
import { BaseConnection } from "@/helpers/connection/connection";
import { TNode } from "@/types";

defineProps<{ node: TNode }>();
</script>

<!-- <style lang="scss">
.node {
  .v-list {
    overflow: visible;

    .v-list-item__content {
      overflow: visible;
    }
  }

  .v-input__prepend,
  .v-input__append {
    padding-top: 0 !important;
  }
}
</style> -->
