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
            v-model="state.kernel[0].value"
            v-bind="state.kernel[0]"
            @update:model-value="update"
          />
          <node-card
            :key="index"
            v-bind="node"
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

import NodeCard from "@/components/nest/NodeCard.vue";
import ValueSlider from "@/components/common/ValueSlider.vue";

const state = reactive({
  tab: "components",
  kernel: [
    {
      label: "simulation time",
      value: 1000,
      max: 2000,
    },
  ],
  nodes: [
    {
      label: "dc1",
      model: "dc_generator",
      color: "#1F77B4",
      type: "stimulus",
      size: 1,
      paramsVisible: ["amplitude", "stop", "time"],
      params: [
        {
          id: "amplitude",
          label: "amplitude",
          value: 10,
          unit: "pA",
        },
        { id: "start", label: "start", value: 0, unit: "ms" },
        { id: "stop", label: "stop", value: 1000, max: 1000, unit: "ms" },
        {
          id: "time",
          inputLabel: ["start", "stop"],
          label: "time",
          value: [0, 1000],
          max: 1000,
          unit: "ms",
          variant: "range",
        },
      ],
      connections: [
        {
          targetNode: { label: "n1", color: "#FF7F0E", type: "neuron" },
          connSpec: { rule: "all_to_all" },
          synSpec: { model: "static_synapse", weight: 1, delay: 1 },
        },
        {
          targetNode: { label: "n2", color: "#2CA02C", type: "neuron", weight: "inhibitory" },
          connSpec: { rule: "all_to_all" },
          synSpec: { model: "static_synapse", weight: 1, delay: 1 },
        },
      ],
    },
    {
      label: "n1",
      model: "iaf_psc_alpha",
      color: "#FF7F0E",
      type: "neuron",
      weight: "excitatory",
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
      connections: [
        {
          targetNode: { label: "n1", color: "#FF7F0E", type: "neuron" },
          connSpec: { rule: "pairwise_bernoulli", p: 0.1 },
          synSpec: { model: "static_synapse", weight: 1, delay: 1 },
        },
        {
          targetNode: { label: "n2", color: "#2CA02C", type: "neuron", weight: "inhibitory" },
          connSpec: { rule: "pairwise_bernoulli", p: 0.1 },
          synSpec: { model: "static_synapse", weight: 1, delay: 1 },
        },
      ],
    },
    {
      label: "n2",
      model: "iaf_psc_alpha",
      color: "#2CA02C",
      type: "neuron",
      weight: "inhibitory",
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
      connections: [
        {
          targetNode: { label: "n1", color: "#FF7F0E", type: "neuron" },
          connSpec: { rule: "pairwise_bernoulli", p: 0.1 },
          synSpec: { model: "static_synapse", weight: -1, delay: 1 },
        },
        {
          targetNode: { label: "n2", color: "#2CA02C", type: "neuron", weight: "inhibitory" },
          connSpec: { rule: "pairwise_bernoulli", p: 0.1 },
          synSpec: { model: "static_synapse", weight: -1, delay: 1 },
        },
      ],
    },
    {
      label: "vm1",
      model: "voltmeter",
      type: "recorder",
      color: "#FF7F0E",
      connections: [{ targetNode: { label: "n1", color: "#FF7F0E", type: "neuron" } }],
    },
    {
      label: "vm2",
      model: "voltmeter",
      type: "recorder",
      color: "#2CA02C",
      connections: [{ targetNode: { label: "n2", color: "#2CA02C", type: "neuron", weight: "inhibitory" } }],
    },
  ],
});

const update = () => {
  state.nodes.forEach((node) => {
    if (node.params != undefined) {
      node.params.forEach((param) => {
        if (param.id === "stop") {
          const end = param.max === param.value;
          param.max = state.kernel[0].value;
          if (end) {
            param.value = param.max;
          }
        } else if (param.id === "time") {
          const end = param.max === param.value[1];
          param.max = state.kernel[0].value;
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
