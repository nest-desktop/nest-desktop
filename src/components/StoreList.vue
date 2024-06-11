<template>
  <v-card class="mt-2">
    <ImportDialog
      :modelDBStore="modelDBStore"
      :projectDBStore="projectDBStore"
      activator="#import-dialog"
    />
    <ExportDialog
      :modelDBStore="modelDBStore"
      :projectDBStore="projectDBStore"
      activator="#export-dialog"
    />

    <v-toolbar color="transparent" density="compact">
      <v-app-bar-nav-icon size="small" />
      <v-toolbar-title>Store list</v-toolbar-title>

      <v-spacer />

      <v-btn-toggle class="mx-2" density="compact">
        <v-btn
          icon="mdi:mdi-import"
          id="import-dialog"
          style="min-width: 40px"
          title="Open dialog to import"
        />
        <v-btn
          icon="mdi:mdi-export"
          id="export-dialog"
          style="min-width: 40px"
          title="Open dialog to export"
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
        <v-card-subtitle
          v-if="appStore.state.devMode"
          :key="projectStore.state.projectId"
        >
          Current project: {{ truncate(projectStore.state.projectId) }}
        </v-card-subtitle>
        <v-list :key="projectDBStore.state.projects.length" lines="two" nav>
          <v-list-item :to="{ name: simulator + 'ProjectNew' }">
            <template #prepend>
              <v-icon icon="mdi:mdi-plus" />
            </template>
            New project
          </v-list-item>
          <v-divider />
          <v-list-subheader>Existing projects</v-list-subheader>
          <v-list-item
            v-for="(project, index) in projectDBStore.state.projects"
            :key="index"
            :subtitle="`${project.network.nodes.length} nodes, ${project.network.connections.length} connections`"
            :title="project.name"
            :to="{
              name: simulator + 'Project',
              params: { projectId: project.id },
            }"
          />
        </v-list>
      </v-window-item>

      <v-window-item value="model">
        <v-card-subtitle
          v-if="appStore.state.devMode"
          :key="modelStore.modelId"
        >
          Current model: {{ modelStore.modelId }}
        </v-card-subtitle>

        <v-list :key="modelDBStore.state.models.length" nav>
          <v-list-subheader>Existing models</v-list-subheader>
          <v-list-item
            v-for="(model, index) in modelDBStore.state.models"
            :key="index"
            :subtitle="model.elementType"
            :title="model.label"
            :to="{
              name: simulator + 'Model',
              params: { modelId: model.id },
            }"
          />
        </v-list>
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script lang="ts" setup>
import { Store } from "pinia";
import { ref } from "vue";

import ExportDialog from "./dialog/ExportDialog.vue";
import ImportDialog from "./dialog/ImportDialog.vue";
import { truncate } from "@/utils/truncate";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

defineProps<{
  modelDBStore: Store<any, any>;
  modelStore: Store<any, any>;
  projectDBStore: Store<any, any>;
  projectStore: Store<any, any>;
  simulator: string;
}>();

const databaseTab = ref("project");
</script>
