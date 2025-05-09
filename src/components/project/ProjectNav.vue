<template>
  <v-navigation-drawer
    :model-value="navStore.state.open"
    :style="{ transition: navStore.state.resizing ? 'initial' : '' }"
    :width="navStore.state.width"
    class="d-print-none"
    permanent
    @transitionend="navStore.dispatchWindowResize()"
  >
    <div class="resize-handle" @mousedown="navStore.resizeSideNav()" />

    <v-toolbar :color class="fixed-bar" density="compact" extended extension-height="36">
      <v-text-field
        v-model="search"
        class="mx-1"
        clearable
        density="compact"
        hide-details
        placeholder="Search project"
        prepend-inner-icon="mdi:mdi-magnify"
        single-line
      />

      <template #extension>
        <v-fab
          class="ms-4"
          color="primary"
          icon="mdi:mdi-plus"
          location="bottom left"
          size="40"
          absolute
          offset
          title="Create a new project"
          @click="newProjectRoute(router)"
        />

        <v-row class="mx-4 text-subtitle-2" no-gutters>
          <v-spacer />

          {{ projects.length }} project
          <span v-show="projects.length > 1">s</span>
        </v-row>
      </template>

      <Menu :items />

      <!-- <v-menu>
        <template #activator="{ props }">
          <v-btn icon="mdi:mdi-dots-vertical" size="small" v-bind="props" />
        </template>

        <v-list density="compact">
          <v-list-item
            :key="index"
            v-bind="item"
            v-for="(item, index) in menuItems"
          />
        </v-list>
      </v-menu> -->
    </v-toolbar>

    <v-list :key="projects.length" class="pt-0" density="compact" lines="two" nav>
      <v-list-subheader inset />

      <template
        v-if="
          projectStore.state.project && !projectStore.state.project.docId && projectStore.state.project.state?.editMode
        "
      >
        <v-text-field
          v-model="projectStore.state.project.name"
          append-inner-icon="mdi:mdi-content-save-edit-outline"
          autofocused
          class="pb-1"
          density="compact"
          hide-details
          label="Project name"
          @click:append-inner="saveProject(projectStore.state.project)"
        />
      </template>

      <template v-for="(project, index) in projects.slice().reverse()" :key="index">
        <v-hover v-slot="{ isHovering, props: itemProps }">
          <v-list-item
            :to="{
              name: appStore.state.currentWorkspace + 'Project',
              params: { projectId: project.id },
            }"
            :ripple="!project.state?.editMode"
            v-bind="itemProps"
          >
            <template v-if="!project.state?.editMode" #append>
              <template v-if="project.doc">
                <v-btn
                  :disabled="!project.state?.changes"
                  :color="project.state?.changes ? 'orange' : 'primary'"
                  :icon="project.state?.changes ? 'mdi:mdi-content-save-outline' : 'mdi:mdi-check'"
                  size="x-small"
                  variant="text"
                  @click.prevent="saveProject(project)"
                />
              </template>

              <ProjectMenu :color="isHovering ? 'primary' : 'transparent'" :project />
            </template>

            <template v-if="project.state?.editMode" #default>
              <v-text-field
                v-model="project.name"
                append-inner-icon="mdi:mdi-content-save-edit-outline"
                autofocused
                class="pt-2"
                density="compact"
                hide-details
                label="Project name"
                @click.prevent
                @click:append-inner="saveProject(project)"
                @update:model-value="project.state.state.changes = true"
              />
            </template>

            <template v-else-if="appStore.state.devMode" #default>
              <v-list-item-title>
                {{ project.name || "undefined project " + truncate(project.id) }}
              </v-list-item-title>
              <v-list-item-subtitle>
                <span v-if="project.id" class="mx-1">
                  {{ truncate(project.id) }}
                </span>
                <span v-if="project.doc" class="mx-1">
                  {{ truncate(project.docId) }}
                </span>
              </v-list-item-subtitle>
            </template>

            <template v-else #default>
              <v-list-item-title>
                {{ project.name || "undefined project " + truncate(project.id) }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ project.network.nodes.length }} nodes, {{ project.network.connections.length }} connections
              </v-list-item-subtitle>
            </template>
          </v-list-item>
        </v-hover>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { createDialog } from "vuetify3-dialog";

import { TProject } from "@/types";
import { newProjectRoute } from "@/helpers/routes";

import { truncate } from "@/utils/truncate";

import DeleteDialog from "../dialog/DeleteDialog.vue";
import ExportDialog from "../dialog/ExportDialog.vue";
import ImportDialog from "../dialog/ImportDialog.vue";
import Menu from "../common/Menu.vue";
import ProjectMenu from "./ProjectMenu.vue";

import { useRouter } from "vue-router";
const router = useRouter();

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

import { useNavStore } from "@/stores/navStore";
const navStore = useNavStore();

defineProps<{ color: string }>();

const projectStore = computed(() => appStore.currentWorkspace.stores.projectStore);

const projectDBStore = computed(() => appStore.currentWorkspace.stores.projectDBStore);

const projects = computed(() =>
  projectDBStore.value.state.projects.filter((project: TProject) =>
    project.name.toLocaleLowerCase().includes(search.value ? search.value.toLocaleLowerCase() : ""),
  ),
);

const search = ref("");

const items = [
  {
    onClick: () => {
      createDialog({
        customComponent: {
          component: ImportDialog,
          props: {},
        },
        dialogOptions: {
          width: "1280px",
        },
        text: "",
        title: "",
      });
    },
    prependIcon: "mdi:mdi-import",
    title: "Import",
  },
  {
    onClick: () => {
      createDialog({
        customComponent: {
          component: ExportDialog,
          props: {},
        },
        dialogOptions: {
          width: "1280px",
        },
        text: "",
        title: "",
      });
    },
    prependIcon: "mdi:mdi-export",
    title: "Export",
  },
  {
    onClick: () => {
      createDialog({
        customComponent: {
          component: DeleteDialog,
          props: {
            store: projectDBStore.value,
          },
        },
        dialogOptions: {
          width: "1280px",
        },
        text: "",
        title: "",
      });
    },
    prependIcon: "mdi:mdi-trash-can-outline",
    title: "Delete",
  },
  {
    onClick: () => projectDBStore.value.updateList(),
    prependIcon: "mdi:mdi-reload",
    title: "Reload list",
  },
  // { title: "Reset database", icon: "mdi:mdi-database-sync-outline" },
];

/**
 * Save project.
 */
const saveProject = (project: TProject) => {
  projectDBStore.value.saveProject(project);
  project.state.state.editMode = false;
};
</script>

<style lang="scss" scoped>
.fixed-bar {
  position: sticky;
  position: -webkit-sticky; /* for Safari */
  top: 0em;
  z-index: 2;
}

.resize-handle {
  position: fixed;
  z-index: 10;
  cursor: ew-resize;
  height: 100%;
  width: 4px;
  right: 0;
}
</style>
