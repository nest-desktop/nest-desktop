// defineBackendStore.ts

import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, AxiosResponseHeaders } from "axios";
import { defineStore } from "pinia";
import { computed, reactive } from "vue";

import { notifyError, notifySuccess } from "@/helpers/common/notification";
import { getBoolean } from "@/utils/boolean";
import { loadJSON } from "@/utils/fetch";
import { logger as mainLogger } from "@/utils/logger";
import { IActivityProps, IEventProps } from "@/helpers/activity/activity";

export interface IAxiosResponseData {
  data: IResponseData;
  status: number;
  statusText: string;
  headers: AxiosResponseHeaders;
  config: AxiosRequestConfig;
}

export interface IAxiosErrorData {
  lineNumber: number;
  message: string;
}

export interface IResponseData {
  events: IEventProps[];
  biological_time: number;
  positions?: Record<string, number[]>;
  activities?: IActivityProps[];
}

export function defineBackendStore(workspace: string, name: string, url: string, options?: Record<string, string>) {
  const logger = mainLogger.getSubLogger({ name: name + " backend store" });

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
      const versions = computed((): string[][] => Object.entries(state.response.data));

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

        return loadJSON(`assets/workspaces/${workspace}/config/backends.json`)
          .then((data) => {
            const config = data[name];
            const baseURL =
              (window.location.protocol.includes("http") ? window.location.protocol : "http:") +
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
          .then((response: AxiosResponse<IAxiosResponseData>) => {
            state.response = response;
            switch (response.status) {
              case 200:
                notifySuccess(`${baseURL} (${name} backend) found.`);
                break;
              default:
                notifyError(`${baseURL} (${name} backend) ${response.statusText.toLowerCase()}.`);
                break;
            }
            return baseURL;
          })
          .catch((error: AxiosError<IAxiosResponseData>) => {
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
          axiosInstance.defaults.headers.common[options?.axiosHeaderTokenValue || "AccessToken"] = state.accessToken;
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
          pick: ["state.enabled", "state.loadedFromAssets", "state.url"],
          storage: localStorage,
        },
        {
          pick: ["state.accessToken"],
          storage: sessionStorage,
        },
      ],
    },
  );
}
