// simulatorStore.ts

import { defineStore } from "pinia";

export const useSimulatorStore = (simulator: string) =>
  defineStore(`${simulator}-store`, {
    state: () => ({
      loading: true,
    }),
  });
