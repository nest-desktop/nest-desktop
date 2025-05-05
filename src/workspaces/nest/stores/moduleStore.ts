// moduleStore.ts

import { AxiosResponse } from "axios";
import { defineStore } from "pinia";
import { reactive } from "vue";
import { createDialog } from "vuetify3-dialog";

import NESTModuleDialog from "../components/dialog/NESTModuleDialog.vue";
import { fetchNESTMLModels, generateModels, useNESTMLServerStore } from "./backends/nestmlServerStore";
import { useNESTModelDBStore } from "./model/modelDBStore";
import type { NESTModel } from "../types";

export interface IModule {
  models: string[];
  name: string;
}

interface IModuleStoreState {
  installedModels: string[];
  modules: IModule[];
}

export const useNESTModuleStore = defineStore(
  "nest-module-store",
  () => {
    const state = reactive<IModuleStoreState>({
      installedModels: [],
      modules: [
        { models: [], name: "nestmlmodule" },
        // { models: [], name: "insitemodule" },
      ],
    });

    const addModule = (moduleName: string) => {
      if (typeof moduleName === "string" && moduleName.length > 0 && moduleName.trim()) {
        const moduleNames = state.modules.map((module: IModule) => module.name);
        if (!moduleNames.includes(moduleName)) {
          state.modules.push({ models: [], name: moduleName });
        }
      }
    };

    const clean = (moduleName: string) => {
      const modelDBStore = useNESTModelDBStore();
      const module = findModule(moduleName);
      module.models = module.models.filter((modelId: string) => modelDBStore.hasModel(modelId));
    };

    const fetchInstalledModels = (moduleName: string = "nestmlmodule") => {
      clean(moduleName);

      state.installedModels = [];
      fetchNESTMLModels(moduleName)
        .then((response: AxiosResponse) => {
          state.installedModels = response.data;
        })
        .catch(() => {});
    };

    const findModule = (moduleName: string) => state.modules.find((module: IModule) => module.name === moduleName);

    const init = () => {
      const nestmlServerStore = useNESTMLServerStore();
      if (nestmlServerStore.state.enabled) fetchInstalledModels();
    };

    const moduleNames = () => state.modules.map((module: IModule) => module.name);

    const removeModule = (module: string) => {
      const moduleIds = state.modules.map((module: IModule) => module.name);
      const index = moduleIds.indexOf(module);
      state.modules.splice(index, 1);
    };

    return {
      addModule,
      fetchInstalledModels,
      findModule,
      init,
      moduleNames,
      removeModule,
      state,
    };
  },
  {
    persist: [
      {
        pick: ["state.modules"],
        storage: localStorage,
      },
    ],
  },
);

export const openNESTModuleDialog = (): void => {
  createDialog({
    customComponent: {
      component: NESTModuleDialog,
      props: {},
    },
    dialogOptions: {
      width: "420px",
    },
    text: "",
    title: "",
  }).then((answer: IModule | string | undefined) => {
    if (answer) {
      const module = answer as IModule;
      const modelDBStore = useNESTModelDBStore();

      module.models = module.models.filter((modelId: string) => modelDBStore.hasModel(modelId));

      const models = module.models.map((modelId: string) => {
        const model = modelDBStore.findModel(modelId) as NESTModel;
        return {
          element_type: model.elementType,
          name: model.id,
          script: model.nestmlScript,
        };
      });

      generateModels({ models, name: module.name }).finally(() => {
        const moduleStore = useNESTModuleStore();
        moduleStore.fetchInstalledModels();
      });
    }
  });
};
