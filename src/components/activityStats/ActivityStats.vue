<template>
  <div class="activityStatsViewer">
    <v-toolbar color="transparent" density="compact" title="Activity stats">
      <v-spacer />

      <v-icon class="ma-auto" icon="mdi:mdi-format-color-fill" />

      <v-btn-toggle
        v-model="activities.project.activityGraph.activityChartGraph.state.traceColor"
        class="mx-2"
        density="compact"
        @update:model-value="update()"
      >
        <v-btn
          v-for="(traceColor, index) in traceColors"
          :key="index"
          :text="traceColor"
          :value="traceColor"
          size="small"
        />
      </v-btn-toggle>
    </v-toolbar>

    <v-layout v-resize="onResize" class="activityStats ml-1" full-height>
      <v-expansion-panels v-model="activities.state.activityStatsPanelId" mandatory variant="accordion">
        <v-expansion-panel v-for="(activity, index) in activities.all" :key="index">
          <v-expansion-panel-title class="py-0">
            <v-row class="text-button">
              <NodeAvatar :node="(activity.recorder as TNode)" />
              <v-spacer />
              {{ activity.recorder.model.state.label }}
              <v-spacer />
            </v-row>
          </v-expansion-panel-title>

          <v-expansion-panel-text :key="activities.hash" class="ma-0 pa-0">
            <ActivityStatsSpike
              v-if="activity.recorder.model.isSpikeRecorder"
              :activity="activity as NodeSpikeActivity"
              :height="state.height"
            />

            <ActivityStatsAnalog
              v-if="activity.recorder.model.isAnalogRecorder"
              :activity="activity as NodeAnalogSignalActivity"
              :height="state.height - (activity.recorder.model.isMultimeter ? 40 : 0)"
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
import { NodeActivities } from "@/helpers/nodeActivity/nodeAactivities";
import { NodeAnalogSignalActivity } from "@/helpers/nodeActivity/nodeAnalogSignalActivity";
import { NodeSpikeActivity } from "@/helpers/nodeActivity/nodeSpikeActivity";
import { TNode } from "@/types";
import { nextTick } from "vue";

const props = defineProps<{ activities: NodeActivities }>();
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
    52; // data table footer
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
