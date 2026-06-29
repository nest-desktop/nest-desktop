/**
 * router
 *
 * router documentation: https://router.vuejs.org/guide/
 */

import { type RouteRecordRaw, createRouter, createWebHashHistory } from "vue-router";

import { closeNav } from "@/nav";
import { logger as mainLogger } from "@/utils";
import { useAppStore } from "@/app";

const logger = mainLogger.getSubLogger({ name: "app route" });

const routes: RouteRecordRaw[] = [
  {
    path: "",
    name: "appLayout",
    beforeEnter: () => {
      logger.trace("before enter app layout");

      const appStore = useAppStore();
      if (!appStore.hasWorkspace) appStore.resetWorkspace();
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
    ],
  },
];

export default createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});
