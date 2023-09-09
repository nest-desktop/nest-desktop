// index.ts

import { useNESTModelDBStore } from "./store/model/nestModelDBStore";
import { useNESTModelStore } from "./store/model/nestModelStore";
import { useNESTProjectDBStore } from "./store/project/nestProjectDBStore";
import { useNESTProjectStore } from "./store/project/nestProjectStore";
import { useNESTSessionStore } from "./store/nestSessionStore";

export default {
  install() {
    const nestSessionStore = useNESTSessionStore();
    const modelDBStore = useNESTModelDBStore();
    const modelStore = useNESTModelStore();
    const projectDBStore = useNESTProjectDBStore();
    const projectStore = useNESTProjectStore();

    Promise.all([modelDBStore.init(), projectDBStore.init()]).then(() => {
      if (modelDBStore.models.length > 0) {
        const firstModel = modelDBStore.models[0];
        modelStore.modelId = firstModel.id;
      }
      if (projectDBStore.projects.length > 0) {
        const firstProject = projectDBStore.projects[0];
        projectStore.project = firstProject;
        projectStore.projectId = firstProject.id;
      }
      nestSessionStore.loading = false;
    });
  },
};
