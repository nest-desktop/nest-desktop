// modelDBStore.ts

import { defineModelDBStore } from "@/store/model/defineModelDBStore";

import { NESTModel } from "../../helpers/model/model";
import { NESTModelDB } from "../../helpers/model/modelDB";

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

export const useNESTModelDBStore = defineModelDBStore({
  Model: NESTModel,
  ModelDB: NESTModelDB,
  modelAssets,
  simulator: "nest",
});
