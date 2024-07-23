// nestmlServerStore.ts

import { AxiosError, AxiosResponse } from "axios";

import { defineBackendStore } from "@/stores/defineBackendStore";
import { notifyError, notifySuccess } from "@/utils/dialog";

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
) => {
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
      notifyError(error.message);
    });
};

export const fetchNESTMLModels = (moduleName: string) => {
  const nestmlServerStore = useNESTMLServerStore();
  return nestmlServerStore
    .axiosInstance()
    .get(`/module/${moduleName}/installed`);
};
