// nestSimulatorStore.ts

import { AxiosError, AxiosPromise, AxiosResponse } from "axios";

import { defineBackendStore, IAxiosResponseData } from "@/stores/defineBackendStore";
import { notifyError } from "@/helpers/common/notification";
import { sortString } from "@/utils/array";

import { useNESTModelStore } from "../model/modelStore";

export const useNESTSimulatorStore = defineBackendStore("nest", "nest", "http://localhost:52425", {
  axiosHeaderTokenValue: "NESTServerAuth",
});

const fetchModels = (): void => {
  const modelStore = useNESTModelStore();
  const nestSimulatorStore = useNESTSimulatorStore();

  nestSimulatorStore
    .axiosInstance()
    .post("/api/GetKernelStatus", { keys: ["node_models", "synapse_models"] })
    .then((response: AxiosResponse) => {
      if (response.data) {
        const models = [...response.data[0], ...response.data[1]];
        models.sort((a: string, b: string) => sortString(a, b));

        modelStore.state.models = models.map((modelId: string) => ({
          id: modelId,
          label: modelId,
          elementType: getElementType(modelId),
        }));
      }
    });
};

const getElementType = (modelId: string): string => {
  if (modelId.includes("_generator") || modelId.includes("_dilutor")) {
    return "stimulator";
  } else if (modelId.endsWith("meter") || modelId.includes("_detector") || modelId.includes("_recorder")) {
    return "recorder";
  } else if (
    (modelId.includes("_synapse") ||
      modelId.includes("_connection") ||
      modelId.includes("rate_") ||
      modelId == "volume_transmitter" ||
      modelId == "gap_junction") &&
    !modelId.includes("_neuron")
  ) {
    return "synapse";
  }
  return "neuron";
};

const installModule = (moduleName?: string): void => {
  const nestSimulatorStore = useNESTSimulatorStore();

  nestSimulatorStore
    .axiosInstance()
    .get("/api/ResetKernel")
    .then(() => {
      if (moduleName) {
        nestSimulatorStore
          .axiosInstance()
          .post("/api/Install", { module_name: moduleName })
          .catch((error: AxiosError) => {
            if ("response" in error && error.response?.data != undefined) {
              // The request made and the server responded.
              if (typeof error.response.data === "string") {
                notifyError(error.response.data);
              }
            } else if ("request" in error) {
              // The request was made but no response was received.
              notifyError("Failed to perform simulation (Simulator backend is not running).");
            } else if ("message" in error && error.message != undefined) {
              // Something happened in setting up the request
              // that triggered an error.
              notifyError(error.message);
            }
          })
          .finally(fetchModels);
      } else {
        fetchModels();
      }
    });
};

export const nestSimulatorInit = () => {
  // Initialize backend NEST Simulator.
  const nestSimulatorStore = useNESTSimulatorStore();
  nestSimulatorStore.init();
  return nestSimulatorStore;
};

const resetKernel = (): void => {
  const nestSimulatorStore = useNESTSimulatorStore();
  nestSimulatorStore.axiosInstance().get("/api/ResetKernel").then(fetchModels);
};

const exec = (source: string, responseKeys: string | string[] = "response"): AxiosPromise<IAxiosResponseData> => {
  const nestSimulatorStore = useNESTSimulatorStore();
  return nestSimulatorStore
    .axiosInstance()
    .post<IAxiosResponseData>("exec", { source, response_keys: responseKeys, return: responseKeys });
};

export default {
  exec,
  fetchModels,
  installModule,
  resetKernel,
};
