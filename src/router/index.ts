/**
 * router/index.ts
 *
 * router documentation: https://router.vuejs.org/guide/
 */

// Composables
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

// Store
import { useNavStore } from "@/store/navStore";

const closeNav = () => {
  const navStore = useNavStore();
  navStore.open = false;
};

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "appLayout",
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
        path: "vuetify",
        name: "vuetify",
        component: () => import("@/views/Vuetify.vue"),
      },
    ],
  },
];

export default createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});
