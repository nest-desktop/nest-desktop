// modelDBStore.ts

import { defineModelDBStore } from "@/store/model/defineModelDBStore";

import { NESTModel } from "../../helpers/model/model";
import { NESTModelDB } from "../../helpers/model/modelDB";

const modelAssets = [
  "voltmeter",
  "step_current_generator",
  "static_synapse",
  "spike_recorder",
  "spike_generator",
  "poisson_generator",
  "noise_generator",
  "multimeter",
  "lif_neuron",
  "dc_generator",
  "ac_generator",
];

export const useNESTModelDBStore = defineModelDBStore({
  Model: NESTModel,
  ModelDB: NESTModelDB,
  modelAssets,
  simulator: "nest",
});
