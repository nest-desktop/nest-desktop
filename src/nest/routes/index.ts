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
    path: "model/",
    name: "NESTModelParent",
    component: () => import("@nest/layouts/model/ModelLayout.vue"),
    children: modelRoutes as RouteRecordRaw[],
  },
  {
    path: "project/",
    name: "NESTProjectParent",
    component: () => import("@nest/layouts/project/ProjectLayout.vue"),
    children: projectRoutes as RouteRecordRaw[],
  },
];

