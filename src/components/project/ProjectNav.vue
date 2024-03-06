<template>
  <v-navigation-drawer
    :modelValue="navStore.state.open"
    :style="{ transition: navStore.state.resizing ? 'initial' : '' }"
    :width="navStore.state.width"
    class="d-print-none"
    permanent
  >
    <div @mousedown="resizeSideNav()" class="resize-handle" />

    <v-toolbar class="project-nav" color="transparent" density="compact">
      <v-text-field
        class="mx-1"
        clearable
        density="compact"
        hideDetails
        placeholder="Search project"
        prependInnerIcon="mdi-magnify"
        singleLine
        v-model="search"
        variant="outlined"
      />

      <v-btn
        :to="{ name: appStore.state.simulator + 'ProjectNew' }"
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
            v-for="(item, index) in projectsMenuItems"
          >
            <template #prepend>
              <v-icon :icon="item.icon" />
            </template>

            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>

    <v-list :key="projects.length" density="compact" lines="two" nav>
      <v-list-item
        :key="index"
        :to="{
          name: appStore.state.simulator + 'Project',
          params: { projectId: project.id },
        }"
        v-for="(project, index) in projects"
      >
        <template #append>
          <template v-if="project.doc">
            <v-btn
              @click.prevent="saveProject(project)"
              :disabled="!project.state?.changes && !project.state?.editMode"
              :icon="
                project.state?.changes
                  ? 'mdi-content-save-edit-outline'
                  : 'mdi-content-save-check-outline'
              "
              size="x-small"
              variant="text"
            />
            <project-menu :project :projectDBStore />
          </template>

          <template v-else>
            <v-menu>
              <template #activator="{ props }">
                <v-btn
                  @click.prevent
                  class="list-item-menu"
                  icon="mdi-dots-vertical"
                  size="x-small"
                  v-bind="props"
                  variant="text"
                />
              </template>

              <v-list density="compact">
                <v-list-item @click="projectDBStore.deleteProject(project)">
                  <template #prepend>
                    <v-icon icon="mdi-trash-can-outline" />
                  </template>
                  <v-list-item-title>Delete</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>
        </template>

        <template #default v-if="project.state?.editMode">
          <v-text-field
            @click.prevent
            @update:modelValue="project.state.state.changes = true"
            class="pt-2"
            density="compact"
            hideDetails
            label="Project name"
            v-model="project.name"
            variant="outlined"
            autofocused
          />
        </template>

        <template #default v-else-if="appStore.session.devMode">
          <v-list-item-title>
            {{ project.name }}
          </v-list-item-title>
          <v-list-item-subtitle>
            <span class="mx-1" v-if="project.id">
              {{ truncate(project.id) }}
            </span>
            <span class="mx-1" v-if="project.doc">
              {{ truncate(project.docId) }}
            </span>
          </v-list-item-subtitle>
        </template>

        <template #default v-else>
          <v-list-item-title>
            {{ project.name }}
          </v-list-item-title>
          <v-list-item-subtitle>
            {{ project.network.nodes.length }} nodes,
            {{ project.network.connections.length }}
            connections
          </v-list-item-subtitle>
        </template>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

import { Project } from "@/types/projectTypes";

import ProjectMenu from "./ProjectMenu.vue";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

import { useNavStore } from "@/stores/navStore";
const navStore = useNavStore();

const props = defineProps({
  projectDBStore: { required: true, type: Object },
});

const projectDBStore = computed(() => props.projectDBStore);

const search = ref("");

const projects = computed(() =>
  props.projectDBStore.projects.filter((project: Project) =>
    project.name.toLocaleLowerCase().includes(search.value.toLocaleLowerCase())
  )
);

const projectsMenuItems = [
  { title: "Upload", icon: "mdi-upload" },
  { title: "Download", icon: "mdi-download" },
  { title: "Delete", icon: "mdi-trash-can-outline" },
  { title: "Reload list", icon: "mdi-reload" },
  { title: "Reset database", icon: "mdi-database-sync-outline" },
];

const dispatchWindowResize = () => {
  window.dispatchEvent(new Event("resize"));
};

/**
 * Handle mouse move on resizing.
 * @param e MouseEvent from which the x position is taken
 */
const handleSideNavMouseMove = (e: MouseEvent) => {
  navStore.state.width = e.clientX - 64;
  // window.dispatchEvent(new Event("resize"));
};

/**
 * Handle mouse up on resizing.
 */
const handleSideNavMouseUp = () => {
  navStore.state.resizing = false;
  window.removeEventListener("mousemove", handleSideNavMouseMove);
  window.removeEventListener("mouseup", handleSideNavMouseUp);
  dispatchWindowResize();
};

/**
 * Resize side nav.
 */
const resizeSideNav = () => {
  navStore.state.resizing = true;
  window.addEventListener("mousemove", handleSideNavMouseMove);
  window.addEventListener("mouseup", handleSideNavMouseUp);
};

/**
 * Save project.
 */
const saveProject = (project: Project) => {
  project.state.state.editMode = false;
  projectDBStore.value.saveProject(project.id);
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
