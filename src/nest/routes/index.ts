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
    name: "modelParent",
    component: () => import("../layouts/model/ModelLayout.vue"),
    children: modelRoutes as RouteRecordRaw[],
  },
  {
    path: "project/",
    name: "projectParent",
    component: () => import("../layouts/project/ProjectLayout.vue"),
    children: projectRoutes as RouteRecordRaw[],
  },
];

