// routes.ts

import { closeNav } from "@/nav";
import { defineCodeGraphRoute } from "@/codeGraph/routes/codeGraphRoutes";
import { setCurrentWorkspace } from "@/app";

import modelRoutes from "./model/modelRoutes";
import projectRoutes from "./project/projectRoutes";

export default {
  path: "nest",
  name: "nestLayout",
  beforeEnter: () => setCurrentWorkspace("nest"),
  component: () => import("./layouts/MainLayout.vue"),
  children: [
    {
      path: "",
      name: "nestHome",
      component: () => import("./views/Home.vue"),
      beforeEnter: closeNav,
    },
    {
      path: "model",
      name: "nestModelLayout",
      component: () => import("./layouts/ModelLayout.vue"),
      children: modelRoutes,
    },
    {
      path: "project",
      name: "nestProjectLayout",
      component: () => import("./layouts/ProjectLayout.vue"),
      children: projectRoutes,
    },
    {
      path: "code",
      name: "nestCodeGraphLayout",
      component: () => import("@/codeGraph/layouts/CodeGraphLayout.vue"),
      children: defineCodeGraphRoute("nest"),
    },
  ],
};
