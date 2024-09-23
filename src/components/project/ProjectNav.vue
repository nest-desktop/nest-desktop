<template>
  <v-navigation-drawer
    :model-value="navStore.state.open"
    :style="{ transition: navStore.state.resizing ? 'initial' : '' }"
    :width="navStore.state.width"
    @transitionend="dispatchWindowResize()"
    class="d-print-none"
    permanent
  >
    <div @mousedown="resizeSideNav()" class="resize-handle" />

    <v-toolbar
      class="fixed-bar"
      color="nest-project"
      density="compact"
      extended
      extension-height="36"
    >
      <v-text-field
        class="mx-1"
        clearable
        density="compact"
        hide-details
        placeholder="Search project"
        prepend-inner-icon="mdi:mdi-magnify"
        single-line
        v-model="search"
      />

      <template #extension>
        <v-fab
          @click="openDialogNewProject()"
          class="ms-4"
          color="primary"
          icon="mdi:mdi-plus"
          location="bottom left"
          size="40"
          absolute
          offset
          title="Create a new project"
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

    <v-list
      :key="projects.length"
      class="pt-0"
      density="compact"
      lines="two"
      nav
    >
      <v-list-subheader inset />

      <template v-for="(project, index) in projects.slice().reverse()">
        <v-hover v-slot="{ isHovering, props }">
          <v-list-item
            :key="index"
            :to="{
              name: appStore.state.simulator + 'Project',
              params: { projectId: project.id },
            }"
            :ripple="!project.state?.editMode"
            v-bind="props"
          >
            <template #append v-if="!project.state?.editMode">
              <template v-if="project.doc">
                <v-btn
                  @click.prevent="saveProject(project)"
                  :disabled="!project.state?.changes"
                  :color="project.state?.changes ? 'red' : 'primary'"
                  :icon="
                    project.state?.changes
                      ? 'mdi:mdi-content-save-outline'
                      : 'mdi:mdi-check'
                  "
                  size="x-small"
                  variant="text"
                />
              </template>

              <ProjectMenu
                :color="isHovering ? 'primary' : 'transparent'"
                :project
              />
            </template>

            <template #default v-if="project.state?.editMode">
              <v-text-field
                @click.prevent
                @click:append-inner="saveProject(project)"
                @update:model-value="project.state.state.changes = true"
                append-inner-icon="mdi:mdi-content-save-edit-outline"
                autofocused
                class="pt-2"
                density="compact"
                hide-details
                label="Project name"
                v-model="project.name"
              />
            </template>

            <template #default v-else-if="appStore.state.devMode">
              <v-list-item-title>
                {{
                  project.name ||
                  "undefined project " + projectDBStore.getProjectIdx(project)
                }}
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
                {{
                  project.name ||
                  "undefined project " + projectDBStore.getProjectIdx(project)
                }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ project.network.nodes.length }} nodes,
                {{ project.network.connections.length }} connections
              </v-list-item-subtitle>
            </template>
          </v-list-item>
        </v-hover>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref } from "vue";
import { createDialog } from "vuetify3-dialog";

import { TProject } from "@/types";
// @ts-ignore - 'truncate' is declared but its value is never read.
import { truncate } from "@/utils/truncate";

import DeleteDialog from "../dialog/DeleteDialog.vue";
import TextFieldDialog from "../dialog/TextFieldDialog.vue";
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

const projectDBStore = computed(
  () => appStore.currentSimulator.stores.projectDBStore
);

const projects = computed(() =>
  projectDBStore.value.state.projects.filter((project: TProject) =>
    project.name
      .toLocaleLowerCase()
      .includes(search.value ? search.value.toLocaleLowerCase() : "")
  )
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

const openDialogNewProject = () => {
  createDialog({
    customComponent: {
      component: TextFieldDialog,
      props: {
        title: "Create project",
        modelValue: "new_project_" + projectDBStore.value.state.projects.length,
      },
    },
    text: "",
    title: "",
  }).then((projectName: boolean | string) => {
    if (projectName) {
      router.push({
        name: appStore.state.simulator + "ProjectNew",
        query: { name: projectName as string },
      });
    }
  });
};

const dispatchWindowResize = () => {
  nextTick(() => window.dispatchEvent(new Event("resize")));
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
const saveProject = (project: TProject) => {
  project.state.state.editMode = false;
  projectDBStore.value.saveProject(project);
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
