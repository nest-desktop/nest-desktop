// sessionStore.ts

import { defineStore } from "pinia";

export const useNESTSessionStore = defineStore("nest-session-store", {
  state: () => ({
    loading: true,
  }),
});
