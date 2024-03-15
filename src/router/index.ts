/**
 * router/index.ts
 *
 * router documentation: https://router.vuejs.org/guide/
 */

import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

// Store
import { useAppStore } from "@/stores/appStore";
import { useNavStore } from "@/stores/navStore";

const checkSimulator = () => {
  const appStore = useAppStore();
  if (!appStore.hasSimulator) {
    appStore.resetSimulator();
  }
};

const closeNav = () => {
  const navStore = useNavStore();
  navStore.state.open = false;
};

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "appLayout",
    beforeEnter: checkSimulator,
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
