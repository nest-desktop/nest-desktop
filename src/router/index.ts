/**
 * router/index.ts
 *
 * router documentation: https://router.vuejs.org/guide/
 */

// Composables
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import nestRoutes from "@nest/routes";

import { useNavStore } from "@/store/navStore";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("@/layouts/app/AppLayout.vue"),
    children: [
      {
        path: "",
        name: "AppInfo",
        component: () => import("@/views/AppInfo.vue"),
        props: {
          includeProjectButtons: true,
        },
        beforeEnter: () => {
          const navStore = useNavStore();
          navStore.open = false;
        },
      },
      {
        path: "about",
        name: "Home",
        component: () => import("@/views/AppInfo.vue"),
        props: {
          includeProjectButtons: false,
        },
        beforeEnter: () => {
          const navStore = useNavStore();
          navStore.open = false;
        },
      },
      {
        path: "sandbox/",
        name: "sandboxParent",
        children: [
          {
            path: "",
            name: "Sandbox",
            component: () => import("@/views/Sandbox.vue"),
          },
          {
            path: ":component",
            name: "SandboxComponent",
            props: true,
            component: () => import("@/views/Sandbox.vue"),
          },
        ],
      },
      {
        path: "vuetify",
        name: "vuetify",
        component: () => import("@/views/Vuetify.vue"),
      },
      {
        path: "nest/",
        name: "nest",
        children: nestRoutes as RouteRecordRaw[],
      },
    ],
  },
];

export default createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});
