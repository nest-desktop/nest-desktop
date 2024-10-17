// insiteAccessStore.ts

import { AxiosResponse } from "axios";

import { defineBackendStore } from "@/stores/defineBackendStore";
import { TStore } from "@/types";

export const useInsiteAccessStore = defineBackendStore(
  "nest",
  "insite",
  "http://localhost:52056"
);

const getMultimeterAttribute = (
  recorderUnitId: number,
  attribute: string,
  query?: { fromTime?: number }
): Promise<AxiosResponse> => {
  const insiteAccessStore = useInsiteAccessStore();

  let path = `nest/multimeters/${recorderUnitId}/attributes/${attribute}/`;
  if (query) {
    path +=
      "?" +
      Object.entries(
        (queryKey: string, queryValue: string) => queryKey + "=" + queryValue
      ).join("&");
  }

  return insiteAccessStore.axiosInstance().get(path);
};

const getMultimeters = (): Promise<AxiosResponse> => {
  const insiteAccessStore = useInsiteAccessStore();
  return insiteAccessStore.axiosInstance().get("nest/multimeters/");
};

const getNodes = (): Promise<AxiosResponse> => {
  const insiteAccessStore = useInsiteAccessStore();
  return insiteAccessStore.axiosInstance().get("nest/nodes/");
};

const getSimulationTimeInfo = (): Promise<AxiosResponse> => {
  const insiteAccessStore = useInsiteAccessStore();
  return insiteAccessStore.axiosInstance().get("nest/simulationTimeInfo/");
};

const getSpikes = (query?: {
  fromTime?: number;
  skip?: number;
  spikedetectorId?: number;
  top?: number;
}): Promise<AxiosResponse> => {
  const insiteAccessStore = useInsiteAccessStore();

  let path = "nest/spikes/";
  if (query) {
    path +=
      "?" +
      Object.entries(
        (queryKey: string, queryValue: string) => queryKey + "=" + queryValue
      ).join("&");
  }

  return insiteAccessStore.axiosInstance().get(path);
};

const getSpikeRecorders = (): Promise<AxiosResponse> => {
  const insiteAccessStore = useInsiteAccessStore();
  return insiteAccessStore.axiosInstance().get("nest/spikerecorders/");
};

export const insiteAccessInit = (): TStore => {
  // Initialize backend Insite Access.
  const insiteAccessStore: TStore = useInsiteAccessStore();
  insiteAccessStore.init();
  return insiteAccessStore;
};

export default {
  getMultimeterAttribute,
  getMultimeters,
  getNodes,
  getSimulationTimeInfo,
  getSpikeRecorders,
  getSpikes,
};
