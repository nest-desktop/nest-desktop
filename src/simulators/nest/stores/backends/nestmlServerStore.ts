// nestmlServerStore.ts

import { AxiosError, AxiosResponse } from "axios";

import { defineBackendStore } from "@/stores/defineBackendStore";
import { notifyError, notifySuccess } from "@/utils/dialog";

export const useNESTMLServerStore = defineBackendStore(
  "nest",
  "nestml",
  "http://localhost:52426"
);

const generateModels = (
  models: string[],
  moduleName: string = "nestmlmodule"
) => {
  const nestmlServerStore = useNESTMLServerStore();

  nestmlServerStore
    .axiosInstance()
    .post("/generateModels", {
      module_name: moduleName,
      models: models,
    })
    .then((response: AxiosResponse) => {
      switch (response.status) {
        case 200:
          notifySuccess(
            `Models (${response.data.status["INSTALLED"].join(
              ","
            )}) are successfully generated in "${moduleName}" module.`
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

export default {
  generateModels,
};
