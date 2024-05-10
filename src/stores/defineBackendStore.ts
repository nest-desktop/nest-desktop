// defineBackendStore.ts

import axios, { AxiosError, AxiosResponse } from "axios";
import { computed, reactive } from "vue";
import { defineStore } from "pinia";

import { getRuntimeConfig } from "@/utils/fetch";
import { logger as mainLogger } from "@/helpers/common/logger";
import { notifyError, notifySuccess } from "@/helpers/common/dialog";
import { getBoolean } from "@/utils/boolean";

export function defineBackendStore(
  simulator: string,
  name: string,
  url: string
) {
  const logger = mainLogger.getSubLogger({
    minLevel: 3,
    name: name + " backend store",
  });

  return defineStore(
    name + "-backend-store",
    () => {
      const state = reactive({
        accessToken: "",
        configLoadedFromAssets: false,
        defaults: { url },
        enabled: false,
        error: {} as AxiosError,
        name,
        response: {
          status: 0,
          data: {},
        } as AxiosResponse,
        url,
      });

      const axiosInstance = axios.create();

      const isOK = computed((): boolean => state.response.status === 200);
      const isValid = computed((): boolean => name in state.response.data);
      const versions = computed((): string[][] =>
        Object.entries(state.response.data)
      );

      const check = (): void => {
        if (state.enabled === false) return;
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
       * Load config from file.
       * @param simulator
       * @returns
       */
      const loadConfig = async (): Promise<void> => {
        logger.trace("load config");

        return getRuntimeConfig(
          `assets/simulators/${simulator}/config/backends.json`
        )
          .then((data) => {
            const config = data[name];
            const baseURL =
              (window.location.protocol.includes("http")
                ? window.location.protocol
                : "http:") +
              "//" +
              (window.location.hostname || "localhost");

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

      /**
       * Ping the URL.
       * @param url The URL which should be pinged.
       */
      const ping = (url?: string): void => {
        const baseURL = url || state.url;
        logger.trace("ping:", baseURL);

        resetResponse();

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
            notifyError(`Ping ${baseURL} (${name} backend): ${error.message}`);
          });
      };

      /**
       * Reset state.
       */
      const resetResponse = (): void => {
        state.response = {
          status: 0,
          data: {},
        } as AxiosResponse;
        state.error = {} as AxiosError;
      };

      const resetURL = (): void => {
        state.url = state.defaults.url;
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

        axiosInstance.defaults.baseURL = state.url;
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
        check,
        init,
        isOK,
        isValid,
        ping,
        resetResponse,
        resetURL,
        loadConfig,
        state,
        update,
        updateAccessToken,
        updateInstance,
        updateURL,
        versions,
      };
    },
    {
      persist: [
        {
          paths: [
            "state.defaults",
            "state.enabled",
            "state.configLoadedFromAssets",
            "state.url",
          ],
          storage: localStorage,
        },
        {
          paths: ["state.accessToken"],
          storage: sessionStorage,
        },
      ],
    }
  );
}
