// pynnSimulatorStore.ts

import { defineBackendStore, IAxiosResponseData } from "@/backends";
import { TStore } from "@/types";

export const usePyNNSimulatorStore = defineBackendStore("pynn", "pynn", "http://localhost:91198");

export const initPyNNSimulator = (): TStore => {
  // Initialize backend PyNN Simulator
  const pynnSimulatorStore: TStore = usePyNNSimulatorStore();
  pynnSimulatorStore.init();
  return pynnSimulatorStore;
};

const exec = (source: string, responseKeys: string | string[] = "response") => {
  const pynnSimulatorStore = usePyNNSimulatorStore();
  return pynnSimulatorStore
    .axiosInstance()
    .post<IAxiosResponseData>("exec", { source, response_keys: responseKeys, return: responseKeys });
};

export default { exec };
