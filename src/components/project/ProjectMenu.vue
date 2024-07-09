<template>
  <v-menu activator="parent">
    <v-list density="compact">
      <v-list-item
        :key="index"
        :value="index"
        @click="item.onClick"
        v-for="(item, index) in menuItems"
      >
        <template #prepend>
          <v-icon :icon="item.icon" />
        </template>
        <v-list-item-title>{{ item.title }}</v-list-item-title>
      </v-list-item>
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
    icon: "mdi:mdi-pencil",
    onClick: () => {
      projectDBStore.value.loadProject(project.value);
      nextTick(() => {
        project.value.state.state.editMode = true;
      });
    },
    title: "Rename",
  },
  {
    icon: "mdi:mdi-content-save-outline",
    onClick: () => {
      projectDBStore.value.loadProject(project.value);
      nextTick(() => {
        projectDBStore.value.saveProject(project.value);
      });
    },
    title: "Save",
  },
  {
    icon: "mdi:mdi-reload",
    onClick: () => {
      projectDBStore.value.reloadProject(project.value);
    },
    title: "Reload",
  },
  {
    icon: "mdi:mdi-power",
    onClick: () => {
      projectDBStore.value.unloadProject(project.value);
    },
    title: "Unload",
  },
  {
    icon: "mdi:mdi-content-duplicate",
    id: "projectDuplicate",
    onClick: () => {
      const newProject = projectDBStore.value.duplicateProject(project.value);
      if (!route.path.endsWith(newProject.id)) {
        router.push({
          name: appStore.state.simulator + "NetworkEditor",
          params: { projectId: newProject.id },
        });
      }
    },
    title: "Duplicate",
  },
  {
    icon: "mdi:mdi-download",
    onClick: () => projectDBStore.value.exportProject(project.value),
    title: "Download",
  },
  {
    icon: "mdi:mdi-trash-can-outline",
    onClick: () =>
      confirmDialog({
        text: "Are you sure to delete it?",
        title: "Delete project",
      }).then((answer: boolean) => {
        if (answer) {
          projectDBStore.value.deleteProject(project.value);
        }
      }),
    title: "Delete",
  },
];
</script>
