// modelDBStore.ts

import { defineModelDBStore } from "@/store/model/defineModelDBStore";

import { PyNNModel } from "../../helpers/model/model";
import { PyNNModelDB } from "../../helpers/model/modelDB";

const modelAssets = [
  "voltmeter",
  "step_current_generator",
  "static_synapse",
  "spike_recorder",
  "spike_generator",
  "poisson_generator",
  "parrot_neuron",
  "noise_generator",
  "multimeter",
  "iaf_psc_alpha",
  "iaf_cond_alpha",
  "hh_psc_alpha",
  "dc_generator",
  "ac_generator",
];

export const usePyNNModelDBStore = defineModelDBStore({
  Model: PyNNModel,
  ModelDB: PyNNModelDB,
  modelAssets,
  simulator: "pynn",
});
