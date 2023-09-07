<template>
  <v-navigation-drawer
    :model-value="navStore.open"
    :style="{ transition: navStore.resizing ? 'initial' : '' }"
    :width="navStore.width"
    @update:modelValue="dispatchWindowResize"
    class="d-print-none"
    permanent
  >
    <div @mousedown="resizeSideNav" class="resize-handle" />

    <v-toolbar class="project-nav" color="transparent" density="compact">
      <v-text-field
        class="mx-1"
        clearable
        density="compact"
        hide-details
        placeholder="Search project"
        prepend-inner-icon="mdi-magnify"
        single-line
        variant="outlined"
      />

      <v-btn
        :to="{ name: appStore.simulator + 'ProjectNew' }"
        icon
        size="small"
        title="Create a new project"
      >
        <v-icon icon="mdi-plus" />
      </v-btn>

      <v-menu>
        <template #activator="{ props }">
          <v-btn icon="mdi-dots-vertical" size="small" v-bind="props" />
        </template>

        <v-list density="compact">
          <v-list-item
            :key="index"
            :value="index"
            v-for="(item, index) in projectsItems"
          >
            <template #prepend>
              <v-icon :icon="item.icon" />
            </template>

            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>

    <v-list density="compact" lines="two" nav>
      <v-list-item
        :key="index"
        :subtitle="`${project.network.nodes.length} nodes, ${project.network.connections.length} connections`"
        :title="project.name"
        :to="{
          name: appStore.simulator + 'Project',
          params: { projectId: project.id || project._id },
        }"
        v-for="(project, index) in projects"
      >
        <template #append>
          <v-btn
            @click="(e: MouseEvent) => {
            e.preventDefault()
            project.save()
            }"
            :disabled="!project.state?.changes"
            icon="mdi-content-save-check-outline"
            size="small"
            variant="text"
            v-show="project.doc"
          />

          <v-menu>
            <template #activator="{ props }">
              <v-btn
                @click="(e: MouseEvent) => e.preventDefault()"
                class="list-item-menu"
                icon="mdi-dots-vertical"
                size="x-small"
                v-bind="props"
                variant="text"
              />
            </template>

            <v-list density="compact">
              <v-list-item
                v-for="(item, index) in projectItems"
                :key="index"
                :value="index"
              >
                <template #prepend>
                  <v-icon :icon="item.icon" />
                </template>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </template>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { computed } from "vue";

// import { Project } from "@/types/projectTypes";

import { useAppStore } from "@/store/appStore";
const appStore = useAppStore();

import { useNavStore } from "@/store/navStore";
const navStore = useNavStore();

const props = defineProps({
  store: {required: true, type: Object},
});

const projects = computed(() => props.store.projects);

const projectsItems = [
  { title: "Upload", icon: "mdi-upload" },
  { title: "Download", icon: "mdi-download" },
  { title: "Delete", icon: "mdi-trash-can-outline" },
  { title: "Reload list", icon: "mdi-reload" },
  { title: "Reset database", icon: "mdi-database-sync-outline" },
];

const projectItems = [
  { title: "Rename", icon: "mdi-pencil" },
  { title: "Save", icon: "mdi-content-save-outline" },
  { title: "Upload", icon: "mdi-upload" },
  { title: "Download", icon: "mdi-download" },
  { title: "Delete", icon: "mdi-trash-can-outline" },
];

/**
 * Handle mouse move on resizing.
 * @param e MouseEvent from which the x possition is taken
 */
const handleSideNavMouseMove = (e: MouseEvent) => {
  navStore.width = e.clientX - 64;
  // window.dispatchEvent(new Event("resize"));
};

/**
 * Handle mouse up on resizing.
 */
const handleSideNavMouseUp = () => {
  navStore.resizing = false;
  window.removeEventListener("mousemove", handleSideNavMouseMove);
  window.removeEventListener("mouseup", handleSideNavMouseUp);
  // window.dispatchEvent(new Event("resize"));
};

/**
 * Resize side nav.
 */
const resizeSideNav = () => {
  navStore.resizing = true;
  window.addEventListener("mousemove", handleSideNavMouseMove);
  window.addEventListener("mouseup", handleSideNavMouseUp);
};

const dispatchWindowResize = () => {
  window.dispatchEvent(new Event("resize"));
};
</script>

<style lang="scss">
.resize-handle {
  position: fixed;
  z-index: 10;
  cursor: ew-resize;
  height: 100%;
  width: 4px;
  right: 0;
}
</style>
