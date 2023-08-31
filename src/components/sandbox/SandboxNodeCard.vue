<template>
  <v-card class="playground-node">
    <v-card-title>
      <v-row no-gutters>
        Node
        <v-spacer />
        <v-tabs density="compact" v-model="state.tab">
          <v-tab value="components">Components</v-tab>
          <v-tab value="values">Values</v-tab>
        </v-tabs>
      </v-row>
    </v-card-title>
    <v-card-text>
      <v-window v-model="state.tab">
        <v-window-item
          reverse-transition="no-transition"
          transition="no-transition"
          value="components"
        >
          <value-slider
            v-bind="{ label: 'Simulation time', max: 2000 }"
            v-model="projectMockStore.project.simulation.time"
          />
          <node-card
            :key="index"
            :node="(node as Node)"
            v-for="(node, index) in projectMockStore.project.network.nodes.all"
          />
        </v-window-item>
        <v-window-item
          reverse-transition="no-transition"
          transition="no-transition"
          value="values"
        >
          <pre>{{ projectMockStore.project.network.nodes.all }}</pre>
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { reactive } from "vue";

import { useProjectMockStore } from "@nest/store/project/projectMockStore";
const projectMockStore = useProjectMockStore();

import ValueSlider from "@/components/controls/ValueSlider.vue";
import NodeCard from "@nest/components/NodeCard.vue";
import { Node } from "@nest/core/node/node";

const state = reactive({
  tab: "components",
});

// const update = () => {
//   projectMockStore.project.network.nodes.all.forEach((node) => {
//     if (node.modelParams != undefined) {
//       Object.values(node.modelParams).forEach((param) => {
//         if (param.id === "stop") {
//           const end = param.max === param.value;
//           param.max = projectMockStore.project.simulation.time;
//           if (end) {
//             param.value = param.max;
//           }
//         } else if (param && param.id === "time") {
//           const end = param.max === param.value[1];
//           param.max = projectMockStore.project.simulation.time;
//           if (end) {
//             param.value[1] = param.max;
//           }
//         }
//       });
//     }
//   });
// };
</script>

<style lang="scss">
.sandbox-node {
  .list {
    overflow: visible;

    .no-expand-transition .expand-transition-enter-active,
    .no-expand-transition .expand-transition-leave-active {
      transition: none !important;
    }

    .sublist {
      border-left: 2px solid rgb(var(--v-theme-primary), 0.6) !important;
      margin-inline-start: 28px !important;
    }

    .v-list-item:nth-child(odd) {
      background-color: rgba(var(--v-theme-primary), 0.2);
    }

    v-list-item__content {
      overflow: visible;
    }
  }
}
</style>
