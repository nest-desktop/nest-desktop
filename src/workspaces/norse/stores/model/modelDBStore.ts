// modelDBStore.ts

import { defineModelDBStore } from "@/stores/model/defineModelDBStore";

import { NorseModel } from "../../helpers/model/model";
import { NorseModelDB } from "../../helpers/model/modelDB";

const modelAssets = [
  "alternating_current",
  "direct_current",
  "input_spikes",
  "lif_neuron",
  "multimeter",
  "noise_current",
  "poisson_spikes",
  "spike_recorder",
  "step_current",
  "voltmeter",
];

export const useNorseModelDBStore = defineModelDBStore<NorseModel>({
  Model: NorseModel,
  ModelDB: NorseModelDB,
  modelAssets,
  workspace: "norse",
});
