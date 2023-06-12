<template>
  <v-card flat>
    <template v-if="projectStore.controllerView === 'network'">
      <div :key="projectStore.project.network.state.nodesLength">
        <template
          :key="index"
          v-for="(item, index) in projectStore.project.network.nodes.all"
        >
          <node-card :node="item" />
        </template>
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
import SimulationCodeEditor from "../../components/SimulationCodeEditor.vue";
import NodeCard from "../../components/NodeCard.vue";

import { useProjectStore } from "../../store/projectStore";
const projectStore = useProjectStore();
</script>

<style lang="scss">
.px-2px {
  padding-left: 2px;
  padding-right: 2px;
}
</style>
