<template>
  <Menu :items size="x-small" />
</template>

<script setup lang="ts">
import { nextTick, toRef } from "vue";

import type { TProject, TProjectState } from "@/types";
import { confirmDialog } from "@/core";
import { Menu } from "@/components";

import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

import { getCurrentDBStore, useAppStore } from "@/app";
const appStore = useAppStore();

const props = defineProps<{ project: TProject | TProjectState }>();
const project = toRef(props, "project");

const projectDBStore = getCurrentDBStore("project");

const items = [
  {
    onClick: () => {
      projectDBStore.loadProject(project.value);
      nextTick(() => {
        projectDBStore.saveProject(project.value);
      });
    },
    prependIcon: "mdi:mdi-content-save-outline",
    title: "Save",
  },
  {
    onClick: () => {
      projectDBStore.loadProject(project.value);
      nextTick(() => {
        project.value.state.state.editMode = true;
      });
    },
    prependIcon: "mdi:mdi-pencil",
    title: "Rename",
  },
  {
    onClick: () => {
      projectDBStore.reloadProject(project.value);
    },
    prependIcon: "mdi:mdi-reload",
    title: "Reload",
  },
  {
    onClick: () => {
      projectDBStore.unloadProject(project.value);
    },
    prependIcon: "mdi:mdi-power",
    title: "Unload",
  },
  {
    onClick: () => {
      const newProject = projectDBStore.duplicateProject(project.value);
      if (!route.path.endsWith(newProject.id)) {
        router.push({
          name: appStore.state.currentWorkspace + "NetworkEditor",
          params: { projectId: newProject.id },
        });
      }
    },
    prependIcon: "mdi:mdi-content-duplicate",
    title: "Duplicate",
  },
  {
    onClick: () => projectDBStore.exportProject(project.value),
    prependIcon: "mdi:mdi-download",
    title: "Download",
  },
  {
    onClick: () =>
      confirmDialog({
        text: "Are you sure to delete it?",
        title: "Delete project",
      }).then((answer: boolean) => {
        if (answer) projectDBStore.deleteProject(project.value);
      }),
    prependIcon: "mdi:mdi-trash-can-outline",
    title: "Delete",
  },
];
</script>
