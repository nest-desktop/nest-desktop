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
      extension-height="28"
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
        variant="outlined"
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
          {{ projects.length }} projects
        </v-row>
      </template>

      <v-menu>
        <template #activator="{ props }">
          <v-btn icon="mdi:mdi-dots-vertical" size="small" v-bind="props" />
        </template>

        <v-list density="compact">
          <v-list-item
            :id="item.id"
            :key="index"
            :value="index"
            @click="item.onClick()"
            v-for="(item, index) in menuItems"
          >
            <template #prepend>
              <v-icon :icon="item.icon" />
            </template>

            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-toolbar>

    <v-list
      :key="projects.length"
      class="pt-0"
      density="compact"
      lines="two"
      nav
    >
      <v-list-subheader title="Projects" inset />

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

              <v-btn
                :color="isHovering ? 'primary' : 'transparent'"
                @click.prevent
                icon
                size="x-small"
                variant="text"
              >
                <v-icon icon="mdi:mdi-dots-vertical" />

                <ProjectMenu :project :projectDBStore />
              </v-btn>
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
                variant="outlined"
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

import DeleteDialog from "../dialog/DeleteDialog.vue";
import ExportDialog from "../dialog/ExportDialog.vue";
import ImportDialog from "../dialog/ImportDialog.vue";
import ProjectMenu from "./ProjectMenu.vue";
import { TModelDBStore } from "@/stores/model/defineModelDBStore";
import { TProject } from "@/types";
import DialogTextField from "../dialog/DialogTextField.vue";
import { TProjectDBStore } from "@/stores/project/defineProjectDBStore";
// @ts-ignore - 'truncate' is declared but its value is never read.
import { truncate } from "@/utils/truncate";

import { useRouter } from "vue-router";
const router = useRouter();

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

import { useNavStore } from "@/stores/navStore";
const navStore = useNavStore();

const props = defineProps<{
  modelDBStore: TModelDBStore;
  projectDBStore: TProjectDBStore;
}>();

const projectDBStore = computed(() => props.projectDBStore);
const modelDBStore = computed(() => props.modelDBStore);

const projects = computed(() =>
  props.projectDBStore.state.projects.filter((project: TProject) =>
    project.name
      .toLocaleLowerCase()
      .includes(search.value ? search.value.toLocaleLowerCase() : "")
  )
);

const search = ref("");

const menuItems = [
  {
    title: "Import",
    icon: "mdi:mdi-import",
    id: "import-dialog",
    onClick: () => {
      createDialog({
        title: "",
        text: "",
        customComponent: {
          component: ImportDialog,
          props: {
            modelDBStore: modelDBStore.value,
            projectDBStore: projectDBStore.value,
          },
        },
        dialogOptions: {
          width: "1280px",
        },
      });
    },
  },
  {
    title: "Export",
    icon: "mdi:mdi-export",
    id: "export-dialog",
    onClick: () => {
      createDialog({
        title: "",
        text: "",
        customComponent: {
          component: ExportDialog,
          props: {
            modelDBStore: modelDBStore.value,
            projectDBStore: projectDBStore.value,
          },
        },
        dialogOptions: {
          width: "1280px",
        },
      });
    },
  },
  {
    title: "Delete",
    icon: "mdi:mdi-trash-can-outline",
    id: "delete-dialog",
    onClick: () => {
      createDialog({
        title: "",
        text: "",
        customComponent: {
          component: DeleteDialog,
          props: {
            store: projectDBStore.value,
          },
        },
        dialogOptions: {
          width: "1280px",
        },
      });
    },
  },
  {
    title: "Reload list",
    icon: "mdi:mdi-reload",
    onClick: () => projectDBStore.value.updateList(),
  },
  // { title: "Reset database", icon: "mdi:mdi-database-sync-outline" },
];

const openDialogNewProject = () => {
  createDialog({
    title: "",
    text: "",
    customComponent: {
      component: DialogTextField,
      props: {
        title: "Create project",
        modelValue: "new_project_" + props.projectDBStore.state.projects.length,
      },
    },
  }).then((projectName: boolean | string) => {
    if (projectName) {
      router.push({
        name: appStore.state.simulator + "ProjectAdd",
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
