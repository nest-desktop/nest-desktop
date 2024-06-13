// index.ts

import { RouteRecordRaw } from "vue-router";

import { logger as mainLogger } from "@/helpers/common/logger";
import { useAppStore } from "@/stores/appStore";
import { useNavStore } from "@/stores/navStore";

import modelRoutes from "./modelRoutes";
import projectRoutes from "./projectRoutes";

const logger = mainLogger.getSubLogger({
  minLevel: 3,
  name: "nest route",
});

export default {
  path: "nest",
  name: "nestLayout",
  beforeEnter: () => {
    logger.trace("before enter main layout");

    const appStore = useAppStore();
    appStore.state.simulator = "nest";
  },
  component: () => import("../layouts/MainLayout.vue"),
  children: [
    {
      path: "",
      name: "nestHome",
      component: () => import("../views/Home.vue"),
      beforeEnter: () => {
        logger.trace("before enter home");

        const navStore = useNavStore();
        navStore.state.open = false;
      },
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
