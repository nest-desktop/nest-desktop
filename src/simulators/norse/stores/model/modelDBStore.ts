// modelDBStore.ts

import { defineModelDBStore } from "@/stores/model/defineModelDBStore";

import { NorseModel } from "../../helpers/model/model";
import { NorseModelDB } from "../../helpers/model/modelDB";

const modelAssets = [
  "ac_generator",
  "dc_generator",
  "lif_neuron",
  "multimeter",
  "noise_generator",
  "poisson_generator",
  "spike_generator",
  "spike_recorder",
  "step_current_generator",
  "voltmeter",
];

// export const useNorseModelDBStore = defineModelDBStore<NorseModel>({
export const useNorseModelDBStore = defineModelDBStore({
  Model: NorseModel,
  ModelDB: NorseModelDB,
  modelAssets,
  simulator: "norse",
});
