<template>
  <v-tabs stacked>
    <v-tab
      :key="index"
      :to="tab.to"
      :title="tab.title"
      size="small"
      v-for="(tab, index) in tabItems"
    >
      <v-icon :icon="tab.icon" />
      <span class="text-no-wrap">{{ tab.label }}</span>
    </v-tab>
  </v-tabs>

  <v-spacer />

  <v-app-bar-title>
    {{ project.name }}
  </v-app-bar-title>

  <v-spacer />

  <simulation-button class="mx-2" :simulation="project.simulation" />
</template>

<script lang="ts" setup>
import { computed } from "vue";

import SimulationButton from "@/components/simulation/SimulationButton.vue";
import { Project, ProjectPropTypes } from "@/types/projectTypes";

const props = defineProps({
  project: ProjectPropTypes,
  tabItems: Object,
});

const project = computed(() => props.project as Project);
const tabItems = computed(() => props.tabItems as Object);
</script>
