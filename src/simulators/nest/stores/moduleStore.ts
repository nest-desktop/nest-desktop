// moduleStore.ts

import { AxiosResponse } from "axios";
import { Store, defineStore } from "pinia";
import { reactive } from "vue";
import { createDialog } from "vuetify3-dialog";

import NESTModuleDialog from "../components/dialog/NESTModuleDialog.vue";
import {
  fetchNESTMLModels,
  generateModels,
} from "./backends/nestmlServerStore";
import { useNESTModelDBStore } from "./model/modelDBStore";

export interface IModule {
  models: string[];
  name: string;
}

interface IModuleStoreState {
  installedModels: string[];
  modules: IModule[];
}

export type TModuleStore = Store<string, any>;

export const useNESTModuleStore: TModuleStore = defineStore(
  "module-store",
  () => {
    const state = reactive<IModuleStoreState>({
      installedModels: [],
      modules: [
        { models: [], name: "nestmlmodule" },
        { models: [], name: "insitemodule" },
      ],
    });

    const addModule = (moduleName: string) => {
      if (
        typeof moduleName === "string" &&
        moduleName.length > 0 &&
        moduleName.trim()
      ) {
        const moduleNames = state.modules.map((module: IModule) => module.name);
        if (!moduleNames.includes(moduleName)) {
          state.modules.push({ models: [], name: moduleName });
        }
      }
    };

    const fetchInstalledModels = (moduleName: string = "nestmlmodule") => {
      state.installedModels = [];
      fetchNESTMLModels(moduleName)
        .then((response: AxiosResponse) => {
          state.installedModels = response.data;
        })
        .catch(() => {});
    };

    const findModule = (moduleName: string) =>
      state.modules.find((module: IModule) => module.name === moduleName);

    const init = () => {
      fetchInstalledModels();
    };

    const moduleNames = () =>
      state.modules.map((module: IModule) => module.name);

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
  }
);

export const openNESTModuleDialog = (): void => {
  createDialog({
    title: "",
    text: "",
    customComponent: {
      component: NESTModuleDialog,
      props: {},
    },
    dialogOptions: {
      width: "420px",
    },
  }).then((answer: IModule | string | undefined) => {
    if (answer) {
      const module = answer as IModule;

      const modelDBStore = useNESTModelDBStore();

      const models = module.models
        .filter((modelId: string) => modelDBStore.hasModel(modelId))
        .map((modelId: string) => {
          const model = modelDBStore.findModel(modelId);
          return {
            name: model.id + "_" + model.elementType,
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
