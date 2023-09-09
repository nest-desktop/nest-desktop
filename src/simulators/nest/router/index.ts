/**
 * router/index.ts
 *
 * router documentation: https://router.vuejs.org/guide/
 */

// Composables
import { RouteRecordRaw } from "vue-router";

import { useAppStore } from "@/store/appStore";
import { useNavStore } from "@/store/navStore";

import modelRoutes from "./nestModelRoute";
import projectRoutes from "./nestProjectRoute";

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
  component: () => import("@nest/layouts/NESTLayout.vue"),
  children: [
    {
      path: "",
      name: "nestHome",
      component: () => import("@nest/views/NESTHome.vue"),
      beforeEnter: closeNav,
    },
    {
      path: "model/",
      name: "nestModelLayout",
      component: () => import("@nest/layouts/NESTModelLayout.vue"),
      children: modelRoutes as RouteRecordRaw[],
    },
    {
      path: "project/",
      name: "nestProjectLayout",
      component: () => import("@nest/layouts/NESTProjectLayout.vue"),
      children: projectRoutes as RouteRecordRaw[],
    },
  ],
};
