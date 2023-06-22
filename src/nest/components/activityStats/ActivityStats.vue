<template>
  <v-layout class="activityStats ml-1" full-height v-resize="onResize">
    <!-- <v-subheader v-text="'Activity statistics'" /> -->
    <v-expansion-panels
      mandatory
      v-model="projectStore.project.state.activityStatsPanelId"
      variant="accordion"
    >
      <v-expansion-panel
        :key="index"
        v-for="(activity, index) in projectStore.project.activities.all"
      >
        <v-expansion-panel-title class="py-0">
          <v-row class="text-button">
            <node-avatar
              :color="activity.recorder.color"
              :label="activity.recorder.label"
              :elementType="activity.recorder.elementType"
              :weight="activity.recorder.weight"
            />
            <v-spacer />
            <div>
              {{ activity.recorder.model.label }}
            </div>
            <v-spacer />
          </v-row>

          <!-- <template #actions>
            <v-icon
              :color="nodeColor(activity as Activity)"
              class="mx-3"
              icon="$expand"
            />
          </template> -->
        </v-expansion-panel-title>

        <v-expansion-panel-text
          :key="projectStore.project.simulation.code.state.hash"
          class="ma-0 pa-0"
        >
          <ActivityStatsSpike
            :activity="activity as SpikeActivity"
            :height="state.height"
            v-if="activity.recorder.model.isSpikeRecorder"
          />
          <ActivityStatsAnalog
            :activity="activity as AnalogSignalActivity"
            :height="state.height"
            v-if="activity.recorder.model.isAnalogRecorder"
          />
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-layout>
</template>

<script lang="ts" setup>
import { reactive } from "vue";
import ActivityStatsAnalog from "./ActivityStatsAnalog.vue";
import ActivityStatsSpike from "./ActivityStatsSpike.vue";
import NodeAvatar from "../avatar/NodeAvatar.vue";
import { AnalogSignalActivity } from "@/nest/core/activity/analogSignalActivity";
import { SpikeActivity } from "@/nest/core/activity/spikeActivity";
import { useProjectStore } from "@/nest/store/project/projectStore";

const projectStore = useProjectStore();

const state = reactive({
  height: 700,
});

const onResize = () => {
  state.height =
    window.innerHeight -
    24 - // system bar
    48 - // project bar
    64 - // expansion panel title
    48 - // data table footer
    (projectStore.project.activities.all.length - 1) * 48; // other closed expansion panel
};
</script>

<style lang="scss">
.activityStats {
  .v-expansion-panel-text__wrapper {
    padding: 8px 0 0 0;
  }
}
</style>
