/**
 * router/index.ts
 *
 * router documentation: https://router.vuejs.org/guide/
 */

import { RouteRecordRaw, createRouter, createWebHashHistory } from "vue-router";

// Store
import { useAppStore } from "@/stores/appStore";
import { useNavStore } from "@/stores/navStore";
import { logger as mainLogger } from "@/utils/logger";

const logger = mainLogger.getSubLogger({ name: "app route" });

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
      if (!appStore.hasWorkspace) {
        appStore.resetWorkspace();
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
