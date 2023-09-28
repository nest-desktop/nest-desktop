<template>
  <div class="activityStatsViewer">
    <v-toolbar color="transparent" density="compact">
      <v-toolbar-title> Activity stats </v-toolbar-title>
    </v-toolbar>

    <v-layout class="activityStats ml-1" full-height v-resize="onResize">
      <!-- <v-subheader v-text="'Activity statistics'" /> -->
      <v-expansion-panels
        mandatory
        v-model="project.state.activityStatsPanelId"
        variant="accordion"
      >
        <v-expansion-panel
          :key="index"
          v-for="(activity, index) in project.activities.all"
        >
          <v-expansion-panel-title class="py-0">
            <v-row class="text-button">
              <node-avatar :node="activity.recorder" />
              <v-spacer />
              <div>
                {{ activity.recorder.model.label }}
              </div>
              <v-spacer />
            </v-row>
          </v-expansion-panel-title>

          <v-expansion-panel-text
            :key="project.simulation.code.state.hash"
            class="ma-0 pa-0"
          >
            <activity-stats-spike
              :activity="activity as SpikeActivity"
              :height="state.height"
              v-if="activity.recorder.model.isSpikeRecorder"
            />

            <activity-stats-analog
              :activity="activity as AnalogSignalActivity"
              :height="state.height - 36"
              v-if="activity.recorder.model.isAnalogRecorder"
            />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-layout>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive } from "vue";

import NodeAvatar from "@/components/node/avatar/NodeAvatar.vue";
import { AnalogSignalActivity } from "@/helpers/activity/analogSignalActivity";
import { ProjectPropTypes } from "@/types/projectTypes";
import { SpikeActivity } from "@/helpers/activity/spikeActivity";

import ActivityStatsAnalog from "./ActivityStatsAnalog.vue";
import ActivityStatsSpike from "./ActivityStatsSpike.vue";
import { BaseProject } from "@/helpers/project/baseProject";

const props = defineProps({
  project: ProjectPropTypes,
})

const project = computed(() => props.project as BaseProject);

const state = reactive({
  height: 700,
});

const onResize = () => {
  state.height =
    window.innerHeight -
    24 - // system bar
    48 - // project bar
    52 - // toolbar
    64 - // expansion panel title
    48 - // data table footer
    (project.value.activities.all.length - 1) * 48; // other closed expansion panel
};
</script>

<style lang="scss">
.activityStats {
  .v-expansion-panel-text__wrapper {
    padding: 8px 0 0 0;
  }
}
</style>
