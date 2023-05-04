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

  <v-app-bar color="blue" height="48" flat>
    <project-bar />
  </v-app-bar>

  <v-navigation-drawer location="right" permanent rail rail-width="64">
    <v-tabs
      :mandatory="false"
      :model-value="projectStore.controllerView"
      color="primary"
      direction="vertical"
      stacked
      width="64"
    >
      <v-tab
        :key="index"
        :value="item.id"
        @click.stop="projectStore.toggle(item)"
        class="justify-center"
        height="72"
        minWidth="0"
        v-for="(item, index) in items"
      >
        <v-icon :icon="item.icon" class="ma-1" size="large" />
        <span style="font-size: 9px"> {{ item.id }}</span>
      </v-tab>
    </v-tabs>

    <!-- <v-list nav>
      <v-list-item
        :key="index"
        @click.stop="projectStore.toggle(item)"
        :prepend-icon="item.icon"
        :value="item.id"
        v-for="(item, index) in items"
      />
    </v-list> -->
  </v-navigation-drawer>

  <v-navigation-drawer
    :model-value="projectStore.controllerOpen"
    location="right"
    permanent
  >
    <project-controller />
  </v-navigation-drawer>

  <router-view name="project" />
</template>

<script lang="ts" setup>
import ProjectBar from "@/layouts/project/ProjectBar.vue";
import ProjectController from "@/layouts/project/ProjectController.vue";
import ProjectNav from "@/layouts/project/ProjectNav.vue";

import { useNavStore } from "@/store/navStore";
import { useProjectStore } from "@/store/projectStore";

const navStore = useNavStore();
const projectStore = useProjectStore();

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

const items = [
  { id: "network", icon: "nest:networkIcon", title: "Edit network" },
  { id: "kernel", icon: "mdi-engine-outline", title: "Edit kernel" },
  { id: "code", icon: "mdi-xml" },
  { id: "activity", icon: "mdi-border-style" },
  { id: "stats", icon: "mdi-table-large" },
];
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
