// appSessionStore.ts

import { defineStore } from "pinia";
import { reactive } from "vue";

export const useAppSessionStore = defineStore(
  "app-session-store",
  () => {
    const state = reactive({
      devMode: false,
      loading: false,
      webGL: false,
    });
    return { state };
  },
  {
    persist: {
      storage: sessionStorage,
    },
  }
);
