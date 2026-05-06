<template>
  <Card v-if="node" :color="node.view.color" class="node my-1" rounded="1">
    <v-card-title>
      <v-row class="ma-0 text-label-large">
        <NodeAvatar :node :size="48" />
        <v-spacer />
        <div class="my-auto" title="Node model">
          {{ node.modelId }}
        </div>
        <v-spacer />
        <div class="my-auto" title="Population size">
          {{ node.size.value }}
        </div>
      </v-row>
    </v-card-title>

    <v-card-text class="pa-0">
      <v-list v-if="node.params.hasSomeVisibleParams">
        <ParamViewer
          v-for="(paramId, index) in node.params.visibleParamIds"
          :key="index"
          :param="node.params.get(paramId)"
        />
      </v-list>
    </v-card-text>

    <v-card-actions v-if="node.connections.length > 0" class="pa-0" style="min-height: 40px">
      <v-expansion-panels :key="node.connections.length" multiple variant="accordion">
        <ConnectionViewer v-for="(connection, index) in node.connections" :key="index" :connection />
      </v-expansion-panels>
    </v-card-actions>
  </Card>
</template>

<script setup lang="ts">
import type { TNode } from "@/types";

import { Card } from "@/components";
import { ParamViewer } from "@/parameter/components";

import { ConnectionViewer } from "../../connection/components";
import { NodeAvatar } from "./avatar";

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
