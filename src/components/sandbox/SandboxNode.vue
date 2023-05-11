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
          <node
            :node="node"
            :key="index"
            v-for="(node, index) in state.nodes"
          />
        </v-window-item>
        <v-window-item
          reverse-transition="no-transition"
          transition="no-transition"
          value="values"
        >
          <pre>{{ state.nodes }}</pre>
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { reactive } from "vue";

import Node from "@/components/nest/Node.vue";

const state = reactive({
  tab: "components",
  nodes: [
    {
      model: "dc_generator",
      color: "#1F77B4",
      size: 1,
      paramsVisible: ["amplitude"],
      params: [
        {
          id: "amplitude",
          label: "amplitude",
          value: 10,
          unit: "pA",
        },
        { id: "start", label: "start", value: 0, unit: "ms" },
        { id: "stop", label: "stop", value: 10, unit: "ms" },
      ],
    },
    {
      model: "iaf_psc_alpha",
      color: "#FF7F0E",
      size: 10,
      paramsVisible: ["size", "V_m"],
      params: [
        {
          id: "V_m",
          label: "initial membrane potentials",
          value: -70,
          min: -100,
          max: 0,
          unit: "mV",
        },
        {
          id: "V_th",
          label: "spike threshold",
          value: -55,
          min: -100,
          max: 0,
          unit: "mV",
        },
        {
          id: "E_L",
          label: "reversal potentials",
          value: -70,
          min: -100,
          max: 0,
          unit: "mV",
        },
      ],
    },
  ],
});
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
