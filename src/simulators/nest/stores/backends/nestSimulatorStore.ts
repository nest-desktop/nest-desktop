// nestSimulatorStore.ts

import { AxiosError, AxiosResponse } from "axios";

import { defineBackendStore } from "@/stores/defineBackendStore";
import { TModelStore } from "@/stores/model/defineModelStore";
import { notifyError } from "@/utils/dialog";

import { useNESTModelStore } from "../model/modelStore";

export const useNESTSimulatorStore = defineBackendStore(
  "nest",
  "nest",
  "http://localhost:52425",
  { axiosHeaderTokenValue: "NESTServerAuth" }
);

const fetchModels = () => {
  const modelStore: TModelStore = useNESTModelStore();
  const nestSimulatorStore = useNESTSimulatorStore();

  nestSimulatorStore
    .axiosInstance()
    .get("/api/Models")
    .then((response: AxiosResponse) => {
      if (response.data && response.data.length > 0) {
        modelStore.state.models = response.data.map((modelId: string) => ({
          id: modelId,
          elementType: getElementType(modelId),
        }));
      }
    });
};

const getElementType = (modelId: string) => {
  if (modelId.endsWith("generator") || modelId.endsWith("dilutor")) {
    return "stimulator";
  } else if (
    modelId.endsWith("meter") ||
    modelId.endsWith("detector") ||
    modelId.endsWith("recorder")
  ) {
    return "recorder";
  } else if (
    modelId.includes("synapse") ||
    modelId.includes("connection") ||
    modelId.startsWith("rate") ||
    modelId == "volume_transmitter" ||
    modelId == "gap_junction"
  ) {
    return "synapse";
  }
  return "neuron";
};

const installModule = (moduleName: string = "nestmlmodule") => {
  const nestSimulatorStore = useNESTSimulatorStore();

  nestSimulatorStore
    .axiosInstance()
    .post("/api/Install", { module_name: moduleName })
    .then(fetchModels)
    .catch((error: AxiosError) => {
      if ("response" in error && error.response?.data != undefined) {
        // The request made and the server responded.
        if (typeof error.response.data === "string") {
          notifyError(error.response.data);
        }
      } else if ("request" in error) {
        // The request was made but no response was received.
        notifyError(
          "Failed to perform simulation (Simulator backend is not running)."
        );
      } else if ("message" in error && error.message != undefined) {
        // Something happened in setting up the request
        // that triggered an error.
        notifyError(error.message);
      }
    });
};

const resetKernel = () => {
  const nestSimulatorStore = useNESTSimulatorStore();

  nestSimulatorStore.axiosInstance().get("/api/ResetKernel").then(fetchModels);
};

const simulate = (data: { source: string; return?: string }) => {
  const nestSimulatorStore = useNESTSimulatorStore();

  return nestSimulatorStore.axiosInstance().post("exec", data);
};

export default {
  fetchModels,
  installModule,
  resetKernel,
  simulate,
};
