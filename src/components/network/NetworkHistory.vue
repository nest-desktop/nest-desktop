<template>
  <v-btn-group v-if="'network' in project" density="compact" theme="dark" variant="tonal">
    <!-- <v-btn
      :disabled="countBefore <= 0"
      @click="project.networkRevision.oldest()"
      icon="mdi:mdi-page-first"
      title="load oldest network"
    /> -->

    <v-btn :disabled="countBefore <= 0" stacked title="load older network" @click="project.networkRevision.older()">
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

    <v-btn :disabled="countAfter <= 0" stacked title="load newer network" @click="project.networkRevision.newer()">
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
      @click="project.networkRevision.newest()"
      icon="mdi:mdi-page-last"
      title="load newest network"
    /> -->
  </v-btn-group>
</template>

<script setup lang="ts">
import { computed } from "vue";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

const project = computed(() => appStore.currentWorkspace.stores.projectStore.state.project);

/**
 * Count networks before the current.
 */
const countBefore = computed((): number => project.value.networkRevision.revisionIdx);

/**
 * Count networks after the current.
 */
const countAfter = computed(
  (): number => project.value.networkRevision.revisions.length - project.value.networkRevision.revisionIdx - 1,
);
</script>
