<template>
  <v-menu activator="parent">
    <v-list density="compact">
      <v-list-item
        :key="index"
        v-bind="item"
        v-for="(item, index) in menuItems"
      />
    </v-list>
  </v-menu>
</template>

<script lang="ts" setup>
import { computed, nextTick } from "vue";
import { confirmDialog } from "vuetify3-dialog";

import { TProject, TProjectProps } from "@/types";

import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

const props = defineProps<{
  project: TProject | TProjectProps;
}>();

const project = computed(() => props.project);
const projectDBStore = computed(
  () => appStore.currentSimulator.stores.projectDBStore
);

const menuItems = [
  {
    onClick: () => {
      projectDBStore.value.loadProject(project.value);
      nextTick(() => {
        project.value.state.state.editMode = true;
      });
    },
    prependIcon: "mdi:mdi-pencil",
    title: "Rename",
  },
  {
    onClick: () => {
      projectDBStore.value.loadProject(project.value);
      nextTick(() => {
        projectDBStore.value.saveProject(project.value);
      });
    },
    prependIcon: "mdi:mdi-content-save-outline",
    title: "Save",
  },
  {
    prependIcon: "mdi:mdi-reload",
    onClick: () => {
      projectDBStore.value.reloadProject(project.value);
    },
    title: "Reload",
  },
  {
    onClick: () => {
      projectDBStore.value.unloadProject(project.value);
    },
    prependIcon: "mdi:mdi-power",
    title: "Unload",
  },
  {
    onClick: () => {
      const newProject = projectDBStore.value.duplicateProject(project.value);
      if (!route.path.endsWith(newProject.id)) {
        router.push({
          name: appStore.state.simulator + "NetworkEditor",
          params: { projectId: newProject.id },
        });
      }
    },
    prependIcon: "mdi:mdi-content-duplicate",
    title: "Duplicate",
  },
  {
    onClick: () => projectDBStore.value.exportProject(project.value),
    prependIcon: "mdi:mdi-download",
    title: "Download",
  },
  {
    onClick: () =>
      confirmDialog({
        text: "Are you sure to delete it?",
        title: "Delete project",
      }).then((answer: boolean) => {
        if (answer) {
          projectDBStore.value.deleteProject(project.value);
        }
      }),
    prependIcon: "mdi:mdi-trash-can-outline",
    title: "Delete",
  },
];
</script>
