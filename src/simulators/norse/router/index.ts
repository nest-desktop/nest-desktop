/**
 * router/index.ts
 *
 * router documentation: https://router.vuejs.org/guide/
 */

// Composables
import { RouteRecordRaw } from "vue-router";

import { useAppStore } from "@/store/appStore";
import { useNavStore } from "@/store/navStore";

import modelRoutes from "./norseModelRoute";
import projectRoutes from "./norseProjectRoute";

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
  component: () => import("@norse/layouts/NorseLayout.vue"),
  children: [
    {
      path: "",
      name: "norseHome",
      component: () => import("@norse/views/NorseHome.vue"),
      beforeEnter: closeNav,
    },
    {
      path: "model",
      name: "norseModelLayout",
      component: () => import("@norse/layouts/NorseModelLayout.vue"),
      children: modelRoutes as RouteRecordRaw[],
    },
    {
      path: "project",
      name: "norseProjectLayout",
      component: () => import("@norse/layouts/NorseProjectLayout.vue"),
      children: projectRoutes as RouteRecordRaw[],
    },
  ],
};
