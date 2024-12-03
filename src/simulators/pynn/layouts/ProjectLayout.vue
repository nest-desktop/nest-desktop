<template>
  <ProjectNav color="green" />

  <template v-if="projectStore.state.projectId">
    <ProjectBar color="green" />

    <ProjectController />

    <router-view :key="projectStore.state.projectId" name="project" />
  </template>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

import ProjectBar from "@/components/project/ProjectBar.vue";
import ProjectController from "@/components/project/ProjectController.vue";
import ProjectNav from "@/components/project/ProjectNav.vue";
import { TProjectStore } from "@/stores/project/defineProjectStore";
import { mountProjectLayout } from "@/helpers/routes";

const router = useRouter();
const route = useRoute();

import { usePyNNProjectStore } from "../stores/project/projectStore";
const projectStore: TProjectStore = usePyNNProjectStore();

onMounted(() => mountProjectLayout({ route, router }));
</script>
