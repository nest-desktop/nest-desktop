/**
 * router/index.ts
 *
 * router documentation: https://router.vuejs.org/guide/
 */

// Composables
import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";

// Store
import { useAppStore } from "@/store/appStore";
import { useNavStore } from "@/store/navStore";

// Simulators
import nestRoutes from "@nest/routes";
import norseRoutes from "@norse/routes";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    component: () => import("@/layouts/app/AppLayout.vue"),
    children: [
      {
        path: "",
        name: "Home",
        component: () => import("@/views/Home.vue"),
        beforeEnter: () => {
          const navStore = useNavStore();
          navStore.open = false;
        },
      },
      {
        path: "about",
        name: "About",
        component: () => import("@/views/About.vue"),
        props: {
          includeProjectButtons: false,
        },
        beforeEnter: () => {
          const navStore = useNavStore();
          navStore.open = false;
        },
      },
      {
        path: "sandbox",
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
        path: "nest",
        name: "nest",
        beforeEnter: () => {
          const appStore = useAppStore();
          appStore.simulator = 'nest';
        },
        children: nestRoutes as RouteRecordRaw[],
      },
      {
        path: "norse",
        name: "norse",
        beforeEnter: () => {
          const appStore = useAppStore();
          appStore.simulator = 'norse';
        },
        children: norseRoutes as RouteRecordRaw[],
      },
    ],
  },
];

export default createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});
