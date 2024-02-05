// defineBackendSessionStore.ts

import axios from "axios";
import { defineStore } from "pinia";

import { logger as mainLogger } from "@/helpers/common/logger";

import { defineBackendConfigStore } from "./defineBackendConfigStore";
import { computed, reactive } from "vue";

export function defineBackendStore(
  simulator: string,
  name: string,
  url: string
) {
  const logger = mainLogger.getSubLogger({
    name: name + " backend store",
    minLevel: 3,
  });

  const useBackendConfigStore = defineBackendConfigStore(name, url);

  return defineStore(
    name + "-backend-store",
    () => {
      const state = reactive({
        accessToken: "",
        error: "",
        name,
        response: {
          status: 0,
          data: {},
        },
      });

      const axiosInstance = axios.create();
      const backendConfigStore = useBackendConfigStore();

      const isEnabled = backendConfigStore.state.enabled;
      const isOK = computed((): boolean => state.response.status === 200);
      const isValid = computed((): boolean => name in state.response.data);
      const URL = backendConfigStore.state.url;
      const versions = computed((): string[][] =>
        Object.entries(state.response.data)
      );

      const check = async (): Promise<void> => {
        if (backendConfigStore.state.enabled === false) return;
        logger.trace("check");
        return ping();
      };
      const init = (): void => {
        logger.trace("init");
        backendConfigStore.loadConfig(simulator);
        update();
      };
      /**
       * Ping the URL.
       * @param url The URL which should be pinged.
       */
      const ping = async (url?: string): Promise<any> => {
        logger.trace("ping:", url || backendConfigStore.state.url);
        reset();
        return axiosInstance
          .get(url || backendConfigStore.state.url)
          .then((response: any) => {
            state.response = response;
            switch (response.status) {
              case 0:
                // See https://fetch.spec.whatwg.org/#concept-network-error
                state.error = response.data;
                break;
              case 200:
                return url;
              default:
                break;
            }
          })
          .catch((error: any) => {
            state.error = error;
          });
      };

      const reset = (): void => {
        state.response = {
          status: 0,
          data: {},
        };
        state.error = "";
      };

      const update = (): void => {
        logger.trace("init");
        updateInstance();
        check();
      };

      const updateURL = (): void => {
        logger.trace("update URL");
        axiosInstance.defaults.baseURL = backendConfigStore.state.url;
      };

      const updateAccessToken = (): void => {
        // Add token to axios instance header.
        if (state.accessToken) {
          axiosInstance.defaults.headers.common["accessToken"] =
            state.accessToken;
        }
      };

      const updateInstance = (): void => {
        updateURL();
        updateAccessToken();
      };

      return {
        URL,
        axiosInstance: () => axiosInstance,
        backendConfigStore,
        check,
        init,
        isEnabled,
        isOK,
        isValid,
        ping,
        reset,
        state,
        update,
        updateAccessToken,
        updateInstance,
        updateURL,
        versions,
      };
    },
    {
      persist: {
        storage: sessionStorage,
      },
    }
  );
}
