// index.ts

import { RouteRecordRaw } from "vue-router";

import { setCurrentSimulator } from "@/stores/appStore";
import { closeNav } from "@/stores/navStore";

import modelRoutes from "./modelRoutes";
import projectRoutes from "./projectRoutes";

export default {
  path: "norse",
  name: "norseLayout",
  beforeEnter: () => setCurrentSimulator("norse"),
  component: () => import("../layouts/MainLayout.vue"),
  children: [
    {
      path: "",
      name: "norseHome",
      component: () => import("../views/Home.vue"),
      beforeEnter: closeNav,
    },
    {
      path: "model",
      name: "norseModelLayout",
      component: () => import("../layouts/ModelLayout.vue"),
      children: modelRoutes as RouteRecordRaw[],
    },
    {
      path: "project",
      name: "norseProjectLayout",
      component: () => import("../layouts/ProjectLayout.vue"),
      children: projectRoutes as RouteRecordRaw[],
    },
  ],
};
