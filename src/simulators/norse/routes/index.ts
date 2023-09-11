/**
 * router/index.ts
 *
 * router documentation: https://router.vuejs.org/guide/
 */

// Composables
import { RouteRecordRaw } from "vue-router";

import { useAppStore } from "@/store/appStore";
import { useNavStore } from "@/store/navStore";

import modelRoutes from "./modelRoutes";
import projectRoutes from "./projectRoutes";

const closeNav = () => {
  const navStore = useNavStore();
  navStore.open = false;
};

export default {
  path: "norse",
  name: "norseLayout",
  beforeEnter: () => {
    const appStore = useAppStore();
    appStore.simulator = "norse";
  },
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
