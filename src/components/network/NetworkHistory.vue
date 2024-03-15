<template>
  <v-btn-group density="compact" theme="dark" variant="tonal">
    <!-- <v-btn
      :disabled="countBefore <= 0"
      @click="project.networkRevision.oldest()"
      icon="mdi-page-first"
      title="load oldest network"
    /> -->

    <v-btn
      :disabled="countBefore <= 0"
      @click="project.networkRevision.older()"
      stacked
      title="load older network"
    >
      <v-badge
        :content="countBefore"
        :offset-y="countBefore > 0 ? -2 : -18"
        color="blue"
        location="bottom right"
        offset-x="-8"
      >
        <v-icon>mdi-undo-variant</v-icon>
      </v-badge>
    </v-btn>

    <v-btn
      :disabled="countAfter <= 0"
      @click="project.networkRevision.newer()"
      stacked
      title="load newer network"
    >
      <v-badge
        :content="countAfter"
        :offset-y="countAfter > 0 ? -2 : -18"
        color="blue"
        location="bottom right"
        offset-x="-8"
      >
        <v-icon>mdi-redo-variant</v-icon>
      </v-badge>
    </v-btn>

    <!-- <v-btn
      :disabled="countAfter <= 0"
      @click="project.networkRevision.newest()"
      icon="mdi-page-last"
      title="load newest network"
    /> -->
  </v-btn-group>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { TProject, TProjectProps } from "@/types/projectTypes";

const props = defineProps({ project: TProjectProps });
const project = computed(() => props.project as TProject);

/**
 * Count networks before the current.
 */
const countBefore = computed(
  (): number => project.value.networkRevision.revisionIdx
);

/**
 * Count networks after the current.
 */
const countAfter = computed(
  (): number =>
    project.value.networkRevision.revisions.length -
    project.value.networkRevision.revisionIdx -
    1
);
</script>
