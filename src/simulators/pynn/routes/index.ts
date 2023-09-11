/**
 * index.ts
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
  path: "pynn",
  name: "pynnLayout",
  beforeEnter: () => {
    const appStore = useAppStore();
    appStore.simulator = "pynn";
  },
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
  ],
};
