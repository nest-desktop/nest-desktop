// defineBackendSessionStore.ts

import { defineStore } from "pinia";

export function defineBackendSessionStore(args: { name: string }) {
  return defineStore(args.name + "-backend-session-store", {
    state: () => ({
      response: {
        status: 0,
        data: {},
      },
      error: "",
    }),
    getters: {
      isOK: (state) => {
        return state.response.status === 200;
      },
      isValid: (state) => {
        return args.name in state.response.data;
      },
      versions: (state) => {
        return Object.entries(state.response.data);
      },
    },
    actions: {
      reset(): void {
        this.response = {
          status: 0,
          data: {},
        };
        this.error = "";
      },
    },
    persist: {
      storage: sessionStorage,
    },
  });
}
