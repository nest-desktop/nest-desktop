/**
 * router/index.ts
 *
 * router documentation: https://router.vuejs.org/guide/
 */

// Composables
import { RouteRecordRaw } from "vue-router";

import { useAppStore } from "@/store/appStore";
import { useNavStore } from "@/store/navStore";

import modelRoutes from "./norseModelRoutes";
import projectRoutes from "./norseProjectRoutes";

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
  component: () => import("../layouts/NorseLayout.vue"),
  children: [
    {
      path: "",
      name: "norseHome",
      component: () => import("../views/NorseHome.vue"),
      beforeEnter: closeNav,
    },
    {
      path: "model",
      name: "norseModelLayout",
      component: () => import("../layouts/NorseModelLayout.vue"),
      children: modelRoutes as RouteRecordRaw[],
    },
    {
      path: "project",
      name: "norseProjectLayout",
      component: () => import("../layouts/NorseProjectLayout.vue"),
      children: projectRoutes as RouteRecordRaw[],
    },
  ],
};
