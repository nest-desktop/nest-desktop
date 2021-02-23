<template>
  <div class="activityAnalogStats">
    <v-card flat tile>
      <!-- <v-card-title>
        <v-text-field
          v-model="state.search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title> -->
      <v-data-table
        :headers="state.headers"
        :items="state.items"
        :items-per-page="15"
        dense
        fixed-header
      />
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { onMounted, reactive } from '@vue/composition-api';
import * as d3 from 'd3';

import { Activity } from '@/core/activity/activity';

export default Vue.extend({
  name: 'ActivityAnalogStats',
  props: {
    activity: Activity,
  },
  setup(props) {
    const state = reactive({
      activity: undefined as Activity | undefined,
      headers: [
        {
          text: 'ID',
          align: 'start',
          value: 'id',
        },
        { text: 'Mean', value: 'mean' },
        { text: 'Std', value: 'std' },
      ],
      items: [],
      search: '',
      selectedRecordFrom: 'V_m',
    });

    /**
     * Update stats of analog activity.
     */
    const update = () => {
      state.items = [];
      if (state.selectedRecordFrom === undefined) {
        return;
      }
      if (state.activity != undefined) {
        const activityData: any[] =
          state.activity.events[state.selectedRecordFrom];
        const data: any[] = Object.create(null);
        state.activity.nodeIds.forEach(id => (data[id] = []));
        state.activity.events.senders.forEach((sender: number, idx: number) => {
          data[sender].push(activityData[idx]);
        });
        state.items = state.activity.nodeIds.map(id => {
          const d: any = data[id];
          return {
            id,
            mean: d.length > 0 ? d3.mean(d).toFixed(2) : 0,
            std: d.length > 0 ? d3.deviation(d).toFixed(2) : 0,
          };
        });
      }
    };

    onMounted(() => {
      state.activity = props.activity as Activity;
      update();
    });

    return { state };
  },
});
</script>
