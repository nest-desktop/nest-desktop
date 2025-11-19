// index.ts

import { RouteRecordRaw } from "vue-router";

import codeGraphRoutes from "@/codeGraph/routes/codeGraphRoutes";
import { closeNav } from "@/stores/navStore";
import { setCurrentWorkspace } from "@/stores/appStore";

import modelRoutes from "./modelRoutes";
import projectRoutes from "./projectRoutes";

export default {
  path: "pynn",
  name: "pynnLayout",
  beforeEnter: () => setCurrentWorkspace("pynn"),
  component: () => import("../layouts/MainLayout.vue"),
  children: [
    {
      path: "",
      name: "pynnHome",
      component: () => import("../views/Home.vue"),
      beforeEnter: closeNav,
    },
    {
      path: "model",
      name: "pynnModelLayout",
      component: () => import("../layouts/ModelLayout.vue"),
      children: modelRoutes as RouteRecordRaw[],
    },
    {
      path: "project",
      name: "pynnProjectLayout",
      component: () => import("../layouts/ProjectLayout.vue"),
      children: projectRoutes as RouteRecordRaw[],
    },
    {
      path: "code/",
      name: "pynnCodeGraphLayout",
      component: () => import("@/codeGraph/layouts/CodeGraphLayout.vue"),
      children: codeGraphRoutes as RouteRecordRaw[],
    },
  ],
};
