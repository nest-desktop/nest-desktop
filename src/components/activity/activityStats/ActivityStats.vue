<template>
  <div class="activityStatsViewer">
    <v-toolbar color="transparent" density="compact">
      <v-toolbar-title>Activity stats</v-toolbar-title>
    </v-toolbar>

    <v-layout class="activityStats ml-1" full-height v-resize="onResize">
      <!-- <v-subheader v-text="'Activity statistics'" /> -->
      <v-expansion-panels
        mandatory
        v-model="activities.state.activityStatsPanelId"
        variant="accordion"
      >
        <v-expansion-panel
          :key="index"
          v-for="(activity, index) in activities.all"
        >
          <v-expansion-panel-title class="py-0">
            <v-row class="text-button">
              <NodeAvatar :node="activity.recorder" />
              <v-spacer />
              {{ activity.recorder.model.label }}
              <v-spacer />
            </v-row>
          </v-expansion-panel-title>

          <v-expansion-panel-text :key="activities.hash" class="ma-0 pa-0">
            <ActivityStatsSpike
              :activity="activity as SpikeActivity"
              :height="state.height"
              v-if="activity.recorder.model.isSpikeRecorder"
            />

            <ActivityStatsAnalog
              :activity="activity as AnalogSignalActivity"
              :height="
                state.height - (activity.recorder.model.isMultimeter ? 60 : 0)
              "
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

import ActivityStatsAnalog from "./ActivityStatsAnalog.vue";
import ActivityStatsSpike from "./ActivityStatsSpike.vue";
import NodeAvatar from "@/components/node/avatar/NodeAvatar.vue";
import { Activities } from "@/helpers/activity/activities";
import { AnalogSignalActivity } from "@/helpers/activity/analogSignalActivity";
import { SpikeActivity } from "@/helpers/activity/spikeActivity";

const props = defineProps<{ activities: Activities }>();
const activities = computed(() => props.activities);

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
    (activities.value.all.length - 1) * 48; // other closed expansion panel
};
</script>

<style lang="scss">
.activityStats {
  .v-expansion-panel-text__wrapper {
    padding: 8px 0 0 0;
  }
}
</style>
