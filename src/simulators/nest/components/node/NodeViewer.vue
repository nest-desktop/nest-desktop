<template>
  <card
    :color="node.view.color"
    class="node my-1"
    rounded="1"
    variant="outlined"
    v-if="node"
  >
    <v-card-title>
      <div class="d-flex text-button">
        <node-avatar
          :node="node"
          size="48px"
          title="Graphical representation"
        />
        <div class="ma-auto" title="Node model">{{ node.modelId }}</div>
        <div class="my-auto" title="Population size">{{ node.size }}</div>
      </div>
    </v-card-title>

    <v-card-text class="pa-0">
      <v-list v-if="node.paramsVisible.length > 0">
        <node-param-viewer
          :key="index"
          :options="node.params[paramId].options"
          :value="node.params[paramId].value"
          v-for="(paramId, index) in node.paramsVisible"
        />
      </v-list>
    </v-card-text>

    <v-card-actions
      class="pa-0"
      style="min-height: 40px"
      v-if="node.connections.length > 0"
    >
      <v-expansion-panels
        :key="node.connections.length"
        multiple
        variant="accordion"
      >
        <connection-viewer
          :key="index"
          :connection="(connection as NESTConnection)"
          v-for="(connection, index) in node.connections"
        />
      </v-expansion-panels>
    </v-card-actions>
  </card>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import Card from "@/components/common/Card.vue";
import NodeAvatar from "@/components/node/avatar/NodeAvatar.vue";

import ConnectionViewer from "@nest/components/connection/ConnectionViewer.vue";
import { NESTConnection } from "@nest/helpers/connection/nestConnection";
import { NESTNode } from "@nest/helpers/node/nestNode";

import NodeParamViewer from "./NodeParamViewer.vue";

const props = defineProps({
  node: NESTNode,
});

const node = computed(() => props.node as NESTNode);
</script>

<style lang="scss">
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
</style>
