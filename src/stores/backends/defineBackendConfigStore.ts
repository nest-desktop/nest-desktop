// defineBackendStore.ts

import { computed, reactive } from "vue";
import { defineStore } from "pinia";

import { getBoolean } from "@/utils/boolean";
import { getRuntimeConfig } from "@/utils/fetch";
import { logger as mainLogger } from "@/helpers/common/logger";

export function defineBackendConfigStore(name: string, url: string) {
  const logger = mainLogger.getSubLogger({
    name: name + " backend config store",
    minLevel: 3,
  });

  return defineStore(
    name + "-backend-config-store",
    () => {
      const state = reactive({
        defaults: { url },
        enabled: false,
        configLoadedFromAssets: false,
        url,
      });

      const getURL = computed(() => new URL(state.url));

      const loadConfig = async (simulator: string): Promise<void> => {
        logger.trace("load config");
        return getRuntimeConfig(
          `/assets/simulators/${simulator}/config/backends.json`
        )
          .then((data) => {
            const config = data[name];
            const baseURL =
              window.location.protocol + "//" + window.location.hostname;
            if (config.port) {
              state.url = baseURL + ":" + config.port;
            } else if (config.path) {
              state.url = baseURL + "/" + config.path;
            } else {
              state.url = config.url || state.defaults.url;
            }
            state.enabled = getBoolean(config.enabled) || false;
          })
          .finally(() => {
            state.configLoadedFromAssets = true;
          });
      };

      const reset = (): void => {
        state.url = state.defaults.url;
      };
      return { getURL, loadConfig, reset, state };
    },
    {
      persist: true,
    }
  );
}
