// defineBackendSessionStore.ts

import axios from "axios";
import { defineStore } from "pinia";

export function defineBackendSessionStore(name: string) {
  return defineStore(name + "-backend-session-store", {
    state: () => ({
      error: "",
      instance: axios.create(),
      response: {
        status: 0,
        data: {},
      },
    }),
    getters: {
      isOK: (state) => {
        return state.response.status === 200;
      },
      isValid: (state) => {
        return name in state.response.data;
      },
      versions: (state) => {
        return Object.entries(state.response.data);
      },
    },
    actions: {
      /**
       * Ping the server of the backend.
       * @param url The URL which should be pinged.
       */
      async ping(url: string): Promise<any> {
        this.reset();

        return this.instance
          .get(url)
          .then((response: any) => {
            this.response = response;
            switch (response.status) {
              case 0:
                // See https://fetch.spec.whatwg.org/#concept-network-error
                this.error = response.data;
                break;
              case 200:
                return url;
              default:
                break;
            }
          })
          .catch((error: any) => {
            this.error = error;
          });
      },

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
