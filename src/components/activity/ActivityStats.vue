<template>
  <div class="activityStats">
    <span v-if="state.activity === undefined">
      <v-card
        :key="activity.idx"
        @click="state.activity = activity"
        class="ma-1"
        flat
        v-for="activity of state.project.activities"
      >
        <v-btn
          :color="activity.recorder.view.color"
          :disabled="!activity.hasEvents()"
          block
          outlined
          tile
        >
          <v-row>
            <v-col cols="4">
              {{ activity.recorder.view.label }}
            </v-col>
            <v-col cols="8">
              {{ activity.recorder.model.label }}
            </v-col>
          </v-row>
        </v-btn>
      </v-card>
    </span>

    <v-card flat tile v-if="state.activity">
      <v-toolbar
        :color="state.activity.recorder.view.color"
        dark
        dense
        flat
        tile
      >
        <v-btn @click="state.activity = undefined" fab small>
          <v-icon v-text="'mdi-chevron-left'" />
        </v-btn>
        <v-toolbar-title
          class="mx-2"
          v-text="state.activity.recorder.model.label"
        />
      </v-toolbar>

      <v-card-text
        class="pa-1"
        style="height:calc(100vh - 96px); overflow-y:auto"
      >
        <ActivitySpikeStats
          :activity="state.activity"
          v-if="state.activity.recorder.modelId == 'spike_recorder'"
        />
        <ActivityAnalogStats
          :activity="state.activity"
          v-if="state.activity.recorder.modelId != 'spike_recorder'"
        />
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive, watch } from '@vue/composition-api';

import { Activity } from '@/core/activity/activity';
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
      activity: undefined as Activity | undefined,
      project: props.project,
    });

    watch(
      () => props.project,
      () => {
        state.activity = undefined;
        state.project = props.project;
      }
    );

    return { state };
  },
});
</script>
