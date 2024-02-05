// pynnSessionStore.ts

import { defineStore } from "pinia";

export const usePyNNSessionStore = defineStore("pynn-session-store", {
  state: () => ({
    loading: true,
  }),
});
