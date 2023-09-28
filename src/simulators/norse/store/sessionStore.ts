// norseSessionStore.ts

import { defineStore } from "pinia";

export const useNorseSessionStore = defineStore("norse-session-store", {
  state: () => ({
    loading: true,
  }),
});
