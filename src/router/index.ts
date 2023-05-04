/**
 * router/index.ts
 *
 * router documentation: https://router.vuejs.org/guide/
 */

// Composables
import { createRouter, createWebHashHistory } from "vue-router";

import modelRoutes from "./modelRoute";
import projectRoutes from "./projectRoute";

import { useNavStore } from "@/store/navStore";

const routes = [
  {
    path: "/",
    component: () => import("@/layouts/app/AppLayout.vue"),
    children: [
      {
        path: "",
        name: "AppInfo",
        component: () => import("@/views/AppInfo.vue"),
        beforeEntry: () => {
          const navStore = useNavStore;
          navStore.open = false;
        }
      },
      {
        path: "vuetify",
        name: "Home",
        component: () => import("@/views/Home.vue"),
      },
      ...modelRoutes,
      ...projectRoutes,
    ],
  },
];

export default createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});
