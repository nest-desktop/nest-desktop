// pynnSimulatorStore.ts

import { defineBackendStore } from "@/stores/defineBackendStore";
import { TStore } from "@/types";

export const usePyNNSimulatorStore = defineBackendStore("pynn", "pynn", "http://localhost:91198");

export const pynnSimulatorInit = (): TStore => {
  // Initialize backend PyNN Simulator
  const pynnSimulatorStore: TStore = usePyNNSimulatorStore();
  pynnSimulatorStore.init();
  return pynnSimulatorStore;
};

const simulate = (data: { source: string; return?: string }) => {
  const pynnSimulatorStore = usePyNNSimulatorStore();
  return pynnSimulatorStore.axiosInstance().post("exec", data);
};

export default { simulate };
