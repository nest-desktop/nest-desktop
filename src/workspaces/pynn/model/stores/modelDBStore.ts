// modelDBStore.ts

import { defineModelDBStore } from "@/model";

import { PyNNModel } from "../model";
import { PyNNModelDB } from "./modelDB";

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

export const usePyNNModelDBStore = defineModelDBStore<PyNNModel>({
  Model: PyNNModel,
  ModelDB: PyNNModelDB,
  modelAssets,
  workspace: "pynn",
});
