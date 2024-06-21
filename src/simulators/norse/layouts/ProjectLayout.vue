<template>
  <ProjectNav :modelDBStore :projectDBStore />

  <ProjectBar :project-store color="purple" />

  <ProjectController :projectStore />

  <router-view :key="projectStore.state.projectId" name="project" />
</template>

<script lang="ts" setup>
import ProjectBar from "@/components/project/ProjectBar.vue";
import ProjectController from "@/components/project/ProjectController.vue";
import ProjectNav from "@/components/project/ProjectNav.vue";
import { TModelDBStore } from "@/stores/model/defineModelDBStore";
import { TProjectDBStore } from "@/stores/project/defineProjectDBStore";
import { TProjectStore } from "@/stores/project/defineProjectStore";

import { useNorseModelDBStore } from "../stores/model/modelDBStore";
const modelDBStore: TModelDBStore = useNorseModelDBStore();

import { useNorseProjectDBStore } from "../stores/project/projectDBStore";
const projectDBStore: TProjectDBStore = useNorseProjectDBStore();

import { useNorseProjectStore } from "../stores/project/projectStore";
const projectStore: TProjectStore = useNorseProjectStore();
</script>
