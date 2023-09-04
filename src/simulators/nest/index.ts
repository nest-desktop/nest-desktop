// index.ts

import { useNESTModelDBStore } from "./store/model/nestModelDBStore";
import { useNESTProjectDBStore } from "./store/project/nestProjectDBStore";

import { useNESTModelStore } from "./store/model/nestModelStore";
import { useNESTProjectStore } from "./store/project/nestProjectStore";

export default {
  install() {
    // configure the app
    const modelDBStore = useNESTModelDBStore();
    modelDBStore.init().then(() => {
      if (modelDBStore.models.length > 0) {
        const modelStore = useNESTModelStore();
        const firstModel = modelDBStore.models[0]
        modelStore.modelId = firstModel.id;
      }
    });

    const projectDBStore = useNESTProjectDBStore();
    projectDBStore.init().then(() => {
      if (projectDBStore.projects.length > 0) {
        const projectStore = useNESTProjectStore();
        const firstProject = projectDBStore.projects[0]
        projectStore.projectId = firstProject._id;
      }
    });
  },
};
