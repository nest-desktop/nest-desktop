// projectMockStore.ts
import { defineStore } from "pinia";

const modelParams = {
  dc_generator: {
    amplitude: {
      inputLabel: "amplitude",
      label: "amplitude",
      value: 0,
      unit: "pA",
    },
    start: {
      inputLabel: "start",
      label: "start",
      unit: "ms",
      value: 0,
    },
    stop: {
      inputLabel: "stop",
      label: "stop",
      max: 1000,
      unit: "ms",
      value: 1000,
    },
    time: {
      inputLabel: ["start", "stop"],
      label: "time",
      max: 1000,
      unit: "ms",
      variant: "range",
      value: [0, 1000],
    },
  },
  iaf_psc_alpha: {
    V_m: {
      inputLabel: "V_m",
      label: "initial membrane potentials",
      max: 0,
      min: -100,
      unit: "mV",
      value: -70,
    },
    V_th: {
      label: "spike threshold",
      max: 0,
      min: -100,
      unit: "mV",
      value: -55,
    },
    E_L: {
      id: "E_L",
      label: "reversal potentials",
      max: 0,
      min: -100,
      unit: "mV",
      value: -70,
    },
  },
  voltmeter: {
    start: { label: "start", unit: "ms", value: 0 },
    stop: { label: "stop", max: 1000, unit: "ms", value: 1000 },
    time: {
      inputLabel: ["start", "stop"],
      label: "time",
      max: 1000,
      unit: "ms",
      variant: "range",
      value: [0, 1000],
    },
  },
};

const colors = ["#1F77B4", "#FF7F0E", "#2CA02C"];

const nodes = [
  {
    label: "dc1",
    modelId: "dc_generator",
    color: colors[0],
    elementType: "stimulus",
    modelParams: modelParams.dc_generator,
    size: 1,
    paramsVisible: ["amplitude", "stop", "time"],
    params: {
      amplitude: 10,
      start: 0,
      stop: 1000,
      time: [0, 1000],
    },
  },
  {
    label: "n1",
    modelId: "iaf_psc_alpha",
    color: colors[1],
    elementType: "neuron",
    weight: "excitatory",
    paramsVisible: ["size", "V_m"],
    size: 40,
    modelParams: modelParams.iaf_psc_alpha,
    params: {
      V_m: -70,
      V_th: -55,
    },
  },
  {
    color: colors[2],
    elementType: "neuron",
    label: "n2",
    modelId: "iaf_psc_alpha",
    modelParams: modelParams.iaf_psc_alpha,
    paramsVisible: ["size", "V_m"],
    params: {
      V_m: -70,
      V_th: -55,
    },
    weight: "inhibitory",
    size: 10,
  },
  {
    label: "vm1",
    modelId: "voltmeter",
    elementType: "recorder",
    color: colors[1],
  },
  {
    label: "vm2",
    modelId: "voltmeter",
    elementType: "recorder",
    color: colors[2],
  },
];

const connSpecs = {
  allToAll: { rule: "all_to_all" },
  pairwiseBernoulli: { rule: "pairwise_bernoulli", p: 0.1 },
};

const synSpecs = {
  staticSynapse: { model: "static_synapse", weight: 1, delay: 1 },
};

export const useProjectMockStore = defineStore("projectMock", {
  state: () => ({
    project: {
      network: {
        nodes: [
          {
            ...nodes[0],
            targets: [
              {
                target: nodes[1],
              },
              {
                target: nodes[2],
              },
            ],
          },
          {
            ...nodes[1],
            targets: [
              {
                target: nodes[1],
                connSpec: connSpecs.pairwiseBernoulli,
                synSpec: synSpecs.staticSynapse,
              },
              {
                target: nodes[2],
                connSpec: connSpecs.pairwiseBernoulli,
                synSpec: synSpecs.staticSynapse,
              },
            ],
          },
          {
            ...nodes[2],
            targets: [
              {
                target: nodes[1],
                connSpec: connSpecs.pairwiseBernoulli,
                synSpec: { ...synSpecs.staticSynapse, weight: -1 },
              },
              {
                target: nodes[2],
                connSpec: connSpecs.pairwiseBernoulli,
                synSpec: { ...synSpecs.staticSynapse, weight: -1 },
              },
            ],
          },
          {
            ...nodes[3],
            targets: [
              {
                target: nodes[1],
              },
            ],
          },
          {
            ...nodes[4],
            targets: [
              {
                target: nodes[2],
              },
            ],
          },
        ],
      },
      simulation: {
        time: 1000,
      },
    },
  }),
});
