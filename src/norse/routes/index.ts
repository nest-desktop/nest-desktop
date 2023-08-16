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
    name: "NorseModelParent",
    component: () => import("@norse/layouts/model/ModelLayout.vue"),
    children: modelRoutes as RouteRecordRaw[],
  },
  {
    path: "project/",
    name: "NorseProjectParent",
    component: () => import("@norse/layouts/project/ProjectLayout.vue"),
    children: projectRoutes as RouteRecordRaw[],
  },
];

