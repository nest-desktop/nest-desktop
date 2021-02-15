<template>
  <div class="activitySpikeStats">
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

<script>
import Vue from 'vue';
import { onMounted, reactive } from '@vue/composition-api';
import * as d3 from 'd3';

import { Activity } from '@/core/activity/activity';

export default Vue.extend({
  name: 'ActivitySpikeStats',
  props: {
    activity: Activity,
  },
  setup(props) {
    const state = reactive({
      activity: undefined,
      headers: [
        {
          text: 'ID',
          align: 'start',
          value: 'id',
        },
        { text: 'Count', value: 'count' },
        { text: 'ISI mean', value: 'meanISI' },
        { text: 'ISI std', value: 'stdISI' },
        { text: 'CV(ISI)', value: 'cvISI' },
      ],
      items: [],
      search: '',
    });

    const diff = data => {
      if (data.length <= 1) {
        return [0];
      }
      const values = [];
      for (let ii = 0; ii < data.length - 1; ii++) {
        values.push(data[ii + 1] - data[ii]);
      }
      return values;
    };

    const update = () => {
      state.items = [];
      state.headers = [
        {
          text: 'ID',
          align: 'start',
          value: 'id',
        },
        { text: 'Spikes', value: 'count' },
        { text: 'ISI mean', value: 'meanISI' },
        { text: 'ISI std', value: 'stdISI' },
        { text: 'CV (ISI)', value: 'cvISI' },
      ];

      const times = Object.create(null);
      state.activity.nodeIds.forEach(id => (times[id] = []));
      state.activity.events.senders.forEach((sender, idx) => {
        times[sender].push(state.activity.events.times[idx]);
      });
      state.items = state.activity.nodeIds.map(id => {
        const timesSorted = times[id].sort((a, b) => a - b);
        const isi = diff(timesSorted);
        const isiMean = isi.length > 1 ? d3.mean(isi).toFixed(2) : 0;
        const isiStd = isi.length > 1 ? d3.deviation(isi).toFixed(2) : 0;
        return {
          id,
          count: timesSorted.length,
          meanISI: isiMean,
          stdISI: isiStd,
          cvISI: isiMean > 0 ? (isiStd / isiMean).toFixed(2) : 0,
        };
      });
    };

    // const sum = element => {
    //   const data = this.dataSource.filteredData;
    //   return data.map(t => t[element]).reduce((acc, value) => acc + value, 0);
    // };
    //
    // const mean = element => {
    //   const data = this.dataSource.filteredData;
    //   return (
    //     data.map(t => t[element]).reduce((acc, value) => acc + value, 0) /
    //     data.length
    //   );
    // };

    onMounted(() => {
      state.activity = props.activity;
      update();
    });

    return { state };
  },
});
</script>
