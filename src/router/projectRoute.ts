/**
 * router/projectRoute.ts
 *
 * router documentation: https://router.vuejs.org/guide/
 */

import { useProjectStore } from "@/store/projectStore";

const beforeEnter = (to) => {
  const projectStore = useProjectStore();

  projectStore.projectId = to.params.projectId || "";

  const path = to.path.split("/");
  projectStore.view = path[path.length - 1] || "edit";
};

const redirect = (to) => {
  const projectStore = useProjectStore();

  if (to.params.projectId) {
    projectStore.projectId = to.params.projectId;
  }
  console.log(to.path)

  return { path: "/project/" + projectStore.projectId + "/" + projectStore.view };
};

export default [
  {
    path: "project/",
    component: () => import("@/layouts/project/ProjectLayout.vue"),
    children: [
      {
        path: "",
        name: "Project",
        component: () => import("@/views/project/ProjectView.vue"),
        redirect,
      },
      {
        path: ":projectId/",
        children: [
          {
            path: "",
            name: "ProjectId",
            props: true,
            redirect,
          },
          {
            path: "edit",
            name: "NetworkEditor",
            components: {
              project: () => import("@/views/project/NetworkEditor.vue"),
            },
            props: true,
            beforeEnter,
          },
          {
            path: "explore",
            name: "ActivityExplorer",
            components: {
              project: () => import("@/views/project/ActivityExplorer.vue"),
            },
            props: true,
            beforeEnter,
          },
          {
            path: "lab",
            name: "LabBook",
            components: {
              project: () => import("@/views/project/LabBook.vue"),
            },
            props: true,
            beforeEnter,
          },
        ],
      },
    ],
  },
];
