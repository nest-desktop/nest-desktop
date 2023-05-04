<template>
  <v-navigation-drawer
    :model-value="navState.open"
    :style="{ transition: navState.resizing ? 'initial' : '' }"
    :width="navState.width"
    permanent
  >
    <div @mousedown="resizeSidebar" class="resize-handle" />
    <model-nav />
  </v-navigation-drawer>

  <v-app-bar color="orange" height="48" flat>
    <model-bar />
  </v-app-bar>

  <v-navigation-drawer rail permanent location="right">
    <v-list nav>
      <v-list-item prepend-icon="mdi-view-dashboard" value="dashboard" />
      <v-list-item prepend-icon="mdi-forum" value="messages" />
    </v-list>
  </v-navigation-drawer>

  <v-navigation-drawer permanent open location="right">
    <model-controller />
  </v-navigation-drawer>

  <router-view name="model" />
</template>

<script lang="ts" setup>
import ModelController from "@/layouts/model/ModelController.vue";
import ModelBar from "@/layouts/model/ModelBar.vue";
import ModelNav from "@/layouts/model/ModelNav.vue";

import { useNavStore } from "@/store/navStore";
const navState = useNavStore();

/**
 * Handle mouse move on resizing.
 * @param e MouseEvent from which the x position is taken
 */
const handleMouseMove = (e: MouseEvent) => {
  navState.width = e.clientX - 64;
  // window.dispatchEvent(new Event("resize"));
};

/**
 * Handle mouse up on resizing.
 */
const handleMouseUp = () => {
  navState.resizing = false;
  window.removeEventListener("mousemove", handleMouseMove);
  window.removeEventListener("mouseup", handleMouseUp);
  // window.dispatchEvent(new Event("resize"));
};

/**
 * Resize sidebar.
 */
const resizeSidebar = () => {
  navState.resizing = true;
  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("mouseup", handleMouseUp);
};
</script>

<style scoped>
.resize-handle {
  cursor: ew-resize;
  height: 100%;
  right: 0;
  position: fixed;
  width: 2px;
  z-index: 10;
}
</style>
