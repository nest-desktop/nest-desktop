/**
 * router/index.ts
 *
 * router documentation: https://router.vuejs.org/guide/
 */

// Composables
import { RouteRecordRaw } from "vue-router";

import { useAppStore } from "@/store/appStore";
import { useNavStore } from "@/store/navStore";

import modelRoutes from "./modelRoute";
import projectRoutes from "./projectRoute";

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
      name: "NorseHome",
      component: () => import("@norse/views/NorseHome.vue"),
      beforeEnter: closeNav,
    },
    {
      path: "model",
      name: "NorseModelLayout",
      component: () => import("@norse/layouts/model/ModelLayout.vue"),
      children: modelRoutes as RouteRecordRaw[],
    },
    {
      path: "project",
      name: "NorseProjectLayout",
      component: () => import("@norse/layouts/project/ProjectLayout.vue"),
      children: projectRoutes as RouteRecordRaw[],
    },
  ],
};
