/**
 * router/index.ts
 *
 * router documentation: https://router.vuejs.org/guide/
 */

// Composables
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

import modelRoutes from "./modelRoute";
import projectRoutes from "./projectRoute";

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
        beforeEnter: () => {
          const navStore = useNavStore();
          navStore.open = false;
        },
      },
      {
        path: "vuetify",
        name: "Home",
        component: () => import("@/views/Home.vue"),
      },
      {
        path: "model/",
        component: () => import("@/layouts/model/ModelLayout.vue"),
        children: modelRoutes as RouteRecordRaw[],
      },
      {
        path: "project/",
        component: () => import("@/layouts/project/ProjectLayout.vue"),
        children: projectRoutes as RouteRecordRaw[],
      },
    ],
  },
];

export default createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});
