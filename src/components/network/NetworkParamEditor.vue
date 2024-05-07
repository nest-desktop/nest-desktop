<template>
  <div class="networkParamEditor">
    <v-toolbar color="transparent" density="compact">
      <v-btn-toggle
        class="mx-1"
        mandatory
        v-model="network.nodes.state.elementTypeIdx"
      >
        <icon-btn
          :icon="item.icon"
          :key="index"
          @click="network.nodes.unselectNodes()"
          size="x-small"
          v-for="(item, index) in network.nodes.nodeTypes"
        >
          {{ item.title }}
        </icon-btn>
      </v-btn-toggle>

      <v-spacer />

      <v-btn icon="mdi:mdi-dots-vertical" size="small" />
    </v-toolbar>

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
import { TNetwork } from "@/types/networkTypes";
import { TNode } from "@/types/nodeTypes";
import { NodeGroup as TNodeGroup } from "@/helpers/node/nodeGroup";

const props = defineProps<{
  network: TNetwork;
}>();
const network = computed(() => props.network);
</script>
