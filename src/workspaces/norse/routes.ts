// routes.ts

import { closeNav } from "@/nav";
import { defineCodeGraphRoute } from "@/codeGraph/routes/codeGraphRoutes";
import { setCurrentWorkspace } from "@/app";

import modelRoutes from "./model/modelRoutes";
import projectRoutes from "./project/projectRoutes";

export default {
  path: "norse",
  name: "norseLayout",
  beforeEnter: () => setCurrentWorkspace("norse"),
  component: () => import("./layouts/MainLayout.vue"),
  children: [
    {
      path: "",
      name: "norseHome",
      component: () => import("./views/Home.vue"),
      beforeEnter: closeNav,
    },
    {
      path: "model",
      name: "norseModelLayout",
      component: () => import("./layouts/ModelLayout.vue"),
      children: modelRoutes,
    },
    {
      path: "project",
      name: "norseProjectLayout",
      component: () => import("./layouts/ProjectLayout.vue"),
      children: projectRoutes,
    },
    {
      path: "code",
      name: "norseCodeGraphLayout",
      component: () => import("@/codeGraph/layouts/CodeGraphLayout.vue"),
      children: defineCodeGraphRoute("norse"),
    },
  ],
};
