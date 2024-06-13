/**
 * router/index.ts
 *
 * router documentation: https://router.vuejs.org/guide/
 */

import { RouteRecordRaw, createRouter, createWebHashHistory } from "vue-router";

import { logger as mainLogger } from "@/helpers/common/logger";
// Store
import { useAppStore } from "@/stores/appStore";
import { useNavStore } from "@/stores/navStore";

const logger = mainLogger.getSubLogger({
  minLevel: 3,
  name: "app route",
});

const closeNav = () => {
  const navStore = useNavStore();
  navStore.state.open = false;
};

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "appLayout",
    beforeEnter: () => {
      logger.trace("before enter app layout");

      const appStore = useAppStore();
      if (!appStore.hasSimulator) {
        appStore.resetSimulator();
      }
    },
    component: () => import("@/layouts/AppLayout.vue"),
    children: [
      {
        path: "",
        name: "home",
        component: () => import("@/views/Home.vue"),
        beforeEnter: closeNav,
      },
      {
        path: "about",
        name: "about",
        component: () => import("@/views/About.vue"),
        beforeEnter: closeNav,
      },
      {
        path: "sandbox",
        name: "sandbox",
        children: [
          {
            path: "",
            name: "SandboxRoot",
            component: () => import("@/views/Sandbox.vue"),
          },
          {
            path: ":component",
            name: "sandboxComponent",
            props: true,
            component: () => import("@/views/Sandbox.vue"),
          },
        ],
      },
      {
        path: "settings",
        name: "settings",
        component: () => import("@/views/Settings.vue"),
        beforeEnter: closeNav,
      },
    ],
  },
];

export default createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});
