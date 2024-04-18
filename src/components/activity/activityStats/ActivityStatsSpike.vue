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
      {{ toFixed(Number(item.meanISI)) }}
    </template>
    <template #item.stdISI="{ item }">
      {{ toFixed(Number(item.stdISI)) }}
    </template>
    <template #item.cvISI="{ item }">
      {{ toFixed(Number(item.cvISI)) }}
    </template>
    <template #bottom>
      <div class="pr-4 wrapper-table">
        <table class="py-2">
          <tr>
            <td :key="idx" class="px-2" v-for="(header, idx) in headers">
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
import { computed, onMounted, reactive, watch } from "vue";

import { SpikeActivity } from "@/helpers/activity/spikeActivity";
import { deviation, diff, mean, sum } from "@/helpers/common/array";
import { toFixed } from "@/utils/converter";

const props = defineProps({
  activity: SpikeActivity,
  height: { default: 500, type: Number },
});

const activity = computed(() => props.activity as SpikeActivity);

const state = reactive({
  activityHash: "",
  items: [] as { [key: string]: number }[],
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

const colMean = (key: string): number => {
  return mean(state.items.map((item: { [key: string]: number }) => item[key]));
};

const colSum = (key: string): number => {
  return sum(state.items.map((item: { [key: string]: number }) => item[key]));
};

/**
 * Update stats of spike activity.
 */
const update = () => {
  // console.log("Update stats of spike activity");
  state.loading = true;
  state.items = [];

  if (activity.value && activity.value.nodeIds.length > 0) {
    const times: number[][] = Object.create(null);
    activity.value.nodeIds.forEach((id: number) => {
      times[id] = [] as number[];
    });
    activity.value.events.senders.forEach((sender: number, idx: number) => {
      times[sender].push(activity.value.events.times[idx]);
    });
    state.items = activity.value.nodeIds.map((id: number) => {
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
  state.activityHash = activity.value.hash;
  state.loading = false;
};

onMounted(() => {
  update();
});

watch(
  () => activity.value.hash,
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
