/**
 * router/nestProjectRoute.ts
 *
 * router documentation: https://router.vuejs.org/guide/
 */

import { computed, watch } from "vue";

import { logger as mainLogger } from "@/helpers/common/logger";
import { truncate } from "@/utils/truncate";

import { useNESTProjectStore } from "../store/project/projectStore";
import { useNESTSessionStore } from "../store/sessionStore";

const logger = mainLogger.getSubLogger({
  name: "nest project route",
});

const projectBeforeEnter = (to: any) => {
  logger.trace("before enter:", to.path);

  const nestSessionStore = useNESTSessionStore();
  const projectStore = useNESTProjectStore();

  if (to.params.projectId) {
    const loading = computed(() => nestSessionStore.loading);
    watch(loading, (state) => {
      if (!state) {
        projectStore.loadProject(to.params.projectId);
      }
    });
  }

  const path = to.path.split("/");
  projectStore.view = path[path.length - 1] || "edit";
  logger.trace("enter:", to.path);
};

const projectNew = () => {
  logger.trace("create a new nest project");
  const projectStore = useNESTProjectStore();
  projectStore.loadProject();

  return {
    path: "/nest/project/" + projectStore.projectId + "/" + projectStore.view,
  };
};

const projectRedirect = (to: any) => {
  logger.trace("Redirect to project:", truncate(to.params.projectId));

  const projectStore = useNESTProjectStore();

  if (to.params.projectId) {
    projectStore.loadProject(to.params.projectId);
  }

  return {
    path: "/nest/project/" + projectStore.projectId + "/" + projectStore.view,
  };
};

export default [
  {
    path: "",
    name: "nestProjectRoot",
    redirect: projectRedirect,
  },
  {
    path: "new",
    name: "nestProjectNew",
    redirect: projectNew,
  },
  {
    path: ":projectId/",
    redirect: projectRedirect,
    children: [
      {
        path: "",
        name: "nestProject",
        props: true,
        redirect: projectRedirect,
      },
      {
        path: "edit",
        name: "nestNetworkEditor",
        components: {
          project: () =>
            import("../views/ProjectNetworkEditor.vue"),
        },
        props: true,
        beforeEnter: projectBeforeEnter,
      },
      {
        path: "explore",
        name: "nestActivityExplorer",
        components: {
          project: () => import("../views/ProjectActivityExplorer.vue"),
        },
        props: true,
        beforeEnter: projectBeforeEnter,
      },
      {
        path: "lab",
        name: "nestLabBook",
        components: {
          project: () => import("../views/ProjectLabBook.vue"),
        },
        props: true,
        beforeEnter: projectBeforeEnter,
      },
    ],
  },
];
