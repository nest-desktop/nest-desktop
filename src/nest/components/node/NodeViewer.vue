<template>
  <card
    :color="state.node.color"
    class="node my-1"
    rounded="1"
    variant="outlined"
    v-if="state.node"
  >
    <v-card-title>
      <div class="d-flex text-button">
        <node-avatar
          size="48px"
          title="Graphical representation"
          :color="state.node.color"
          :label="state.node.label"
          :elementType="state.node.elementType"
          :weight="state.node.weight"
        />
        <div class="ma-auto" title="Node model">{{ state.node.modelId }}</div>
        <div class="my-auto" title="Population size">{{ state.node.size }}</div>
      </div>
    </v-card-title>

    <v-card-text class="pa-0">
      <v-list v-if="state.node.paramsVisible.length > 0">
        <node-param-viewer
          :key="index"
          :options="state.node.params[paramId].options"
          :value="state.node.params[paramId].value"
          v-for="(paramId, index) in state.node.paramsVisible"
        />
      </v-list>
    </v-card-text>

    <v-card-actions
      class="pa-0"
      style="min-height: 40px"
      v-if="state.node.state.targetsLength > 0"
    >
      <v-expansion-panels
        :key="state.node.state.targetsLength"
        multiple
        variant="accordion"
      >
        <connection-viewer
          :key="index"
          :connection="(connection as Connection)"
          v-for="(connection, index) in state.node.targets"
        />
      </v-expansion-panels>
    </v-card-actions>
  </card>
</template>

<script lang="ts" setup>
import { reactive, PropType } from "vue";

import Card from "@/components/common/Card.vue";

import { Connection } from "@nest/core/connection/connection";
import { Node } from "@nest/core/node/node";
import NodeAvatar from "./avatar/NodeAvatar.vue";
import ConnectionViewer from "@nest/components/connection/ConnectionViewer.vue";
import NodeParamViewer from "./NodeParamViewer.vue";

const props = defineProps({
  node: { type: Object as PropType<Node>, required: true },
});

// @ts-ignore
const state = reactive({
  menu: false,
  node: props.node,
});
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
