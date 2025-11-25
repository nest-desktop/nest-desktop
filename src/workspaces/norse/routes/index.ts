// index.ts

import { type RouteRecordRaw } from "vue-router";

import { closeNav } from "@/stores/navStore";
import { defineCodeGraphRoute } from "@/codeGraph/routes/codeGraphRoutes";
import { setCurrentWorkspace } from "@/stores/appStore";

import modelRoutes from "./modelRoutes";
import projectRoutes from "./projectRoutes";

export default {
  path: "norse",
  name: "norseLayout",
  beforeEnter: () => setCurrentWorkspace("norse"),
  component: () => import("../layouts/MainLayout.vue"),
  children: [
    {
      path: "",
      name: "norseHome",
      component: () => import("../views/Home.vue"),
      beforeEnter: closeNav,
    },
    {
      path: "model/",
      name: "norseModelLayout",
      component: () => import("../layouts/ModelLayout.vue"),
      children: modelRoutes as RouteRecordRaw[],
    },
    {
      path: "project/",
      name: "norseProjectLayout",
      component: () => import("../layouts/ProjectLayout.vue"),
      children: projectRoutes as RouteRecordRaw[],
    },
    {
      path: "code/",
      name: "norseCodeGraphLayout",
      component: () => import("@/codeGraph/layouts/CodeGraphLayout.vue"),
      children: defineCodeGraphRoute("norse") as RouteRecordRaw[],
    },
  ],
};
