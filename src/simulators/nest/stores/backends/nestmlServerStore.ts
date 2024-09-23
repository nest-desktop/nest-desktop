// nestmlServerStore.ts

import { AxiosError, AxiosResponse } from "axios";

import { defineBackendStore } from "@/stores/defineBackendStore";
import { notifyError, notifySuccess } from "@/utils/notification";

export const useNESTMLServerStore = defineBackendStore(
  "nest",
  "nestml",
  "http://localhost:52426"
);

export const generateModels = (
  module: {
    models: { name: string; script: string }[];
    name: string;
  } = {
    models: [],
    name: "nestmlmodule",
  }
): Promise<void> => {
  const nestmlServerStore = useNESTMLServerStore();

  return nestmlServerStore
    .axiosInstance()
    .post("/generateModels", {
      module_name: module.name,
      models: module.models,
    })
    .then((response: AxiosResponse) => {
      switch (response.status) {
        case 200:
          notifySuccess(
            `Models (${response.data.status["INSTALLED"].join(
              ","
            )}) are successfully generated in "${module.name}" module.`
          );
          break;
        case 400:
          notifyError("Failed to generate model.");
          break;
      }
    })
    .catch((error: AxiosError) => {
      notifyError((error.response?.data || error.message) as string);
    });
};

export const fetchNESTMLModels = (
  moduleName: string
): Promise<AxiosResponse> => {
  const nestmlServerStore = useNESTMLServerStore();
  return nestmlServerStore
    .axiosInstance()
    .get(`/module/${moduleName}/installed`);
};
