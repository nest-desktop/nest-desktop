// defineBackendStore.ts

import axios from "axios";
import { defineStore } from "pinia";

import combineURLs from "@/utils/combineURLs";
import { defineBackendSessionStore } from "./defineBackendSessionStore";

export function defineBackendStore(
  name: string,
  args: {
    enabled?: boolean;
    url: string;
    defaults: { path: string; port: string; protocol: string };
  }
) {
  return defineStore(name + "-backend-store", {
    state: () => ({
      accessToken: "",
      enabled: args.enabled || false,
      name: name,
      url: args.url,
    }),
    getters: {
      URL(state: any): URL {
        return new URL(state.url);
      },
      defaults(): { path: string; port: string; protocol: string } {
        return args.defaults;
      },
      session: () => {
        const useBackendSessionSore = defineBackendSessionStore(name);
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
      init(): void {
        this.session.instance.defaults.baseURL = this.url;
        if (this.enabled) {
          this.ping();
        }
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
        return this.session.ping(url || this.url).then(() => {
          if (url) {
            this.url = url;
          }
        });
      },
    },
    persist: true,
  });
}
