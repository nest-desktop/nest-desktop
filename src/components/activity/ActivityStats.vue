<template>
  <div class="activityStats">
    <v-card flat tile>
      <!-- <v-subheader v-text="'Activity statistics'" /> -->

      <v-expansion-panels
        accordion
        flat
        hover
        tile
        v-model="state.project.view.activityStatsPanelId"
      >
        <v-expansion-panel
          :disabled="!activity.hasEvents()"
          :key="index"
          :style="{
            borderLeft: '4px solid ' + activity.recorder.view.color,
          }"
          class="mb-1"
          v-for="(activity, index) in state.project.activities"
        >
          <v-expansion-panel-header
            :color="activity.recorder.view.color"
            class="pa-0"
          >
            <v-btn :height="40" :ripple="false" class="py-0" dark text tile>
              <v-row>
                <v-col cols="3" v-text="activity.recorder.view.label" />
                <v-col cols="9" v-text="activity.recorder.model.label" />
              </v-row>
            </v-btn>
            <template #actions>
              <v-icon class="mx-3" color="white" v-text="'$expand'" />
            </template>
          </v-expansion-panel-header>

          <v-expansion-panel-content
            :key="state.project.code.hash"
            class="px-0"
            v-if="activity.hasEvents()"
          >
            <ActivitySpikeStats
              :activity="activity"
              v-if="activity.recorder.modelId == 'spike_recorder'"
            />
            <ActivityAnalogStats
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
import { reactive, watch } from '@vue/composition-api';

import { Project } from '@/core/project/project';
import ActivityAnalogStats from '@/components/activity/ActivityAnalogStats.vue';
import ActivitySpikeStats from '@/components/activity/ActivitySpikeStats.vue';

export default Vue.extend({
  name: 'ActivityStats',
  components: {
    ActivityAnalogStats,
    ActivitySpikeStats,
  },
  props: {
    project: Project,
  },
  setup(props) {
    const state = reactive({
      project: props.project,
    });

    watch(
      () => props.project,
      () => {
        state.project = props.project;
      }
    );

    return { state };
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
