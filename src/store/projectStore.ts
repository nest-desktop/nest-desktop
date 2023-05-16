// Utilities
import { defineStore } from "pinia";

export const useProjectStore = defineStore("project", {
  state: () => ({
    projectId: "xx",
    view: "edit",
    controllerOpen: false,
    controllerView: "",
    width: 320,
    project: {
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
              targetNode: {
                label: "n1",
                color: "#FF7F0E",
                type: "neuron",
                weight: "excitatory",
              },
              connSpec: { rule: "all_to_all" },
              synSpec: { model: "static_synapse", weight: 1, delay: 1 },
            },
            {
              targetNode: {
                label: "n2",
                color: "#2CA02C",
                type: "neuron",
                weight: "inhibitory",
              },
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
              targetNode: {
                label: "n1",
                color: "#FF7F0E",
                type: "neuron",
                weight: "excitatory",
              },
              connSpec: { rule: "pairwise_bernoulli", p: 0.1 },
              synSpec: { model: "static_synapse", weight: 1, delay: 1 },
            },
            {
              targetNode: {
                label: "n2",
                color: "#2CA02C",
                type: "neuron",
                weight: "inhibitory",
              },
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
              targetNode: {
                label: "n1",
                color: "#FF7F0E",
                type: "neuron",
                weight: "excitatory",
              },
              connSpec: { rule: "pairwise_bernoulli", p: 0.1 },
              synSpec: { model: "static_synapse", weight: -1, delay: 1 },
            },
            {
              targetNode: {
                label: "n2",
                color: "#2CA02C",
                type: "neuron",
                weight: "inhibitory",
              },
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
          connections: [
            {
              targetNode: {
                label: "n1",
                color: "#FF7F0E",
                type: "neuron",
                weight: "excitatory",
              },
            },
          ],
        },
        {
          label: "vm2",
          model: "voltmeter",
          type: "recorder",
          color: "#2CA02C",
          connections: [
            {
              targetNode: {
                label: "n2",
                color: "#2CA02C",
                type: "neuron",
                weight: "inhibitory",
              },
            },
          ],
        },
      ],
    },
  }),

  actions: {
    toggle(item: any = null) {
      if (!this.controllerOpen || this.controllerView === item.id) {
        this.controllerOpen = !this.controllerOpen;
      }
      this.controllerView = this.controllerOpen ? item.id : "";
    },
  },
});
