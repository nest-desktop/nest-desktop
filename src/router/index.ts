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
import nestRoute from "@nest/routes";
import norseRoute from "@norse/routes";

const closeNav = () => {
  const navStore = useNavStore();
  navStore.open = false;
};

const routes: RouteRecordRaw[] = [
  {
    path: "/",
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
      nestRoute,
      norseRoute,
      {
        path: "pynn",
        name: "pynn",
        beforeEnter: () => {
          const appStore = useAppStore();
          appStore.simulator = "pynn";
        },
        component: () => import("@/components/HelloWorld.vue"),
      },
    ],
  },
];

export default createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});
