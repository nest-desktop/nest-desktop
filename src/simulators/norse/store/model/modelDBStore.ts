// modelDBStore.ts

import { defineModelDBStore } from "@/store/model/defineModelDBStore";

import { NorseModel } from "../../helpers/model/model";
import { NorseModelDB } from "../../helpers/model/modelDB";

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

export const useNorseModelDBStore = defineModelDBStore({
  Model: NorseModel,
  ModelDB: NorseModelDB,
  modelAssets,
  simulator: "norse",
});
