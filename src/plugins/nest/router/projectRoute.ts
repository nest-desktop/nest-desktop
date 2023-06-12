/**
 * router/projectRoute.ts
 *
 * router documentation: https://router.vuejs.org/guide/
 */

import { useProjectDBStore } from "../store/projectDBStore";
import { useProjectStore } from "../store/projectStore";

const projectBeforeEnter = (to: any) => {
  // console.log("Before enter routes for project:", to.params);

  const projectDBStore = useProjectDBStore();
  if (projectDBStore.projects.length === 0) {
    setTimeout(() => projectBeforeEnter(to), 100);
    return;
  }

  const projectStore = useProjectStore();
  projectStore.loadProject(to.params.projectId);

  const path = to.path.split("/");
  projectStore.view = path[path.length - 1] || "edit";
};

const projectRedirect = (to: any) => {
  // console.log("Redirect path for project:", to.params);
  const projectStore = useProjectStore();

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
    name: "Project",
    redirect: projectRedirect,
  },
  {
    path: ":projectId/",
    redirect: projectRedirect,
    children: [
      {
        path: "",
        name: "ProjectId",
        props: true,
        redirect: projectRedirect,
      },
      {
        path: "edit",
        name: "NetworkEditor",
        components: {
          project: () => import("../views/project/NetworkEditor.vue"),
        },
        props: true,
        beforeEnter: projectBeforeEnter,
      },
      {
        path: "explore",
        name: "ActivityExplorer",
        components: {
          project: () => import("../views/project/ActivityExplorer.vue"),
        },
        props: true,
        beforeEnter: projectBeforeEnter,
      },
      {
        path: "lab",
        name: "LabBook",
        components: {
          project: () => import("../views/project/LabBook.vue"),
        },
        props: true,
        beforeEnter: projectBeforeEnter,
      },
    ],
  },
];
