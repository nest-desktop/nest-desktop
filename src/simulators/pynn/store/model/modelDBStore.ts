// modelDBStore.ts

import { defineModelDBStore } from "@/store/model/defineModelDBStore";

import { PyNNModel } from "../../helpers/model/model";
import { PyNNModelDB } from "../../helpers/model/modelDB";

const modelAssets = [
  "ac_generator",
  "dc_generator",
  "hh_psc_alpha",
  "iaf_cond_alpha",
  "iaf_psc_alpha",
  "multimeter",
  "noise_generator",
  "parrot_neuron",
  "poisson_generator",
  "spike_generator",
  "spike_recorder",
  "static_synapse",
  "step_current_generator",
  "voltmeter",
];

export const usePyNNModelDBStore = defineModelDBStore({
  Model: PyNNModel,
  ModelDB: PyNNModelDB,
  modelAssets,
  simulator: "pynn",
});
