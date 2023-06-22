<template>
  <template v-if="projectStore.controllerView === 'network'">
    <div :key="projectStore.project.network.nodes.state.nodesLength">
      <node-editor
        :key="index"
        :node="(node as Node)"
        v-for="(node, index) in projectStore.project.network.nodes.all"
      />
    </div>
  </template>
  <template v-else-if="projectStore.controllerView === 'kernel'">
    <simulation-kernel
      :simulation="projectStore.project.simulation as Simulation"
    />
  </template>
  <template v-else-if="projectStore.controllerView === 'code'">
    <simulation-code-editor />
  </template>
  <template v-else-if="projectStore.controllerView === 'activity'">
    Activity
  </template>
  <template v-else-if="projectStore.controllerView === 'stats'">
    <activity-stats />
  </template>
</template>

<script lang="ts" setup>
import { Node } from "@nest/core/node/node";
import { Simulation } from "@nest/core/simulation/simulation";
import { useProjectStore } from "@nest/store/project/projectStore";

import NodeEditor from "@nest/components/editor/NodeEditor.vue";
import SimulationCodeEditor from "@nest/components/editor/SimulationCodeEditor.vue";
import SimulationKernel from "@/nest/components/editor/SimulationKernelEditor.vue";
import ActivityStats from "@nest/components/activityStats/ActivityStats.vue";

const projectStore = useProjectStore();
</script>

<style lang="scss">
.px-2px {
  padding-left: 2px;
  padding-right: 2px;
}
</style>
