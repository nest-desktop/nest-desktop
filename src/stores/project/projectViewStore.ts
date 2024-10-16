// moduleStore.ts

import { defineStore } from "pinia";
import { reactive } from "vue";

export const useProjectViewStore = defineStore(
  "project-view",
  () => {
    const state = reactive<{
      simulateAfterChange: { title: string; value: boolean };
      simulateAfterCheckout: { title: string; value: boolean };
      simulateAfterLoad: { title: string; value: boolean };
    }>({
      simulateAfterChange: { title: "simulate after change", value: false },
      simulateAfterCheckout: { title: "simulate after checkout", value: false },
      simulateAfterLoad: { title: "simulate after load", value: false },
    });

    return { state };
  },
  {
    persist: true,
  }
);
