<template>
  <div class="activityStats">
    <v-card flat tile>
      <!-- <v-subheader v-text="'Activity statistics'" /> -->

      <v-expansion-panels
        v-model="projectView.state.project.state.activityStatsPanelId"
        accordion
        flat
        tile
        class="pa-1"
      >
        <v-expansion-panel
          :disabled="!activity.hasEvents()"
          :key="index"
          class="my-1"
          v-for="(activity, index) in projectView.state.project.activities"
        >
          <v-expansion-panel-header>
            <v-sheet :color="activity.recorder.view.color" outlined>
              <v-card class="pa-0 ml-1" flat outlined tile width="100%">
                <v-btn
                  :color="activity.recorder.view.color"
                  :dark="projectView.config.coloredToolbar"
                  :height="48"
                  :ripple="false"
                  :text="!projectView.config.coloredToolbar"
                  block
                  depressed
                  tile
                >
                  <v-row>
                    <v-col cols="3" v-text="activity.recorder.view.label" />
                    <v-col cols="9" v-text="activity.recorder.model.label" />
                  </v-row>
                </v-btn>
              </v-card>
            </v-sheet>

            <template #actions>
              <v-icon
                :color="activity.recorder.view.color"
                class="mx-3"
                v-text="'$expand'"
              />
            </template>
          </v-expansion-panel-header>

          <v-expansion-panel-content
            :key="projectView.state.project.code.hash"
            v-if="activity.hasEvents()"
          >
            <v-sheet :color="activity.recorder.view.color" outlined>
              <v-card class="ml-1" flat outlined tile>
                <ActivityStatsSpike
                  :activity="activity"
                  v-if="activity.recorder.modelId === 'spike_recorder'"
                />
                <ActivityStatsAnalog
                  :activity="activity"
                  v-if="activity.recorder.modelId !== 'spike_recorder'"
                />
              </v-card>
            </v-sheet>
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
  padding: 0;
}
.activityStats .v-expansion-panel > .v-expansion-panel-header,
.activityStats .v-expansion-panel--active > .v-expansion-panel-header {
  padding: 0;
  min-height: 40px;
}
.activityStats .v-expansion-panel .v-sheet {
  border-width: 0;
}
.activityStats .v-expansion-panel .v-card {
  border-width: 0;
}
.activityStats .v-expansion-panel {
  border: 1px solid #e0e0e0;
  border-width: 1px 1px 1px 0;
}
</style>
