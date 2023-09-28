<template>
  <v-navigation-drawer
    :model-value="navStore.open"
    :style="{ transition: navStore.resizing ? 'initial' : '' }"
    :width="navStore.width"
    permanent
  >
    <div @mousedown="resizeSidebar" class="resize-handle" />

    <project-nav />
  </v-navigation-drawer>

  <v-app-bar color="project" height="48" flat>
    <project-bar />
  </v-app-bar>

  <v-navigation-drawer rail permanent location="right">
    <v-list nav>
      <v-list-item prepend-icon="mdi-view-dashboard" value="dashboard" />
      <v-list-item prepend-icon="mdi-forum" value="messages" />
    </v-list>
  </v-navigation-drawer>

  <v-navigation-drawer permanent open location="right">
    <project-controller />
  </v-navigation-drawer>

  <router-view name="project" />
</template>

<script lang="ts" setup>
import ProjectBar from "@/layouts/project/ProjectBar.vue";
import ProjectController from "@/layouts/project/ProjectController.vue";
import ProjectNav from "@/layouts/project/ProjectNav.vue";

import { useNavStore } from "@/store/navStore";

const navStore = useNavStore();

/**
 * Handle mouse move on resizing.
 * @param e MouseEvent from which the x position is taken
 */
const handleMouseMove = (e: MouseEvent) => {
  navStore.width = e.clientX - 64;
  // window.dispatchEvent(new Event("resize"));
};

/**
 * Handle mouse up on resizing.
 */
const handleMouseUp = () => {
  navStore.resizing = false;
  window.removeEventListener("mousemove", handleMouseMove);
  window.removeEventListener("mouseup", handleMouseUp);
  // window.dispatchEvent(new Event("resize"));
};

/**
 * Resize sidebar.
 */
const resizeSidebar = () => {
  navStore.resizing = true;
  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("mouseup", handleMouseUp);
};
</script>

<style scoped>
.resize-handle {
  background-color: steelblue;
  cursor: ew-resize;
  height: 100%;
  right: 0;
  position: fixed;
  width: 4px;
  z-index: 10;
}
</style>
