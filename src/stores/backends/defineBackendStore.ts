// defineBackendSessionStore.ts

import axios, { AxiosError, AxiosResponse } from "axios";
import { computed, reactive } from "vue";
import { defineStore } from "pinia";

import { defineBackendConfigStore } from "./defineBackendConfigStore";
import { logger as mainLogger } from "@/helpers/common/logger";
import { notifyError, notifySuccess } from "@/helpers/common/dialog";

export function defineBackendStore(
  simulator: string,
  name: string,
  url: string
) {
  const logger = mainLogger.getSubLogger({
    minLevel: 3,
    name: name + " backend store",
  });

  const useBackendConfigStore = defineBackendConfigStore(name, url);

  return defineStore(
    name + "-backend-store",
    () => {
      const state = reactive({
        accessToken: "",
        error: {} as AxiosError,
        name,
        response: {
          status: 0,
          data: {},
        } as AxiosResponse,
      });

      const axiosInstance = axios.create();
      const backendConfigStore = useBackendConfigStore();
      backendConfigStore.loadConfig(simulator);

      const isEnabled = backendConfigStore.state.enabled;
      const isOK = computed((): boolean => state.response.status === 200);
      const isValid = computed((): boolean => name in state.response.data);
      const URL = backendConfigStore.state.url;
      const versions = computed((): string[][] =>
        Object.entries(state.response.data)
      );

      const check = (): void => {
        if (backendConfigStore.state.enabled === false) return;
        logger.trace("check");
        ping();
      };

      /**
       * Initialize backend store.
       */
      const init = (): void => {
        logger.trace("init");
        update();
      };

      /**
       * Ping the URL.
       * @param url The URL which should be pinged.
       */
      const ping = (url?: string): void => {
        const baseURL = url || backendConfigStore.state.url;
        logger.trace("ping:", baseURL);
        reset();

        axiosInstance
          .get(baseURL)
          .then(
            (
              response: AxiosResponse<
                any,
                { status: number; statusText: string }
              >
            ) => {
              state.response = response;
              switch (response.status) {
                case 200:
                  notifySuccess(`${baseURL} (${name} backend) found.`);
                  return baseURL;
                default:
                  notifyError(
                    `${baseURL} (${name} backend) ${response.statusText.toLowerCase()}.`
                  );
                  break;
              }
            }
          )
          .catch((error: AxiosError<any, { message: string }>) => {
            state.error = error;
            console.log(error);
            notifyError(`Ping ${baseURL} (${name} backend): ${error.message}`);
          });
      };

      /**
       * Reset state.
       */
      const reset = (): void => {
        state.response = {
          status: 0,
          data: {},
        } as AxiosResponse;
        state.error = {} as AxiosError;
      };

      /**
       * Update backend store.
       */
      const update = (): void => {
        logger.trace("update");
        updateInstance();
        check();
      };

      /**
       * Update URL.
       */
      const updateURL = (): void => {
        logger.trace("update URL");
        axiosInstance.defaults.baseURL = backendConfigStore.state.url;
      };

      /**
       * Update access token.
       */
      const updateAccessToken = (): void => {
        // Add token to axios instance header.
        if (state.accessToken) {
          axiosInstance.defaults.headers.common["accessToken"] =
            state.accessToken;
        }
      };

      /**
       * Update axios instance.
       */
      const updateInstance = (): void => {
        updateURL();
        updateAccessToken();
      };

      update();

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
