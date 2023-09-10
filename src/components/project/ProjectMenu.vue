<template>
  <v-menu>
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
          <v-btn @click="closeDialog()" size="small">close </v-btn>
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
            append-icon="mdi-pencil-outline"
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

import { Project, ProjectPropTypes } from "@/types/projectTypes";

import { useAppStore } from "@/store/appStore";
const appStore = useAppStore();

import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();

const props = defineProps({
  project: ProjectPropTypes,
});

const project = computed(() => props.project as Project);

const state = reactive({
  dialog: {
    delete: false,
    rename: false,
  },
  projectName: "",
});

const projectMenuItems = [
  {
    title: "Rename",
    icon: "mdi-pencil",
    onClick: () => {
      project.value.state.state.editMode = true;
      // project.state.checkChanges();
    },
  },
  {
    title: "Save",
    icon: "mdi-content-save-outline",
    onClick: () => project.value.save(),
  },
  {
    icon: "mdi-reload",
    title: "Reload",
    onClick: () => {
      project.value.reload();
    },
  },
  {
    icon: "mdi-power",
    title: "Unload",
    onClick: () => {
      project.value.unload();
    },
  },
  {
    id: "projectDuplicate",
    icon: "mdi-content-duplicate",
    title: "Duplicate",
    onClick: () => {
      const newProject = project.value.duplicate();
      if (!route.path.endsWith(newProject.id)) {
        router.push({
          name: appStore.simulator + "NetworkEditor",
          params: { projectId: newProject.id },
        });
      }
    },
  },
  {
    title: "Download",
    icon: "mdi-download",
    onClick: () => project.value.export(),
  },
  {
    title: "Delete",
    icon: "mdi-trash-can-outline",
    onClick: () => project.value.delete(),
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
  project.value.name = state.projectName;
  project.value.save();
  closeDialog();
};

/**
 * Delete project.
 */
const deleteProject = () => {
  project.value.delete();
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
