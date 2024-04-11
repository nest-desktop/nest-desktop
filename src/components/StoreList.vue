<template>
  <v-card class="mt-2">
    <v-toolbar
      color="transparent"
      density="compact"
    >
      <v-app-bar-nav-icon size="small" />
      <v-toolbar-title>Store list</v-toolbar-title>

      <v-spacer />

      <v-btn-toggle
        class="mx-2"
        density="compact"
      >
        <import-dialog
          :model-d-b-store="stores.modelDBStore"
          :project-d-b-store="stores.projectDBStore"
        />
        <export-dialog
          :model-d-b-store="stores.modelDBStore"
          :project-d-b-store="stores.projectDBStore"
        />
      </v-btn-toggle>

      <template #extension>
        <v-tabs v-model="databaseTab">
          <v-tab value="project">
            Project
          </v-tab>
          <v-tab value="model">
            Model
          </v-tab>

          <v-spacer />
        </v-tabs>
      </template>
    </v-toolbar>

    <v-window v-model="databaseTab">
      <v-window-item value="project">
        <v-card-subtitle
          v-if="appStore.session.state.devMode"
          :key="stores.projectStore.state.projectId"
        >
          Current project: {{ truncate(stores.projectStore.state.projectId) }}
        </v-card-subtitle>
        <v-list
          :key="stores.projectDBStore.state.projects.length"
          lines="two"
          nav
        >
          <v-list-item :to="{ name: simulator + 'ProjectNew' }">
            <template #prepend>
              <v-icon icon="mdi:mdi-plus" />
            </template>
            New project
          </v-list-item>
          <v-divider />
          <v-list-subheader>Existing projects</v-list-subheader>
          <v-list-item
            v-for="(project, index) in stores.projectDBStore.state.projects"
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
          v-if="appStore.session.state.devMode"
          :key="stores.modelStore.modelId"
        >
          Current model: {{ stores.modelStore.modelId }}
        </v-card-subtitle>

        <v-list
          :key="stores.modelDBStore.state.models.length"
          nav
        >
          <v-list-subheader>Existing models</v-list-subheader>
          <v-list-item
            v-for="(model, index) in stores.modelDBStore.state.models"
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
import { computed, ref } from "vue";

import ExportDialog from "@/components/dialog/ExportDialog.vue";
import ImportDialog from "@/components/dialog/ImportDialog.vue";
import { truncate } from "@/utils/truncate";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

const props = defineProps(["simulator", "stores"]);

const simulator = computed(() => props.simulator);
const stores = computed(() => props.stores);

const databaseTab = ref("project");
</script>
