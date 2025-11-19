<template>
  <ProjectNav color="purple" />

  <template v-if="projectStore.state.projectId">
    <ProjectBar color="purple">
      <template #graphEditor>
        <v-tab
          :to="{
            name: 'norseGraphEditor',
            params: { projectId: projectStore.state.projectId },
          }"
          class="tab-graph-editor"
          size="small"
          stacked
          title="Graph Editor"
          value="editor"
        >
          <v-icon
            :icon="projectViewStore.state.views.graph == 'network' ? 'graph:network' : 'mdi:mdi-sitemap-outline'"
          />
          Editor
        </v-tab>

        <v-btn height="100%" rounded="0" variant="plain" width="32" style="min-width: 32px">
          <v-icon icon="mdi:mdi-menu-down" />

          <v-menu activator="parent" target=".tab-graph-editor">
            <v-list density="compact">
              <v-list-item
                :active="projectViewStore.state.views.graph == 'code'"
                :to="{
                  name: 'norseGraphEditor',
                  params: { projectId: projectStore.state.projectId },
                  query: { graphView: 'code' },
                }"
                prepend-icon="graph:flowchart"
              >
                code (beta)
              </v-list-item>
              <v-list-item
                :active="projectViewStore.state.views.graph == 'network'"
                :to="{
                  name: 'norseGraphEditor',
                  params: { projectId: projectStore.state.projectId },
                  query: { graphView: 'network' },
                }"
                exact
              >
                <template #prepend>
                  <v-icon icon="graph:network" />
                </template>
                network
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>

        <v-divider vertical />
      </template>
    </ProjectBar>

    <ProjectController />

    <router-view :key="projectStore.state.projectId" name="project" />
  </template>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import ProjectBar from "@/components/project/ProjectBar.vue";
import ProjectController from "@/components/project/ProjectController.vue";
import ProjectNav from "@/components/project/ProjectNav.vue";
import { mountProjectLayout } from "@/helpers/routes";

import type { NorseProject } from "../types";

const router = useRouter();
const route = useRoute();

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

import { useNorseProjectStore } from "../stores/project/projectStore";
const projectStore = useNorseProjectStore();

const project = computed(() => projectStore.state.project as NorseProject);
const projectViewStore = computed(() => appStore.currentWorkspace.views.project);

onMounted(() => {
  mountProjectLayout({ route, router });

  if (project.value.viewModel.subscribe) project.value.viewModel.subscribe();
  project.value.viewModel.engine?.start();
  project.value.viewModel.engine?.runOnce(null);
});

onBeforeUnmount(() => {
  if (project.value.viewModel.unsubscribe) project.value.viewModel.unsubscribe();
  project.value.viewModel.engine?.stop();
});

watch(
  () => project.value,
  (newValue, oldValue) => {
    oldValue.viewModel.unsubscribe();
    oldValue.viewModel.engine?.stop();

    newValue.viewModel.subscribe();
    newValue.viewModel.engine?.start();
    setTimeout(() => newValue.viewModel.engine?.runOnce(null), 1);
  },
);

watch(
  () => route.query?.graphView,
  (graphView) => {
    if (!["code", "network"].includes(graphView as string)) return;
    projectViewStore.value.state.views.graph = graphView;
  },
);
</script>
