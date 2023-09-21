// defineBackendStore.ts

import axios from "axios";
import { defineStore } from "pinia";

import { combineURLs } from "@/utils/urls";
import { defineBackendSessionStore } from "./defineBackendSessionStore";

interface DefaultProps {
  path: string;
  port: string;
  protocol: string;
  url: string;
}

export function defineBackendStore(
  name: string,
  args: {
    disabled?: boolean;
    url?: string;
    defaults: DefaultProps;
  }
) {
  return defineStore(name + "-backend-store", {
    state: () => ({
      accessToken: "",
      enabled: !(args.disabled || false),
      name: name,
      url: args.url || args.defaults.url,
    }),
    getters: {
      URL(state: any): URL {
        return new URL(state.url);
      },
      defaults(): DefaultProps {
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
      reset(): void {
        this.url = this.defaults.url;
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
