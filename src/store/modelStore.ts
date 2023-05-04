// Utilities
import { defineStore } from "pinia";

export const useModelStore = defineStore("model", {
  state: () => ({
    modelId: "dc_generator",
    view: "doc",
  }),
});
