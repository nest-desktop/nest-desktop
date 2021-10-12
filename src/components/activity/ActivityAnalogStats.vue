<template>
  <div
    class="activityAnalogStats"
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
      <v-card-title class="pa-2" v-if="state.activity.recordFrom.length > 1">
        <v-select
          :items="state.activity.recordFrom.map(r => ({ value: r, text: r }))"
          @change="update"
          dense
          hide-details
          v-model="state.selectedRecordFrom"
        />
      </v-card-title>
      <v-data-table
        :headers="state.headers"
        :items="state.items"
        :items-per-page="15"
        :loading="state.loading"
        dense
        fixed-header
        loading-text="Loading... Please wait"
        sort-by="id"
      >
        <template v-if="state.items.length > 1" #[`body.append`]="{ headers }">
          <tr>
            <td v-for="(header, i) in headers" :key="i">
              <div v-if="header.value === 'id'" v-text="'All'" />
              <div v-else>
                <span>&#956;</span>
                = {{ mean(header.value).toFixed(2) }}
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
  name: 'ActivityAnalogStats',
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
        { text: 'Mean', value: 'mean' },
        { text: 'Std', value: 'std' },
      ],
      items: [],
      loading: false,
      search: '',
      selectedRecordFrom: 'V_m',
    });

    /**
     * Update stats of analog activity.
     */
    const update = () => {
      state.items = [];
      if (state.activity.recordFrom.length === 1) {
        state.selectedRecordFrom = state.activity.recordFrom[0] as string;
      }
      if (state.selectedRecordFrom === undefined) {
        return;
      }
      if (state.activity != undefined) {
        state.loading = true;
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
            mean: d.length === 0 ? NaN : d3.mean(d).toFixed(2),
            std: d.length === 0 ? NaN : d3.deviation(d).toFixed(2),
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
      return d3.mean(state.items.map(item => item[key]));
    };

    onMounted(() => {
      state.activity = props.activity as Activity;
      update();
    });

    watch(
      () => props.activity,
      () => update()
    );

    return { mean, state, sum, update };
  },
});
</script>
