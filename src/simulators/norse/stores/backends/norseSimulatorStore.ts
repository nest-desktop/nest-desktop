// norseSimulatorStore.ts

import { defineBackendStore } from "@/stores/defineBackendStore";
import { TStore } from "@/types";

export const useNorseSimulatorStore = defineBackendStore("norse", "norse", "http://localhost:11428");

export const norseSimulatorInit = (): TStore => {
  // Initialize backend Norse Simulator.
  const norseSimulatorStore: TStore = useNorseSimulatorStore();
  norseSimulatorStore.init();
  return norseSimulatorStore;
};

const simulate = (data: { source: string; return?: string }) => {
  const norseSimulatorStore = useNorseSimulatorStore();
  return norseSimulatorStore.axiosInstance().post("exec", data);
};

export default { simulate };
