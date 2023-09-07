// index.ts

import { useNorseModelDBStore } from "./store/model/norseModelDBStore";
import { useNorseProjectDBStore } from "./store/project/norseProjectDBStore";

import { useNorseModelStore } from "./store/model/norseModelStore";
import { useNorseProjectStore } from "./store/project/norseProjectStore";

export default {
  install() {
    // configure the app
    const modelDBStore = useNorseModelDBStore();
    modelDBStore.init().then(() => {
      if (modelDBStore.models.length > 0) {
        const modelStore = useNorseModelStore();
        const firstModel = modelDBStore.models[0]
        modelStore.modelId = firstModel.id;
      }
    });

    const projectDBStore = useNorseProjectDBStore();
    projectDBStore.init().then(() => {
      if (projectDBStore.projects.length > 0) {
        const projectStore = useNorseProjectStore();
        const firstProject = projectDBStore.projects[0]
        projectStore.projectId = firstProject._id;
      }
    });
  },
};
