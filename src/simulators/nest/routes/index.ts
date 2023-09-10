/**
 * router/index.ts
 *
 * router documentation: https://router.vuejs.org/guide/
 */

// Composables
import { RouteRecordRaw } from "vue-router";

import { useAppStore } from "@/store/appStore";
import { useNavStore } from "@/store/navStore";

import modelRoutes from "./nestModelRoutes";
import projectRoutes from "./nestProjectRoutes";

const closeNav = () => {
  const navStore = useNavStore();
  navStore.open = false;
};

export default {
  path: "nest",
  name: "nestLayout",
  beforeEnter: () => {
    const appStore = useAppStore();
    appStore.simulator = "nest";
  },
  component: () => import("../layouts/NESTLayout.vue"),
  children: [
    {
      path: "",
      name: "nestHome",
      component: () => import("../views/NESTHome.vue"),
      beforeEnter: closeNav,
    },
    {
      path: "model/",
      name: "nestModelLayout",
      component: () => import("../layouts/NESTModelLayout.vue"),
      children: modelRoutes as RouteRecordRaw[],
    },
    {
      path: "project/",
      name: "nestProjectLayout",
      component: () => import("../layouts/NESTProjectLayout.vue"),
      children: projectRoutes as RouteRecordRaw[],
    },
  ],
};
