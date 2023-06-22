<template>
  <v-data-table-virtual
    :headers="headers as any[]"
    :height="props.height"
    :items="state.items"
    :key="state.activityHash"
    :loading="state.loading"
    class="activityStatsSpike"
    density="compact"
    fixed-header
    loading-text="Loading... Please wait"
  >
    <template #item.meanISI="{ item }">
      {{ toFixed(item.columns.meanISI) }}
    </template>
    <template #item.stdISI="{ item }">
      {{ toFixed(item.columns.stdISI) }}
    </template>
    <template #item.cvISI="{ item }">
      {{ toFixed(item.columns.cvISI) }}
    </template>
    <template #bottom>
      <div class="wrapper-table">
        <table class="mx-1 py-2">
          <tr>
            <td :key="idx" v-for="(header, idx) in headers">
              <div v-if="header.key === 'id'">Total</div>
              <div v-else-if="header.key === 'count'">
                <span>&#931;</span>
                = {{ colSum(header.key) }}
              </div>
              <div v-else>
                <span>&#956;</span>
                = {{ toFixed(colMean(header.key)) }}
              </div>
            </td>
          </tr>
        </table>
      </div>
    </template>
  </v-data-table-virtual>
</template>

<script lang="ts" setup>
import { onMounted, reactive, watch } from "vue";

import { deviation, diff, mean, sum } from "@/utils/array";
import { SpikeActivity } from "@/nest/core/activity/spikeActivity";

import { toFixed } from "@/utils/converter";

const props = defineProps({
  activity: SpikeActivity,
  height: { default: 500, type: Number },
});

const state = reactive({
  activity: props.activity as SpikeActivity,
  activityHash: "",
  items: [] as { [key: string]: number | string }[],
  itemsPerPage: 20,
  loading: false,
  search: "",
});

const headers = [
  {
    title: "ID",
    align: "start",
    key: "id",
  },
  { title: "Spike count", key: "count" },
  { title: "mean (ISI)", key: "meanISI" },
  { title: "std (ISI)", key: "stdISI" },
  { title: "cv (ISI)", key: "cvISI" },
];

/**
 * Update stats of spike activity.
 */
const update = () => {
  // console.log("Update stats of spike activity");
  state.loading = true;
  state.items = [];
  if (state.activity && state.activity.nodeIds.length > 0) {
    const times: any[] = Object.create(null);
    state.activity.nodeIds.forEach((id: number) => {
      times[id] = [];
    });
    state.activity.events.senders.forEach((sender: number, idx: number) => {
      times[sender].push(state.activity.events.times[idx]);
    });
    state.items = state.activity.nodeIds.map((id) => {
      let spikeTimes: number[] = times[id];
      let isi: number[] = [];
      let meanISI = NaN,
        stdISI = NaN,
        cvISI = NaN;
      if (spikeTimes.length > 1) {
        spikeTimes = spikeTimes.sort((a: number, b: number) => a - b);
        isi = diff(spikeTimes);
        meanISI = isi.length > 0 ? mean(isi) : NaN;
        stdISI = isi.length > 0 ? deviation(isi) : NaN;
        if (!isNaN(meanISI) && !isNaN(stdISI)) {
          cvISI = stdISI / meanISI;
        }
      }
      return {
        id,
        count: spikeTimes.length,
        meanISI,
        stdISI,
        cvISI,
      };
    });
  }
  state.activityHash = state.activity.hash;
  state.loading = false;
};

const colSum = (key: string): number => {
  return sum(state.items.map((item: any) => item[key]));
};

const colMean = (key: string): number => {
  return mean(state.items.map((item: any) => item[key]));
};

onMounted(() => {
  state.activity = props.activity as SpikeActivity;
  update();
});

watch(
  () => props.activity?.hash,
  () => update()
);
</script>

<style lang="scss">
.wrapper-table {
  table {
    width: 100%;
  }
}
</style>
