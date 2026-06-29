<template>
  <v-btn-group density="compact" theme="dark" variant="tonal" style="overflow-x: hidden">
    <!-- <v-btn
      :disabled="countBefore <= 0"
      @click="project.network.revision.oldest()"
      icon="mdi:mdi-page-first"
      title="load oldest network"
    /> -->

    <v-btn :disabled="countBefore <= 0" stacked title="load older network" @click="project.network.revision.older()">
      <v-badge
        :content="countBefore"
        :offset-y="countBefore > 0 ? -2 : -18"
        color="transparent"
        location="bottom right"
        offset-x="-8"
      >
        <v-icon>mdi-undo-variant</v-icon>
      </v-badge>
    </v-btn>

    <v-btn :disabled="countAfter <= 0" stacked title="load newer network" @click="project.network.revision.newer()">
      <v-badge
        :content="countAfter"
        :offset-y="countAfter > 0 ? -2 : -18"
        color="transparent"
        location="bottom right"
        offset-x="-8"
      >
        <v-icon>mdi-redo-variant</v-icon>
      </v-badge>
    </v-btn>

    <!-- <v-btn
      :disabled="countAfter <= 0"
      @click="project.network.revision.newest()"
      icon="mdi:mdi-page-last"
      title="load newest network"
    /> -->
  </v-btn-group>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { getCurrentStore } from "@/app";
const projectStore = getCurrentStore("project");

const project = computed(() => projectStore.state.project);

/**
 * Count networks before the current.
 */
const countBefore = computed((): number => project.value.network.revision.revisionIdx);

/**
 * Count networks after the current.
 */
const countAfter = computed(
  (): number => project.value.network.revision.states.length - project.value.network.revision.revisionIdx - 1,
);
</script>
