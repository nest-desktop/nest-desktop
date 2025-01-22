<template>
  <ProjectNav color="yellow-darken-4" />

  <template v-if="projectStore.state.projectId">
    <ProjectBar color="yellow-darken-4">
      <template #stopwatch>
        <v-card
          v-if="projectStore.state.project && appStore.state.devMode && !appStore.state.loading"
          class="mx-1"
          variant="outlined"
        >
          <v-list class="py-1" density="compact" style="font-size: 10px; line-height: 1em">
            <v-list-item class="auto-min-height">
              Analysis: {{ projectStore.state.project.state.state.stopwatch.analysis / 1000 }}s
            </v-list-item>
            <v-list-item class="auto-min-height">
              Visualization: {{ projectStore.state.project.state.state.stopwatch.visualization / 1000 }}s
            </v-list-item>
          </v-list>
        </v-card>
      </template>

      <template #execBtn>
        <v-btn class="mx-2" prepend-icon="mdi:mdi-play" variant="outlined" @click="projectStore.startAnalysis()">
          Analyze
        </v-btn>
      </template>
    </ProjectBar>

    <ProjectController />

    <router-view :key="projectStore.state.projectId" name="project" />
  </template>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import ProjectBar from "@/components/project/ProjectBar.vue";
import ProjectController from "@/components/project/ProjectController.vue";
import ProjectNav from "@/components/project/ProjectNav.vue";
import { mountProjectLayout } from "@/helpers/routes";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

const router = useRouter();
const route = useRoute();

import { useElephantProjectStore } from "../stores/project/projectStore";
const projectStore = useElephantProjectStore();

onMounted(() => mountProjectLayout({ route, router }));
</script>

<style lang="scss" scoped>
.auto-min-height {
  padding: 2px;
  min-height: 1em;
}
</style>
