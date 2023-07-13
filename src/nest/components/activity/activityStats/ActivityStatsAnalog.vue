<template>
  <v-data-table-virtual
    :headers="headers as any[]"
    :height="props.height"
    :items="state.items"
    :key="state.activityHash"
    :loading="state.loading"
    class="activityStatsAnalog"
    density="compact"
    fixed-header
    loadingText="Loading... Please wait"
    show-select
    v-model="state.activity.state.selected"
    @update:model-value="() => state.activity.chartGraph?.update()"
  >
    <template #top>
      <v-select
        :items="state.activity.state.records"
        @change="update"
        density="compact"
        hide-details
        item-value="id"
        item-title="id"
        return-object
        rounded="0"
        v-model="state.selectedRecord"
      >
        <template #selection="{ item }">
          <v-chip
            :color="item.value.color"
            class="mx-2"
            label
            variant="outlined"
            size="small"
          >
            {{ item.title }}
          </v-chip>
          <div style="font-size: 12px">
            <span>{{ item.value.label }}</span>
            <span v-if="item.value.unit"> ({{ item.value.unit }})</span>
          </div>
        </template>

        <template #item="{ item }">
          <div>
            <v-chip
              :color="item.value.color"
              class="mx-2"
              label
              variant="outlined"
              size="small"
            >
              {{ item.title }}
            </v-chip>
            <div style="font-size: 12px">
              <span> {{ item.value.label }}</span>
              <span v-if="item.value.unit"> ({{ item.value.unit }}) </span>
            </div>
          </div>
        </template>
      </v-select>
    </template>

    <!-- <template #item="{ item }">
      <tr
        :class="{
          active: isActive(item.value),
        }"
        :key="item.value"
        @mouseout="activeLineGraph()"
        @mouseover="activeLineGraph(item.value)"
        style="cursor: pointer"
      >
        <td>{{ item.columns.id }}</td>
        <td>{{ toFixed(item.columns.mean) }}</td>
        <td>{{ toFixed(item.columns.std) }}</td>
      </tr>
    </template> -->

    <template #item.mean="{ item }">
      {{ toFixed(item.columns.mean) }}
    </template>
    <template #item.std="{ item }">
      {{ toFixed(item.columns.std) }}
    </template>

    <template #bottom>
      <div class="wrapper-table">
        <table>
          <tr>
            <td :key="idx" v-for="(header, idx) in headers">
              <div v-if="header.key === 'id'">Total</div>
              <div v-else-if="['mean', 'std'].includes(header.key)">
                <span>&#956;</span>
                = {{ toFixed(colMean(header.key)) }}
              </div>
              <div v-else />
            </td>
          </tr>
        </table>
      </div>
    </template>
  </v-data-table-virtual>
</template>

<script lang="ts" setup>
import { onMounted, reactive, watch } from "vue";
import { deviation, mean } from "@/utils/array";
import { toFixed } from "@/utils/converter";

import { AnalogSignalActivity } from "@nest/core/activity/analogSignalActivity";
import { NodeRecord } from "@nest/core/node/nodeRecord";

const props = defineProps({
  activity: AnalogSignalActivity,
  height: { default: 500, type: Number },
});

const state = reactive({
  activity: props.activity as AnalogSignalActivity,
  activityHash: "",
  items: [] as { [key: string]: number | string }[],
  loading: false,
  search: "",
  // @ts-ignore
  selectedRecord: undefined as NodeRecord,
});

const headers = [
  {
    title: "ID",
    align: "start",
    key: "id",
  },
  { title: "Mean", key: "mean" },
  { title: "Std", key: "std" },
];

// const activeLineGraph = (nodeId?: number) => {
//   state.activity.state.activeNodeId =
//     state.activity.state.activeNodeId == nodeId ? undefined : nodeId;
//   state.activity.chartGraph?.panels.forEach((panel) =>
//     panel.model.updateActiveMarker(state.selectedRecord as NodeRecord)
//   );
//   state.activity.chartGraph?.react();
// };

// const isActive = (nodeId: number) => {
//   return state.activity.state.activeNodeId === nodeId;
// };

/**
 * Update stats of analog activity.
 */
const update = () => {
  console.log("Update stats of analog activity");
  state.loading = true;
  state.items = [];

  if (!state.selectedRecord && state.activity.state.records.length > 0) {
    state.selectedRecord = state.activity.state.records[0] as NodeRecord;
  }

  if (state.activity && state.selectedRecord) {
    const activityData: any[] = state.activity.events[state.selectedRecord.id];
    const data: any[] = Object.create(null);
    state.activity.nodeIds.forEach((id) => (data[id] = []));
    state.activity.events.senders.forEach((sender: number, idx: number) => {
      data[sender].push(activityData[idx]);
    });
    state.items = state.activity.nodeIds.map((id) => {
      const d: any = data[id];
      return {
        id,
        mean: d.length > 0 ? mean(d) : NaN,
        std: d.length > 0 ? deviation(d) : NaN,
      };
    });
  }
  state.activityHash = state.activity.state.hash;
  state.loading = false;
};

const colMean = (key: string) => {
  return mean(state.items.map((item) => item[key]) as number[]);
};

onMounted(() => {
  state.activity = props.activity as AnalogSignalActivity;
  update();
});

watch(
  () => props.activity?.state.hash,
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
