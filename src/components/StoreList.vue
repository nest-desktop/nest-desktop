<template>
  <v-card class="mt-2" title="Frontend">
    <v-toolbar color="transparent" density="compact">
      <v-toolbar-title>Store list</v-toolbar-title>

      <v-spacer />

      <v-btn-toggle class="mx-2" density="compact">
        <v-btn
          id="import-dialog"
          icon="mdi:mdi-import"
          style="min-width: 40px"
          title="Open dialog to import"
          @click="openImportDialog()"
        />
        <v-btn
          id="export-dialog"
          icon="mdi:mdi-export"
          style="min-width: 40px"
          title="Open dialog to export"
          @click="openExportDialog()"
        />
      </v-btn-toggle>

      <template #extension>
        <v-tabs v-model="databaseTab">
          <v-tab value="project"> Project </v-tab>
          <v-tab value="model"> Model </v-tab>

          <v-spacer />
        </v-tabs>
      </template>
    </v-toolbar>

    <v-window v-model="databaseTab">
      <v-window-item value="project">
        <v-card-subtitle v-if="appStore.state.devMode" :key="stores.projectStore.state.projectId">
          Current project:
          {{ truncate(appStore.currentWorkspace.stores.projectStore.state.projectId) }}
        </v-card-subtitle>
        <v-list :key="stores.projectDBStore.state.projects.length" density="compact" lines="two" nav>
          <v-list-item :to="{ name: appStore.state.currentWorkspace + 'ProjectNew' }">
            <template #prepend>
              <v-icon icon="mdi:mdi-plus" />
            </template>
            New project
          </v-list-item>

          <v-divider />

          <v-list-subheader>Existing projects</v-list-subheader>
          <v-list-item
            v-for="(project, index) in stores.projectDBStore.state.projects.slice().reverse()"
            :key="index"
            :subtitle="`${project.network.nodes.length} nodes, ${project.network.connections.length} connections`"
            :title="project.name || 'undefined project ' + stores.projectDBStore.getProjectIdx(project)"
            :to="{
              name: appStore.state.currentWorkspace + 'Project',
              params: { projectId: project.id },
            }"
          />
        </v-list>
      </v-window-item>

      <v-window-item value="model">
        <v-card-subtitle v-if="appStore.state.devMode" :key="stores.modelStore.modelId">
          Current model: {{ stores.modelStore.modelId }}
        </v-card-subtitle>

        <v-list :key="stores.modelDBStore.state.models.length" nav>
          <v-list-subheader>Existing models</v-list-subheader>
          <v-list-item
            v-for="(model, index) in stores.modelDBStore.state.models"
            :key="index"
            :subtitle="model.elementType"
            :title="model.state.label"
            :to="{
              name: appStore.state.currentWorkspace + 'Model',
              params: { modelId: model.id },
            }"
          />
        </v-list>
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { createDialog } from "vuetify3-dialog";

import ExportDialog from "./dialog/ExportDialog.vue";
import ImportDialog from "./dialog/ImportDialog.vue";
import { truncate } from "@/utils/truncate";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

const stores = computed(() => appStore.currentWorkspace.stores);

const databaseTab = ref("project");

const openExportDialog = () => {
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
};

const openImportDialog = () => {
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
};
</script>
