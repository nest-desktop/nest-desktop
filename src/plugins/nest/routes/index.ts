/**
 * router/index.ts
 *
 * router documentation: https://router.vuejs.org/guide/
 */

// Composables
import { RouteRecordRaw } from "vue-router";

import modelRoutes from "./modelRoute";
import projectRoutes from "./projectRoute";

export default [
  {
    path: "",
    name: "NESTHome",
    component: () => import("@nest/layouts/NESTHome.vue"),
  },
  {
    path: "model/",
    name: "NESTModelLayout",
    component: () => import("@nest/layouts/model/ModelLayout.vue"),
    children: modelRoutes as RouteRecordRaw[],
  },
  {
    path: "project/",
    name: "NESTProjectLayout",
    component: () => import("@nest/layouts/project/ProjectLayout.vue"),
    children: projectRoutes as RouteRecordRaw[],
  },
];

