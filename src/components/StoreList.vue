<template>
  <v-card class="mt-2">
    <v-card-title class="ma-0 pa-0">
      <v-tabs density="compact" v-model="databaseTab">
        <v-tab value="one">Project</v-tab>
        <v-tab value="two">Model</v-tab>
      </v-tabs>
    </v-card-title>
    <v-window v-model="databaseTab">
      <v-window-item value="one">
        <v-card-subtitle
          :key="stores.projectStore.projectId"
          v-if="appStore.session.devMode"
        >
          Current project: {{ truncate(stores.projectStore.projectId) }}
        </v-card-subtitle>
        <v-list :key="stores.projectDBStore.projects.length" lines="two" nav>
          <v-list-item :to="{ name: simulator + 'ProjectNew' }">
            <template #prepend>
              <v-icon icon="mdi-plus" />
            </template>
            New project
          </v-list-item>
          <v-divider />
          <v-list-subheader>Existing projects</v-list-subheader>
          <v-list-item
            :key="index"
            :subtitle="`${project.network.nodes.length} nodes, ${project.network.connections.length} connections`"
            :title="project.name"
            :to="{
              name: simulator + 'Project',
              params: { projectId: project.id },
            }"
            v-for="(project, index) in stores.projectDBStore.projects"
          />
        </v-list>
      </v-window-item>
      <v-window-item value="two">
        <v-card-subtitle
          :key="stores.modelStore.modelId"
          v-if="appStore.session.devMode"
        >
          Current model: {{ stores.modelStore.modelId }}
        </v-card-subtitle>
        <v-list :key="stores.modelDBStore.models.length" nav>
          <v-list-subheader>Existing models</v-list-subheader>
          <v-list-item
            :key="index"
            :subtitle="model.elementType"
            :title="model.label"
            :to="{
              name: simulator + 'Model',
              params: { modelId: model.id },
            }"
            v-for="(model, index) in stores.modelDBStore.models"
          />
        </v-list>
      </v-window-item>
    </v-window>
  </v-card>
</template>

<script lang="ts" setup>
import { computed, ref } from "vue";

import { truncate } from "@/utils/truncate";

import { useAppStore } from "@/store/appStore";
const appStore = useAppStore();

const props = defineProps([
  "simulator",
  "stores",
]);

const simulator = computed(() => props.simulator);
const stores = computed(() => props.stores);

const databaseTab = ref("one");
</script>
