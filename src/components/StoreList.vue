<template>
  <v-card class="mt-2">
    <v-toolbar color="transparent" density="compact">
      <v-toolbar-title>Store list</v-toolbar-title>

      <v-spacer />

      <v-btn-toggle class="mx-2" density="compact">
        <v-btn
          @click="openImportDialog()"
          icon="mdi:mdi-import"
          id="import-dialog"
          style="min-width: 40px"
          title="Open dialog to import"
        />
        <v-btn
          @click="openExportDialog()"
          icon="mdi:mdi-export"
          id="export-dialog"
          style="min-width: 40px"
          title="Open dialog to export"
        />
      </v-btn-toggle>

      <template #extension>
        <v-tabs v-model="databaseTab">
          <v-tab value="project">Project</v-tab>
          <v-tab value="model">Model</v-tab>

          <v-spacer />
        </v-tabs>
      </template>
    </v-toolbar>

    <v-window v-model="databaseTab">
      <v-window-item value="project">
        <v-card-subtitle
          v-if="appStore.state.devMode"
          :key="stores.projectStore.state.projectId"
        >
          Current project:
          {{
            truncate(
              appStore.currentSimulator.stores.projectStore.state.projectId
            )
          }}
        </v-card-subtitle>
        <v-list
          :key="stores.projectDBStore.state.projects.length"
          density="compact"
          lines="two"
          nav
        >
          <v-list-item :to="{ name: appStore.state.simulator + 'ProjectNew' }">
            <template #prepend>
              <v-icon icon="mdi:mdi-plus" />
            </template>
            New project
          </v-list-item>

          <v-divider />

          <v-list-subheader>Existing projects</v-list-subheader>
          <v-list-item
            :key="index"
            :subtitle="`${project.network.nodes.length} nodes, ${project.network.connections.length} connections`"
            :title="
              project.name ||
              'undefined project ' +
                stores.projectDBStore.getProjectIdx(project)
            "
            :to="{
              name: appStore.state.simulator + 'Project',
              params: { projectId: project.id },
            }"
            v-for="(project, index) in stores.projectDBStore.state.projects
              .slice()
              .reverse()"
          />
        </v-list>
      </v-window-item>

      <v-window-item value="model">
        <v-card-subtitle
          :key="stores.modelStore.modelId"
          v-if="appStore.state.devMode"
        >
          Current model: {{ stores.modelStore.modelId }}
        </v-card-subtitle>

        <v-list :key="stores.modelDBStore.state.models.length" nav>
          <v-list-subheader>Existing models</v-list-subheader>
          <v-list-item
            v-for="(model, index) in stores.modelDBStore.state.models"
            :key="index"
            :subtitle="model.elementType"
            :title="model.label"
            :to="{
              name: appStore.state.simulator + 'Model',
              params: { modelId: model.id },
            }"
          />
        </v-list>
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";
import { createDialog } from "vuetify3-dialog";

import ExportDialog from "./dialog/ExportDialog.vue";
import ImportDialog from "./dialog/ImportDialog.vue";
import { truncate } from "@/utils/truncate";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

const stores = computed(() => appStore.currentSimulator.stores);

const databaseTab = ref("project");

const openExportDialog = () => {
  createDialog({
    title: "",
    text: "",
    customComponent: {
      component: ExportDialog,
      props: {},
    },
    dialogOptions: {
      width: "1280px",
    },
  });
};

const openImportDialog = () => {
  createDialog({
    title: "",
    text: "",
    customComponent: {
      component: ImportDialog,
      props: {},
    },
    dialogOptions: {
      width: "1280px",
    },
  });
};
</script>
