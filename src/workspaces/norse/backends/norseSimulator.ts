// norseSimulatorStore.ts

import type { TStore } from "@/types";
import { defineBackendStore, type IAxiosResponseData } from "@/backends";

export const useNorseSimulatorStore = defineBackendStore("norse", "norse", "http://localhost:11428");

export const initNorseSimulator = (): TStore => {
  // Initialize backend Norse Simulator.
  const norseSimulatorStore: TStore = useNorseSimulatorStore();
  norseSimulatorStore.init();
  return norseSimulatorStore;
};

const exec = (source: string, responseKeys: string | string[] = "response") => {
  const norseSimulatorStore = useNorseSimulatorStore();
  return norseSimulatorStore
    .axiosInstance()
    .post<IAxiosResponseData>("exec", { source, response_keys: responseKeys, return: responseKeys });
};

export default { exec };
