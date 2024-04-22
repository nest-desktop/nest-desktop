<template>
  <v-menu activator="parent">
    <v-dialog max-width="480" v-model="state.dialog.delete">
      <v-card>
        <v-card-title> Are you sure to delete it? </v-card-title>

        <v-card-text>
          <v-list density="compact">
            <v-list-subheader>Project: {{ project.name }} </v-list-subheader>
            <v-list-item
              :key="index"
              v-for="(connection, index) in project.network.connections.all"
            >
              {{ connection.source.view.label }} ->
              {{ connection.target.view.label }}
            </v-list-item>
          </v-list>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn @click="closeDialog()" size="small">close</v-btn>
          <v-btn @click="deleteProject" size="small">save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog max-width="480" v-model="state.dialog.rename">
      <v-card>
        <v-card-title> Rename this project </v-card-title>

        <v-card-text>
          <v-text-field
            label="Project name"
            append-icon="mdi:mdi-pencil-outline"
            v-model="state.projectName"
          />
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn @click="closeDialog()" size="small">close </v-btn>
          <v-btn @click="saveProject" size="small">save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-list density="compact">
      <v-list-item
        :key="index"
        :value="index"
        @click="item.onClick"
        v-for="(item, index) in projectMenuItems"
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
import { computed, reactive } from "vue";

import { ProjectComponentProps, TProject } from "@/types/projectTypes";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

const props = defineProps({
  project: ProjectComponentProps,
  projectDBStore: { required: true, type: Object },
});

const project = computed(() => props.project as TProject);
const projectDBStore = computed(() => props.projectDBStore);

const state = reactive({
  dialog: {
    delete: false,
    rename: false,
  },
  projectName: "",
});

const projectMenuItems = [
  {
    icon: "mdi:mdi-pencil",
    onClick: () => {
      project.value.state.state.editMode = true;
      // project.state.checkChanges();
    },
    title: "Rename",
  },
  {
    icon: "mdi:mdi-content-save-outline",
    onClick: () => projectDBStore.value.saveProject(project.value.id),
    title: "Save",
  },
  {
    icon: "mdi:mdi-reload",
    onClick: () => {
      projectDBStore.value.reloadProject(project.value.id);
    },
    title: "Reload",
  },
  {
    icon: "mdi:mdi-power",
    onClick: () => {
      projectDBStore.value.unloadProject(project.value.id);
    },
    title: "Unload",
  },
  {
    icon: "mdi:mdi-content-duplicate",
    id: "projectDuplicate",
    onClick: () => {
      const newProject = projectDBStore.value.duplicate();
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
    onClick: () => projectDBStore.value.exportProject(project.value.id),
    title: "Download",
  },
  {
    icon: "mdi:mdi-trash-can-outline",
    onClick: () => projectDBStore.value.delete(project.value.id),
    title: "Delete",
  },
];

/**
 * Close dialog.
 */
const closeDialog = () => {
  state.dialog.delete = false;
  state.dialog.rename = false;
};

/**
 * Close project.
 */
const saveProject = () => {
  project.value.state.state.editMode = false;
  project.value.name = state.projectName;
  projectDBStore.value.saveProject(project.value.id);
  closeDialog();
};

/**
 * Delete project.
 */
const deleteProject = () => {
  projectDBStore.value.deleteProject(project.value.id);
  closeDialog();
};

// const openDialog = (action: string = "export") => {
//   if (["delete", "rename"].includes(action)) {
//     state.projectName = project.value.name;
//     // state.dialog[action] = true;
//   } else {
//     project.value.state.reset();
//     project.value.state.selected = true;
//     // core.app.openDialog("projects", action, { projects: [project] });
//   }
// };
</script>
