<template>
  <div
    class="activityStatsAnalog"
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
      <v-card-title class="pa-2">
        <v-select
          :items="state.activity.state.records"
          @change="update"
          chips
          dense
          hide-details
          item-value="id"
          return-object
          v-model="state.selectedRecord"
        >
          <template #selection="{ item }">
            <v-chip
              :color="item.color"
              class="mx-2"
              label
              outlined
              small
              v-text="item.id"
            />
            <div style="font-size: 12px">
              <span v-text="item.label" />
              <span v-if="item.unit" v-text="` (${item.unit})`" />
            </div>
          </template>

          <template #item="{ item }">
            <v-chip
              :color="item.color"
              class="mx-2"
              label
              outlined
              small
              v-text="item.id"
            />
            <div style="font-size: 12px">
              <span v-text="item.label" />
              <span v-if="item.unit" v-text="` (${item.unit})`" />
            </div>
          </template>
        </v-select>
      </v-card-title>

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
        <template #body="{ items }">
          <tbody>
            <tr
              :class="{
                active: isActive(item.id),
              }"
              :key="item.id"
              @mouseout="activeLineGraph()"
              @mouseover="activeLineGraph(item.id)"
              style="cursor: pointer"
              v-for="item in items"
            >
              <td>{{ item.id }}</td>
              <td>{{ item.mean }}</td>
              <td>{{ item.std }}</td>
            </tr>
          </tbody>
        </template>

        <template v-if="state.items.length > 1" #[`body.append`]="{ headers }">
          <tr>
            <td :key="idx" v-for="(header, idx) in headers">
              <div v-if="header.value === 'id'" v-text="'All'" />
              <div v-else-if="['mean', 'std'].includes(header.value)">
                <span>&#956;</span>
                = {{ mean(header.value).toFixed(2) }}
              </div>
              <div v-else />
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
  name: 'ActivityStatsAnalog',
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
      selectedRecord: undefined,
    });

    const activeLineGraph = (nodeId: number = undefined) => {
      state.activity.state.activeNodeId =
        state.activity.state.activeNodeId == nodeId ? undefined : nodeId;
      state.activity.chartGraph.panels.forEach(panel =>
        panel.model.updateActiveMarker(state.selectedRecord)
      );
      state.activity.chartGraph.react();
    };

    const isActive = (nodeId: number) => {
      return state.activity.state.activeNodeId === nodeId;
    };

    /**
     * Update stats of analog activity.
     */
    const update = () => {
      state.items = [];
      if (
        state.selectedRecord == null &&
        state.activity.state.records.length > 0
      ) {
        state.selectedRecord = state.activity.state.records[0];
      }
      if (state.activity != undefined) {
        state.loading = true;
        const activityData: any[] =
          state.activity.events[state.selectedRecord.id];
        const data: any[] = Object.create(null);
        state.activity.nodeIds.forEach(id => (data[id] = []));
        state.activity.events.senders.forEach((sender: number, idx: number) => {
          data[sender].push(activityData[idx]);
        });
        state.items = state.activity.nodeIds.map(id => {
          const d: any = data[id];
          return {
            id,
            mean: d.length > 0 ? d3.mean(d).toFixed(2) : NaN,
            std: d.length > 0 ? d3.deviation(d).toFixed(2) : NaN,
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

    return {
      activeLineGraph,
      isActive,
      mean,
      state,
      sum,
      update,
    };
  },
});
</script>
