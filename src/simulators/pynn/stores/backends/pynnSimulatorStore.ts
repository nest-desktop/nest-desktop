// pynnSimulatorStore.ts

import { defineBackendStore } from "@/stores/defineBackendStore";

export const usePyNNSimulatorStore = defineBackendStore(
  "pynn",
  "pynn",
  "http://localhost:91198"
);

const simulate = (data: { source: string; return?: string }) => {
  const pynnSimulatorStore = usePyNNSimulatorStore();

  return pynnSimulatorStore.axiosInstance().post("exec", data);
};

export default { simulate };
