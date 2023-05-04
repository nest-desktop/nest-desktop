/**
 * router/projectRoute.ts
 *
 * router documentation: https://router.vuejs.org/guide/
 */

import { useProjectStore } from "@/store/projectStore";

const projectBeforeEnter = (to: any) => {
  const projectStore = useProjectStore();

  projectStore.projectId = to.params.projectId || "";

  const path = to.path.split("/");
  projectStore.view = path[path.length - 1] || "edit";
};

const projectRedirect = (to: any) => {
  const projectStore = useProjectStore();

  if (to.params.projectId) {
    projectStore.projectId = to.params.projectId;
  }
  console.log(to.path);

  return {
    path: "/project/" + projectStore.projectId + "/" + projectStore.view,
  };
};

export default [
  {
    path: "",
    name: "Project",
    component: () => import("@/views/project/ProjectView.vue"),
    redirect: projectRedirect,
  },
  {
    path: ":projectId/",
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
          project: () => import("@/views/project/NetworkEditor.vue"),
        },
        props: true,
        beforeEnter: projectBeforeEnter,
      },
      {
        path: "explore",
        name: "ActivityExplorer",
        components: {
          project: () => import("@/views/project/ActivityExplorer.vue"),
        },
        props: true,
        beforeEnter: projectBeforeEnter,
      },
      {
        path: "lab",
        name: "LabBook",
        components: {
          project: () => import("@/views/project/LabBook.vue"),
        },
        props: true,
        beforeEnter: projectBeforeEnter,
      },
    ],
  },
];
