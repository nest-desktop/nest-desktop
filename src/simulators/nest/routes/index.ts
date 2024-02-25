// index.ts

import { RouteRecordRaw } from "vue-router";

import { useAppStore } from "@/stores/appStore";
import { useNavStore } from "@/stores/navStore";

import modelRoutes from "./modelRoutes";
import projectRoutes from "./projectRoutes";

const closeNav = () => {
  const navStore = useNavStore();
  navStore.state.open = false;
};

export default {
  path: "nest",
  name: "nestLayout",
  beforeEnter: () => {
    const appStore = useAppStore();
    appStore.state.simulator = "nest";
  },
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
