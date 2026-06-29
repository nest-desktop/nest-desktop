// routes.ts

import { closeNav } from "@/nav";
import { defineCodeGraphRoute } from "@/codeGraph/routes/codeGraphRoutes";
import { setCurrentWorkspace } from "@/app";

import modelRoutes from "./model/modelRoutes";
import projectRoutes from "./project/projectRoutes";

export default {
  path: "pynn",
  name: "pynnLayout",
  beforeEnter: () => setCurrentWorkspace("pynn"),
  component: () => import("./layouts/MainLayout.vue"),
  children: [
    {
      path: "",
      name: "pynnHome",
      component: () => import("./views/Home.vue"),
      beforeEnter: closeNav,
    },
    {
      path: "model",
      name: "pynnModelLayout",
      component: () => import("./layouts/ModelLayout.vue"),
      children: modelRoutes,
    },
    {
      path: "project",
      name: "pynnProjectLayout",
      component: () => import("./layouts/ProjectLayout.vue"),
      children: projectRoutes,
    },
    {
      path: "code",
      name: "pynnCodeGraphLayout",
      component: () => import("@/codeGraph/layouts/CodeGraphLayout.vue"),
      children: defineCodeGraphRoute("pynn"),
    },
  ],
};
