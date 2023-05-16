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
            v-model="projectStore.project.kernel[0].value"
            v-bind="projectStore.project.kernel[0]"
            @update:model-value="update"
          />
          <node-card
            :key="index"
            v-bind="node"
            v-for="(node, index) in projectStore.project.nodes"
          />
        </v-window-item>
        <v-window-item
          reverse-transition="no-transition"
          transition="no-transition"
          value="values"
        >
          <pre>{{ projectStore.project.nodes }}</pre>
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { reactive } from "vue";

import { useProjectStore } from "@/store/projectStore";
const projectStore = useProjectStore();

import NodeCard from "@/components/nest/NodeCard.vue";
import ValueSlider from "@/components/common/ValueSlider.vue";

const state = reactive({
  tab: "components",
});

const update = () => {
  projectStore.project.nodes.forEach((node) => {
    if (node.params != undefined) {
      node.params.forEach((param) => {
        if (param.id === "stop") {
          const end = param.max === param.value;
          param.max = projectStore.project.kernel[0].value;
          if (end) {
            param.value = param.max;
          }
        } else if (param.id === "time") {
          const end = param.max === param.value[1];
          param.max = projectStore.project.kernel[0].value;
          if (end) {
            param.value[1] = param.max;
          }
        }
      });
    }
  });
};
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
