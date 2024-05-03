// nestStore.ts

import { defineStore } from "pinia";
import { reactive } from "vue";

export const useNESTStore = defineStore("nest-store", () => {
  const state = reactive({
    backends: {},
    loading: true,
  });

  return { state };
});
