<template>
  <div class="activityStatsViewer">
    <v-toolbar color="transparent" density="compact" title="Activity stats">
      <v-spacer />

      <v-icon class="ma-auto" icon="mdi:mdi-format-color-fill" />

      <v-btn-toggle
        @update:model-value="update()"
        class="mx-2"
        density="compact"
        v-model="
          activities.project.activityGraph.activityChartGraph.state.traceColor
        "
      >
        <v-btn
          :key="index"
          :text="traceColor"
          :value="traceColor"
          size="small"
          v-for="(traceColor, index) in traceColors"
        />
      </v-btn-toggle>
    </v-toolbar>

    <v-layout class="activityStats ml-1" full-height v-resize="onResize">
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
              {{ activity.recorder.model.state.label }}
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
                state.height - (activity.recorder.model.isMultimeter ? 40 : 0)
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
import NodeAvatar from "../node/avatar/NodeAvatar.vue";
import { Activities } from "@/helpers/activity/activities";
import { AnalogSignalActivity } from "@/helpers/activity/analogSignalActivity";
import { SpikeActivity } from "@/helpers/activity/spikeActivity";
import { nextTick } from "vue";

const props = defineProps<{ activities: Activities }>();
const activities = computed(() => props.activities);

const state = reactive<{ height: number }>({
  height: 700,
});

const traceColors = ["node", "record", "trace"];

const onResize = () => {
  state.height =
    window.innerHeight -
    24 - // system bar
    48 - // project bar
    48 - // toolbar
    64 - // current expansion title panel
    (activities.value.all.length - 1) * 48 - // other expansion title panel
    42; // data table footer
};

const update = () =>
  // panel: ActivityChartPanel
  {
    nextTick(() => {
      // panel.model.init();
      activities.value.project.activityGraph.activityChartGraph.update();
    });
  };
</script>
