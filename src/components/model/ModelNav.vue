<template>
  <v-navigation-drawer
    :model-value="navState.state.open"
    :style="{ transition: navState.state.resizing ? 'initial' : '' }"
    :width="navState.state.width"
    @transitionend="dispatchWindowResize()"
    permanent
  >
    <div @mousedown="resizeSidebar" class="resize-handle" />

    <v-toolbar color="transparent" density="compact">
      <v-text-field
        class="mx-1"
        clearable
        density="compact"
        hide-details
        placeholder="Search model"
        prepend-inner-icon="mdi:mdi-magnify"
        v-model="search"
        variant="outlined"
      />

      <v-menu>
        <template #activator="{ props }">
          <v-btn icon="mdi:mdi-dots-vertical" size="small" v-bind="props" />
        </template>

        <v-list density="compact">
          <v-list-item
            :key="index"
            :value="index"
            v-for="(item, index) in menuItems"
          >
            <template #prepend>
              <v-icon :icon="item.icon"></v-icon>
            </template>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>

    <v-list density="compact" lines="two" nav>
      <v-list-item
        :key="index"
        :subtitle="model.elementType"
        :title="model.label"
        :to="{
          name: appStore.state.simulator + 'Model',
          params: { modelId: model.id },
        }"
        v-for="(model, index) in models"
      >
        <template #append>
          <v-btn
            @click.stop="(e: MouseEvent) => e.preventDefault()"
            class="list-item-menu"
            icon="mdi:mdi-dots-vertical"
            size="x-small"
            variant="text"
          />
        </template>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { Store } from "pinia";
import { computed, nextTick, ref } from "vue";

import { TModel } from "@/types";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

import { useNavStore } from "@/stores/navStore";
const navState = useNavStore();

const props = defineProps<{ modelDBStore: Store<any, any> }>();
const models = computed(() =>
  props.modelDBStore.state.models.filter((model: TModel) =>
    model.label.toLocaleLowerCase().includes(search.value.toLocaleLowerCase())
  )
);

const search = ref("");

const menuItems = [
  { title: "Upload", icon: "mdi:mdi-upload" },
  { title: "Download", icon: "mdi:mdi-download" },
  { title: "Reload", icon: "mdi:mdi-reload" },
  { title: "Delete", icon: "mdi:mdi-trash-can-outline" },
];

const dispatchWindowResize = () => {
  nextTick(() => window.dispatchEvent(new Event("resize")));
};

/**
 * Handle mouse move on resizing.
 * @param e MouseEvent from which the x position is taken
 */
const handleMouseMove = (e: MouseEvent) => {
  navState.state.width = e.clientX - 64;
  // window.dispatchEvent(new Event("resize"));
};

/**
 * Handle mouse up on resizing.
 */
const handleMouseUp = () => {
  navState.state.resizing = false;
  window.removeEventListener("mousemove", handleMouseMove);
  window.removeEventListener("mouseup", handleMouseUp);
  // window.dispatchEvent(new Event("resize"));
};

/**
 * Resize sidebar.
 */
const resizeSidebar = () => {
  navState.state.resizing = true;
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
