<template>
  <v-card flat>
    <template v-if="projectStore.controllerView === 'network'">
      <div :key="projectStore.project.network.nodes.state.nodesLength">
        <node-card
          :key="index"
          :node="(node as Node)"
          v-for="(node, index) in projectStore.project.network.nodes.all"
        />
      </div>
    </template>
    <template v-else-if="projectStore.controllerView === 'kernel'">
      Kernel
    </template>
    <template v-else-if="projectStore.controllerView === 'code'">
      <simulation-code-editor />
    </template>
    <template v-else-if="projectStore.controllerView === 'activity'">
      Activity
    </template>
    <template v-else-if="projectStore.controllerView === 'stats'">
      Stats
    </template>
  </v-card>
</template>

<script lang="ts" setup>
import { useProjectStore } from "@nest/store/project/projectStore";

import SimulationCodeEditor from "@nest/components/SimulationCodeEditor.vue";
import NodeCard from "@nest/components/NodeCard.vue";

import { Node } from "../../core/node/node";

const projectStore = useProjectStore();
</script>

<style lang="scss">
.px-2px {
  padding-left: 2px;
  padding-right: 2px;
}
</style>
