<template>
  <div class="activityStats">
    <v-card class="ma-2px" flat tile>
      <!-- <v-subheader v-text="'Activity statistics'" /> -->

      <v-expansion-panels
        accordion
        flat
        v-model="projectView.state.project.state.activityStatsPanelId"
      >
        <v-expansion-panel
          :disabled="!activity.hasEvents()"
          :key="index"
          v-for="(activity, index) in projectView.state.project.activities"
        >
          <v-expansion-panel-header>
            <v-card flat tile>
              <v-sheet :color="activity.recorder.view.color">
                <v-card class="ml-1" flat tile>
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
            </v-card>

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
            <v-card flat tile>
              <v-sheet :color="activity.recorder.view.color">
                <v-card class="ml-1" flat tile>
                  <ActivityStatsSpike
                    :activity="activity"
                    v-if="activity.recorder.model.isSpikeRecorder()"
                  />
                  <ActivityStatsAnalog
                    :activity="activity"
                    v-if="activity.recorder.model.isAnalogRecorder()"
                  />
                </v-card>
              </v-sheet>
            </v-card>
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
.activityStats .v-expansion-panel {
  margin: 1px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  border-top: 1px solid rgba(0, 0, 0, 0.12);
}

.activityStats .v-expansion-panel-content__wrap {
  padding: 0;
}
.activityStats .v-expansion-panel > .v-expansion-panel-header,
.activityStats .v-expansion-panel--active > .v-expansion-panel-header {
  padding: 0;
  min-height: 40px;
}
</style>
