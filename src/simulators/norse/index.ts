// index.ts

import { useNorseModelDBStore } from "./store/model/norseModelDBStore";
import { useNorseModelStore } from "./store/model/norseModelStore";
import { useNorseProjectDBStore } from "./store/project/norseProjectDBStore";
import { useNorseProjectStore } from "./store/project/norseProjectStore";
import { useNorseSessionStore } from "./store/norseSessionStore";

export default {
  install() {
    const norseSessionStore = useNorseSessionStore();
    const modelDBStore = useNorseModelDBStore();
    const modelStore = useNorseModelStore();
    const projectDBStore = useNorseProjectDBStore();
    const projectStore = useNorseProjectStore();

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
      norseSessionStore.loading = false;
    });
  },
};
