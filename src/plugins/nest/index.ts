import { useModelDBStore } from "./store/model/modelDBStore";
import { useProjectDBStore } from "./store/project/projectDBStore";

import { useModelStore } from "./store/model/modelStore";
import { useProjectStore } from "./store/project/projectStore";

export default {
  install() {
    // configure the app
    const modelDBStore = useModelDBStore();
    modelDBStore.init().then(() => {
      if (modelDBStore.models.length > 0) {
        const modelStore = useModelStore();
        const firstModel = modelDBStore.models[0]
        modelStore.modelId = firstModel.id;
      }
    });

    const projectDBStore = useProjectDBStore();
    projectDBStore.init().then(() => {
      if (projectDBStore.projects.length > 0) {
        const projectStore = useProjectStore();
        const firstProject = projectDBStore.projects[0]
        projectStore.projectId = firstProject._id;
      }
    });
  },
};
