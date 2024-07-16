// modelDBStore.ts

import { defineModelDBStore } from "@/stores/model/defineModelDBStore";

import { PyNNModel } from "../../helpers/model/model";
import { PyNNModelDB } from "../../helpers/model/modelDB";

const modelAssets = [
  "ACSource",
  "DCSource",
  "IF_cond_alpha",
  "IF_curr_alpha",
  "NoisyCurrentSource",
  "SpikeSourceArray",
  "SpikeSourcePoisson",
  "StepCurrentSource",
];

// export const usePyNNModelDBStore = defineModelDBStore<PyNNModel>({
export const usePyNNModelDBStore = defineModelDBStore({
  Model: PyNNModel,
  ModelDB: PyNNModelDB,
  modelAssets,
  simulator: "pynn",
});
