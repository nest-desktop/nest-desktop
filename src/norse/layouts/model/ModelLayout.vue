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

  <v-navigation-drawer location="right" permanent rail rail-width="64">
    <v-tabs
      :model-value="modelStore.controllerView"
      :mandatory="false"
      color="primary"
      direction="vertical"
      stacked
      width="64"
    >
      <v-tab
        :key="index"
        :value="modelStore.controllerOpen ? item.id : null"
        @click.stop="modelStore.toggle(item)"
        class="justify-center"
        height="72"
        minWidth="0"
        v-for="(item, index) in items"
      >
        <v-icon :icon="item.icon" class="ma-1" size="large" />
        <span style="font-size: 9px"> {{ item.id }}</span>
      </v-tab>
    </v-tabs>
  </v-navigation-drawer>

  <v-navigation-drawer
    :model-value="modelStore.controllerOpen"
    permanent
    location="right"
  >
    <model-controller />
  </v-navigation-drawer>

  <router-view name="model" />
</template>

<script lang="ts" setup>
import ModelController from "./ModelController.vue";
import ModelBar from "./ModelBar.vue";
import ModelNav from "./ModelNav.vue";

import { useNavStore } from "@/store/navStore";
import { useModelStore } from "@norse/store/model/modelStore";

const navState = useNavStore();
const modelStore = useModelStore();

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

const items = [
  { id: "defaults", icon: "mdi-format-list-numbered-rtl", title: "View defaults" },
  { id: "model", icon: "mdi-tune-variant", title: "Edit model" },
  { id: "code", icon: "mdi-xml" },
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
