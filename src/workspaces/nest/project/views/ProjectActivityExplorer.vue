<template>
  <v-layout v-if="currentProject" full-height>
    <!-- <v-toolbar density="compact">
      <v-btn icon="mdi:mdi-plus" />
      <v-btn icon="mdi:mdi-minus" />
    </v-toolbar> -->
    <ActivityChartGraph
      v-if="projectViewStore.state.views.activity === 'abstract'"
      :graph="currentProject.activityGraph.activityChartGraph"
    />
    <ActivityAnimationGraph
      v-else-if="projectViewStore.state.views.activity === 'spatial'"
      :graph="currentProject.activityGraph.activityAnimationGraph"
    />
  </v-layout>
</template>

<script setup lang="ts">
import { ActivityChartGraph } from "@/activityGraph/components";
import { getCurrentViewStore } from "@/app";

import { ActivityAnimationGraph } from "../../activityGraph/components";
import { currentProject } from "../stores";

const projectViewStore = getCurrentViewStore("project");
</script>
