// norseSimulatorStore.ts

import { defineBackendStore } from "@/stores/defineBackendStore";

export const useNorseSimulatorStore = defineBackendStore(
  "norse",
  "norse",
  "http://localhost:11428"
);

const simulate = (data: { source: string; return?: string }) => {
  const norseSimulatorStore = useNorseSimulatorStore();

  return norseSimulatorStore.axiosInstance().post("exec", data);
};

export default { simulate };
