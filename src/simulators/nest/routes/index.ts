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
      name: "NESTHome",
      component: () => import("@nest/views/NESTHome.vue"),
      beforeEnter: closeNav,
    },
    {
      path: "model/",
      name: "NESTModelLayout",
      component: () => import("@nest/layouts/model/ModelLayout.vue"),
      children: modelRoutes as RouteRecordRaw[],
    },
    {
      path: "project/",
      name: "NESTProjectLayout",
      component: () => import("@nest/layouts/project/ProjectLayout.vue"),
      children: projectRoutes as RouteRecordRaw[],
    },
  ],
};

