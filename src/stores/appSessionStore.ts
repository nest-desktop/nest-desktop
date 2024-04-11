// appSessionStore.ts

import { defineStore } from "pinia";
import { reactive } from "vue";

export const useAppSessionStore = defineStore(
  "app-session-store",
  () => {
    const state = reactive({
      devMode: false,
      logsOpen: false,
      requestLogs: [] as { date: string; text: string; type: string }[],
      loading: false,
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
