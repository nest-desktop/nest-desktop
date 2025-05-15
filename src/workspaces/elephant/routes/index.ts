// index.ts

import { RouteRecordRaw } from "vue-router";

import { setCurrentWorkspace } from "@/stores/appStore";
import { closeNav } from "@/stores/navStore";

import modelRoutes from "./modelRoutes";
import projectRoutes from "./projectRoutes";

export default {
  path: "elephant",
  name: "elephantLayout",
  beforeEnter: () => setCurrentWorkspace("elephant"),
  component: () => import("../layouts/MainLayout.vue"),
  children: [
    {
      path: "",
      name: "elephantHome",
      component: () => import("../views/Home.vue"),
      beforeEnter: closeNav,
    },
    {
      path: "model",
      name: "elephantModelLayout",
      component: () => import("../layouts/ModelLayout.vue"),
      children: modelRoutes as RouteRecordRaw[],
    },
    {
      path: "project",
      name: "elephantProjectLayout",
      component: () => import("../layouts/ProjectLayout.vue"),
      children: projectRoutes as RouteRecordRaw[],
    },
  ],
};
