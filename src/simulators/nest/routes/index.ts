// index.ts

import { RouteRecordRaw } from "vue-router";

import { setCurrentSimulator } from "@/stores/appStore";
import { closeNav } from "@/stores/navStore";

import modelRoutes from "./modelRoutes";
import projectRoutes from "./projectRoutes";

export default {
  path: "nest",
  name: "nestLayout",
  beforeEnter: () => setCurrentSimulator("nest"),
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
  ],
};
