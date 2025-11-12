// index.ts

import type { RouteRecordRaw } from "vue-router";

import { setCurrentWorkspace } from "@/stores/appStore";
import { closeNav } from "@/stores/navStore";

import modelRoutes from "./modelRoutes";
import projectRoutes from "./projectRoutes";
import codeGraphRoutes from "@/codeGraph/routes/codeGraphRoutes";

export default {
  path: "nest/",
  name: "nestLayout",
  beforeEnter: () => setCurrentWorkspace("nest"),
  component: () => import("../layouts/MainLayout.vue"),
  children: [
    {
      path: "",
      name: "nestHome",
      component: () => import("../views/Home.vue"),
      beforeEnter: closeNav,
    },
    {
      path: "model/",
      name: "nestModelLayout",
      component: () => import("../layouts/ModelLayout.vue"),
      children: modelRoutes as RouteRecordRaw[],
    },
    {
      path: "project/",
      name: "nestProjectLayout",
      component: () => import("../layouts/ProjectLayout.vue"),
      children: projectRoutes as RouteRecordRaw[],
    },
    {
      path: "code/",
      name: "nestCodeGraphLayout",
      component: () => import("@/codeGraph/layouts/CodeGraphLayout.vue"),
      children: codeGraphRoutes as RouteRecordRaw[],
    },
  ],
};
