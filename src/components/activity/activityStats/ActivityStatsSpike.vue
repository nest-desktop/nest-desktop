<template>
  <div
    class="activityStatsSpike"
    v-if="state.activity && state.activity.hash === state.activityHash"
  >
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
        :items-per-page="15"
        :items="state.items"
        :loading="state.loading"
        dense
        fixed-header
        loading-text="Loading... Please wait"
        sort-by="id"
      >
        <template #[`body.append`]="{ headers }">
          <tr>
            <td :key="idx" v-for="(header, idx) in headers">
              <div v-if="header.value === 'id'" v-text="'All'" />
              <div v-else-if="header.value === 'count'">
                <span>&#931;</span>
                = {{ sum(header.value) }}
              </div>
              <div v-else>
                <span>&#956;</span>
                = {{ mean(header.value) }}
              </div>
            </td>
          </tr>
        </template>
      </v-data-table>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { onMounted, reactive, watch } from '@vue/composition-api';
import * as d3 from 'd3';

import { Activity } from '@/core/activity/activity';

export default Vue.extend({
  name: 'ActivityStatsSpike',
  props: {
    activity: Activity,
  },
  setup(props) {
    const state = reactive({
      activity: undefined as Activity | undefined,
      activityHash: '',
      headers: [
        {
          text: 'ID',
          align: 'start',
          value: 'id',
        },
        { text: 'Count', value: 'count' },
        { text: 'ISI mean (ms)', value: 'meanISI' },
        { text: 'ISI std (ms)', value: 'stdISI' },
        { text: 'CV (ISI)', value: 'cvISI' },
      ],
      items: [],
      loading: false,
      search: '',
    });

    /**
     * Calculate difference of values in an array.
     */
    const diff = (data: any[]) => {
      if (data.length <= 1) {
        return [0];
      }
      const values = [];
      for (let ii = 0; ii < data.length - 1; ii++) {
        values.push(data[ii + 1] - data[ii]);
      }
      return values;
    };

    /**
     * Update stats of spike activity.
     */
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

      if (state.activity != undefined) {
        state.loading = true;
        const times: any[] = Object.create(null);
        state.activity.nodeIds.forEach((id: number) => {
          times[id] = [];
        });
        state.activity.events.senders.forEach((sender: number, idx: number) => {
          times[sender].push(state.activity.events.times[idx]);
        });
        state.items = state.activity.nodeIds.map(id => {
          let spikeTimes: number[] = times[id];
          let isi: number[] = [];
          let isiMean = NaN,
            isiStd = NaN;
          if (spikeTimes.length > 1) {
            spikeTimes = spikeTimes.sort((a: number, b: number) => a - b);
            isi = diff(spikeTimes);
            isiMean = isi.length > 0 ? d3.mean(isi) : NaN;
            isiStd = isi.length > 0 ? d3.deviation(isi) : NaN;
          }
          return {
            id,
            count: spikeTimes.length,
            meanISI: !isNaN(isiMean) ? isiMean.toFixed(2) : NaN,
            stdISI: !isNaN(isiStd) ? isiStd.toFixed(2) : NaN,
            cvISI:
              !isNaN(isiMean) && !isNaN(isiStd)
                ? (isiStd / isiMean).toFixed(2)
                : NaN,
          };
        });
        state.activityHash = state.activity.hash;
        state.loading = false;
      }
    };

    const sum = (key: string) => {
      return d3.sum(state.items.map(item => item[key]));
    };

    const mean = (key: string) => {
      const mean: number = d3.mean(state.items.map(item => item[key]));
      return mean != null ? mean.toFixed(2) : NaN;
    };

    onMounted(() => {
      state.activity = props.activity as Activity;
      update();
    });

    watch(
      () => props.activity,
      () => update()
    );

    return { mean, state, sum };
  },
});
</script>
