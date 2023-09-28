// defineBackendStore.ts

import { defineStore } from "pinia";

import { getBoolean } from "@/utils/boolean";
import { getRuntimeConfig } from "@/utils/fetch";
import { logger as mainLogger } from "@/helpers/common/logger";

import { defineBackendSessionStore } from "./defineBackendSessionStore";

export function defineBackendStore(
  simulator: string,
  name: string,
  url: string
) {
  const logger = mainLogger.getSubLogger({
    name: simulator + " backend store",
    minLevel: 3,
  });

  return defineStore(name + "-backend-store", {
    state: () => ({
      accessToken: "",
      defaults: { url },
      enabled: false,
      configLoadedFromAssets: false,
      name,
      url,
    }),
    getters: {
      URL(state: any): URL {
        return new URL(state.url);
      },
      session: () => {
        const useBackendSessionSore = defineBackendSessionStore(name);
        const backendSessionStore = useBackendSessionSore();
        return backendSessionStore;
      },
    },
    actions: {
      async loadConfig(): Promise<void> {
        logger.trace("load config");
        return getRuntimeConfig(
          `/assets/simulators/${simulator}/config/backends.json`
        )
          .then((data) => {
            const config = data[this.name];
            const baseURL =
              window.location.protocol + "//" + window.location.hostname;
            if (config.port) {
              this.url = baseURL + ":" + config.port;
            } else if (config.path) {
              this.url = baseURL + "/" + config.path;
            } else {
              this.url = config.url || this.defaults.url;
            }
            this.enabled = getBoolean(config.enabled) || false;
          })
          .finally(() => {
            this.configLoadedFromAssets = true;
          });
      },
      async check(): Promise<void> {
        logger.trace("check");
        if (this.enabled === false) return;
        return this.ping();
      },
      init(): void {
        logger.trace("init");
        if (!this.configLoadedFromAssets) {
          this.loadConfig();
        }
        this.updateURL();
        this.check();
      },
      reset(): void {
        this.url = this.defaults.url;
      },
      /**
       * Ping the server of the backend.
       * @param url The URL which should be pinged.
       */
      async ping(url?: string): Promise<any> {
        logger.trace("ping");
        return this.session.ping(url || this.url);
      },
      updateURL(): void {
        this.session.instance.defaults.baseURL = this.url;
      },
    },
    persist: true,
  });
}
