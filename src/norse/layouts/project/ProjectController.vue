<template>
  <div :key="projectStore.controllerView">
    <template v-if="projectStore.controllerView === 'network'">
      <v-toolbar color="transparent" density="compact">
        <v-btn-toggle class="mx-1">
          <icon-btn
            :icon="item.icon"
            :key="index"
            size="x-small"
            v-for="(item, index) in nodeTypes"
          >
            {{ item.title }}
          </icon-btn>
        </v-btn-toggle>
        <v-spacer />
        <v-btn icon="mdi-dots-vertical" size="small" />
      </v-toolbar>

      <network-param-editor />
    </template>

    <template v-else-if="projectStore.controllerView === 'raw'">
      <pre>{{ project.toJSON() }}</pre>
    </template>
    <template v-else-if="projectStore.controllerView === 'kernel'">
      <simulation-kernel-editor />
    </template>
    <template v-else-if="projectStore.controllerView === 'code'">
      <div class="simulationCodeEditor">
        <v-toolbar color="transparent" density="compact">
          <v-btn-toggle color="blue" class="mx-1" multiple>
            <icon-btn
              :icon="item.icon"
              :key="index"
              size="x-small"
              v-for="(item, index) in codeBlocks"
            >
              {{ item.title }}
            </icon-btn>
          </v-btn-toggle>
          <v-spacer />
          <v-btn icon="mdi-download" size="small" />
          <v-btn icon="mdi-dots-vertical" size="small" />
        </v-toolbar>

        <simulation-code-editor />
      </div>
    </template>
    <template v-else-if="projectStore.controllerView === 'activity'">
      <activity-chart-controller />
    </template>
    <template v-else-if="projectStore.controllerView === 'stats'">
      <activity-stats />
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import IconBtn from "@/components/common/IconBtn.vue";

import ActivityChartController from "@norse/components/activity/activityChartGraph/ActivityChartController.vue";
import ActivityStats from "@norse/components/activity/activityStats/ActivityStats.vue";
import NetworkParamEditor from "@norse/components/network/NetworkParamEditor.vue";
import SimulationCodeEditor from "@norse/components/simulation/SimulationCodeEditor.vue";
import SimulationKernelEditor from "@norse/components/simulation/SimulationKernelEditor.vue";
import { Project } from "@norse/core/project/project";

import { useProjectStore } from "@norse/store/project/projectStore";
const projectStore = useProjectStore();
const project = computed(() => projectStore.project as Project);

const codeBlocks = [
  { icon: "mdi-delete-empty", title: "reset" },
  { icon: "mdi-arrow-down", title: "insite" },
  { icon: "mdi-engine-outline", title: "kernel" },
  { icon: "mdi-shape", title: "create" },
  { icon: "nest:network", title: "connect" },
  { icon: "mdi-play", title: "simulate" },
];

const nodeTypes = [
  { icon: "mdi-all-inclusive", title: "all" },
  { icon: "nest:stimulator", title: "stimulator" },
  { icon: "mdi-shape", title: "neuron" },
  { icon: "nest:recorder", title: "recorder" },
];
</script>
