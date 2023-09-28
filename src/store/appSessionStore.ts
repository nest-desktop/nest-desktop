// appSessionStore.ts

import { defineStore } from "pinia";

export const useAppSessionStore = defineStore("app-session-store", {
  state: () => ({
    devMode: false,
    loading: false,
    webGL: false,
  }),
  persist: {
    storage: sessionStorage,
  },
});
