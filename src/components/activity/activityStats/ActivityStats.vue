<template>
  <div class="activityStats">
    <v-card flat tile>
      <!-- <v-subheader v-text="'Activity statistics'" /> -->

      <v-expansion-panels
        v-model="projectView.state.project.state.activityStatsPanelId"
        accordion
        tile
        class="pa-1"
      >
        <v-expansion-panel
          :disabled="!activity.hasEvents()"
          :key="index"
          :style="{
            borderLeft: '4px solid ' + activity.recorder.view.color,
          }"
          v-for="(activity, index) in projectView.state.project.activities"
        >
          <v-expansion-panel-header
            :color="
              projectView.config.coloredToolbar
                ? activity.recorder.view.color
                : 'white'
            "
            class="pa-0"
          >
            <v-btn
              :color="activity.recorder.view.color"
              :dark="projectView.config.coloredToolbar"
              :height="40"
              :ripple="false"
              :text="!projectView.config.coloredToolbar"
              tile
            >
              <v-row>
                <v-col cols="3" v-text="activity.recorder.view.label" />
                <v-col cols="9" v-text="activity.recorder.model.label" />
              </v-row>
            </v-btn>
            <template #actions>
              <v-icon
                :color="
                  projectView.config.coloredToolbar
                    ? 'white'
                    : activity.recorder.view.color
                "
                class="mx-3"
                v-text="'$expand'"
              />
            </template>
          </v-expansion-panel-header>

          <v-expansion-panel-content
            :key="projectView.state.project.code.hash"
            class="px-0"
            v-if="activity.hasEvents()"
          >
            <ActivityStatsSpike
              :activity="activity"
              v-if="activity.recorder.modelId === 'spike_recorder'"
            />
            <ActivityStatsAnalog
              :activity="activity"
              v-if="activity.recorder.modelId !== 'spike_recorder'"
            />
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import core from '@/core';
import ActivityStatsAnalog from '@/components/activity/activityStats/ActivityStatsAnalog.vue';
import ActivityStatsSpike from '@/components/activity/activityStats/ActivityStatsSpike.vue';

export default Vue.extend({
  name: 'ActivityStats',
  components: {
    ActivityStatsAnalog,
    ActivityStatsSpike,
  },
  setup() {
    const projectView = core.app.project.view;
    return { projectView };
  },
});
</script>

<style>
.activityStats .v-expansion-panel-content__wrap {
  padding: 0 0 16px;
}

.activityStats .v-expansion-panel-content__wrap {
  padding: 0 0 16px;
}
.activityStats .v-expansion-panel > .v-expansion-panel-header,
.activityStats .v-expansion-panel--active > .v-expansion-panel-header {
  min-height: 40px;
}
</style>
