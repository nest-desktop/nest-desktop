// defineBackendStore.ts

import axios from "axios";
import { defineStore } from "pinia";

import combineURLs from "@/utils/combineURLs";
import { defineBackendSessionStore } from "./defineBackendSessionStore";

export function defineBackendStore(args: {
  enabled?: boolean;
  name: string;
  url: string;
  defaults: { path: string; port: string; protocol: string };
}) {
  return defineStore(args.name + "-backend-store", {
    state: () => ({
      enabled: args.enabled || false,
      url: args.url,
    }),
    getters: {
      URL(state: any): URL {
        return new URL(state.url);
      },
      defaults(): { path: string; port: string; protocol: string } {
        return args.defaults;
      },
      instance(state: any): any {
        return axios.create({ baseURL: state.url });
      },
      session: () => {
        const useBackendSessionSore = defineBackendSessionStore({
          name: args.name,
        });
        const backendSessionStore = useBackendSessionSore();
        return backendSessionStore;
      },
    },
    actions: {
      async check(): Promise<void> {
        if (this.enabled === false) return;

        // Check if the hostname does not already exist in the config.
        return this.URL.hostname ? this.ping() : this.seek();
      },
      /**
       * Seek the server URL of the backend.
       */
      async seek(): Promise<any> {
        const protocol: string =
          this.default.protocol || window.location.protocol;
        const hostname: string = window.location.hostname || "localhost";
        const hosts: string[] = [
          combineURLs(hostname + ":" + this.default.port),
          combineURLs(hostname, this.default.path),
        ];
        const hostPromises: any[] = hosts.map((host: string) =>
          this.ping(protocol + "//" + host)
        );
        return axios.all(hostPromises);
      },
      /**
       * Ping the server of the backend.
       * @param url The URL which should be pinged.
       */
      async ping(url?: string): Promise<any> {
        this.session.reset();

        return axios
          .get(url || this.url)
          .then((response: any) => {
            this.session.response = response;
            switch (response.status) {
              case 0:
                // See https://fetch.spec.whatwg.org/#concept-network-error
                this.session.error = response.data;
                break;
              case 200:
                if (url) {
                  this.url = url;
                }
                break;
              default:
                break;
            }
          })
          .catch((error: any) => {
            this.session.error = error;
          });
      },
    },
    persist: true,
  });
}
