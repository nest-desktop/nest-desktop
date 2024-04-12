// appSessionStore.ts

import { defineStore } from "pinia";
import { reactive } from "vue";

export const useAppSessionStore = defineStore(
  "app-session-store",
  () => {
    const state = reactive({
      devMode: false,
      filterTag: "",
      loading: false,
      logsOpen: false,
      requestLogs: [] as { date: string; text: string; type: string }[],
      webGL: true,
    });

    const clearLogs = () => {
      state.requestLogs = [];
    };
    return { clearLogs, state };
  },
  {
    persist: {
      storage: sessionStorage,
    },
  }
);
