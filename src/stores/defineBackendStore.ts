// defineBackendStore.ts

import axios, { AxiosError, AxiosResponse } from "axios";
import { Store, defineStore } from "pinia";
import { computed, reactive } from "vue";

import { getBoolean } from "@/utils/boolean";
import { notifyError, notifySuccess } from "@/utils/dialog";
import { loadJSON } from "@/utils/fetch";
import { logger as mainLogger } from "@/utils/logger";

export type TBackendStore = Store<string, any>;

export function defineBackendStore(
  simulator: string,
  name: string,
  url: string,
  options?: Record<string, string>
) {
  const logger = mainLogger.getSubLogger({
    minLevel: 3,
    name: name + " backend store",
  });

  return defineStore(
    name + "-backend-store",
    () => {
      const state = reactive<{
        accessToken: string;
        enabled: boolean;
        error: AxiosError;
        loadedFromAssets: boolean;
        name: string;
        response: AxiosResponse;
        url: string;
      }>({
        accessToken: "",
        enabled: false,
        error: {} as AxiosError,
        loadedFromAssets: false,
        name,
        response: {
          status: 0,
          data: {},
        } as AxiosResponse,
        url,
      });

      const axiosInstance = axios.create();

      const defaults = computed((): string => url);
      const isOK = computed((): boolean => state.response.status === 200);
      const isValid = computed((): boolean => name in state.response.data);
      const versions = computed((): string[][] =>
        Object.entries(state.response.data)
      );

      /**
       * Check backend.
       */
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

        if (!state.loadedFromAssets) {
          loadFromAssets();
        }

        // state.loadedFromAssets ? update() : loadFromAssets().then(update);
      };

      /**
       * Load from assets.
       * @returns void promise
       */
      const loadFromAssets = async (): Promise<void> => {
        logger.trace("load config");

        return loadJSON(`assets/simulators/${simulator}/config/backends.json`)
          .then((data) => {
            const config = data[name];
            const baseURL =
              (window.location.protocol.includes("http")
                ? window.location.protocol
                : "http:") +
              "//" +
              (window.location.hostname || "localhost");

            if (config.url) {
              state.url = config.url;
            } else if (config.port) {
              state.url = baseURL + ":" + config.port;
            } else if (config.path) {
              state.url = baseURL + "/" + config.path;
            } else {
              state.url = url;
            }

            state.enabled = getBoolean(config.enabled) || false;
          })
          .finally(() => {
            state.loadedFromAssets = true;
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
                  break;
                default:
                  notifyError(
                    `${baseURL} (${name} backend) ${response.statusText.toLowerCase()}.`
                  );
                  break;
              }
              return baseURL;
            }
          )
          .catch((error: AxiosError<any, { message: string }>) => {
            state.error = error;
            notifyError(`Ping ${baseURL} (${name} backend): ${error.message}`);
          });
      };

      /**
       * Reset response and error states.
       */
      const resetResponse = (): void => {
        state.response = {
          status: 0,
          data: {},
        } as AxiosResponse;
        state.error = {} as AxiosError;
      };

      /**
       * Reset url to defaults.
       */
      const resetURL = (): void => {
        state.url = url;
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

        axiosInstance.defaults.baseURL = state.url || url;
      };

      /**
       * Update access token.
       */
      const updateAccessToken = (): void => {
        logger.trace("update access token");

        // Add token to axios instance header.
        if (state.accessToken) {
          axiosInstance.defaults.headers.common[
            options?.axiosHeaderTokenValue || "AccessToken"
          ] = state.accessToken;
        }
      };

      /**
       * Update axios instance.
       */
      const updateInstance = (): void => {
        logger.trace("update instance");

        updateURL();
        updateAccessToken();
      };

      return {
        URL,
        axiosInstance: () => axiosInstance,
        check,
        defaults,
        init,
        isOK,
        isValid,
        loadFromAssets,
        ping,
        resetResponse,
        resetURL,
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
          paths: ["state.enabled", "state.loadedFromAssets", "state.url"],
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
