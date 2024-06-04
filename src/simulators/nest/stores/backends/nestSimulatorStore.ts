// nestSimulatorStore.ts

import { defineBackendStore } from "@/stores/defineBackendStore";

const useNESTSimulatorStore = defineBackendStore(
  "nest",
  "nest",
  "http://localhost:52425",
  { axiosHeaderTokenValue: "NESTServerAuth" }
);

export { useNESTSimulatorStore };
