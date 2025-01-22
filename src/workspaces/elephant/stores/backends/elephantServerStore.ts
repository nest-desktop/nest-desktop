// elephantServerStore.ts

import { TStore } from "@/types";
import { defineBackendStore, IAxiosResponseData } from "@/stores/defineBackendStore";

export const useElephantServerStore = defineBackendStore("elephant", "elephant", "http://localhost:52428");

export const elephantServerInit = (): TStore => {
  // Initialize backend Elephant Server
  const elephantServerStore: TStore = useElephantServerStore();
  elephantServerStore.init();
  return elephantServerStore;
};

const exec = (source: string, responseKeys: string | string[] = "response") => {
  const elephantServerStore = useElephantServerStore();
  return elephantServerStore.axiosInstance().post<IAxiosResponseData>("exec", { source, response_keys: responseKeys });
};

export default { exec };
