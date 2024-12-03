<template>
  <v-data-table-virtual
    :key="state.activityHash"
    :headers
    :items="state.items"
    :loading="state.loading"
    class="activityStatsAnalog"
    v-model="activity.state.selected"
    density="compact"
    fixed-header
    loading-text="Loading... Please wait"
    show-select
    @update:model-value="updateGraph()"
  >
    <template #top>
      <v-select
        :readonly="activity.recorder.records.length < 2"
        :items="activity.recorder.records"
        chips
        class="mr-1"
        density="compact"
        v-if="activity.recorder.model.isMultimeter"
        hide-details
        v-model="state.selectedRecord"
        item-title="title"
        item-value="id"
        @update:model-value="selected()"
      >
        <template
          #chip="{ item }"
          style="width: 100%"
        >
          {{ item.title }}
          <NodeRecordChip
            v-if="item.raw.groupId"
            :node-record="(activity.getNodeRecord(item.raw.groupId) as NodeRecord)"
            style="position: absolute; right: 4px"
          />
        </template>

        <template #item="{ item, props }">
          <v-list-item
            v-bind="props"
            density="compact"
            title=""
          >
            <v-row no-gutters>
              {{ item.title }}
              <v-spacer />
              <NodeRecordChip
                v-if="item.raw.groupId"
                :node-record="(activity.getNodeRecord(item.raw.groupId) as NodeRecord)"
                class="my-auto"
              />
            </v-row>
          </v-list-item>
        </template>
      </v-select>
    </template>

    <template #item.id="{ item }">
      <span style="color: rgb(var(--v-theme-primary))">{{ item.id }}</span>
    </template>

    <template #item.mean="{ item }">
      <span style="color: rgb(var(--v-theme-primary))">
        {{ toFixed(Number(item.mean)) }}
      </span>
    </template>

    <template #item.std="{ item }">
      <span style="color: rgb(var(--v-theme-primary))">
        {{ toFixed(Number(item.std)) }}
      </span>
    </template>

    <template #item.actions="{ index }">
      <v-menu transition="slide-y-transition">
        <template #activator="{ props }">
          <v-icon
            :color="record.state.traceColors[index]"
            class="me-2"
            icon="mdi:mdi-format-color-fill"
            size="small"
            v-bind="props"
          />
        </template>

        <ColorPicker
          v-model="record.state.traceColors[index]"
          color-scheme="google20c"
          hide-inputs
          @update:model-value="updateRecordsColor()"
        />
      </v-menu>
    </template>

    <template #bottom>
      <div class="pr-4 wrapper-table">
        <table class="py-2">
          <tbody>
            <tr>
              <td style="width: 48px">
                <v-btn
                  icon="mdi:mdi-checkbox-blank-outline"
                  class="ma-0 pa-0"
                  size="x-small"
                  variant="text"
                  @click="unselectAll()"
                />
              </td>
              <td
                v-for="(header, idx) in headers"
                :key="idx"
                class="px-2"
              >
                <div v-if="header.key === 'id'">
                  Total
                </div>
                <div v-else-if="['mean', 'std'].includes(header.key)">
                  <span>&#956;</span>
                  = {{ toFixed(colMean(header.key)) }}
                </div>
                <div v-else />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </v-data-table-virtual>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, reactive, watch } from "vue";

import ColorPicker from "../common/ColorPicker.vue";
import NodeRecordChip from "../node/NodeRecordChip.vue";
import { AnalogSignalActivity } from "@/helpers/activity/analogSignalActivity";
import { NodeRecord } from "@/helpers/node/nodeRecord";
import { deviation, mean } from "@/utils/array";
import { toFixed } from "@/utils/converter";

const props = defineProps<{ activity: AnalogSignalActivity }>();
const activity = computed(() => props.activity);
const record = computed(() => activity.value.recorder.records[0]);

const state = reactive<{
  activityHash: string;
  items: Record<string, number | string>[];
  loading: boolean;
  selectedRecord: string;
}>({
  activityHash: "",
  items: [],
  loading: false,
  selectedRecord: "",
});

const headers = [
  {
    title: "ID",
    key: "id",
  },
  { title: "Mean", key: "mean" },
  { title: "Std", key: "std" },
  { title: "Actions", key: "actions", sortable: false },
];

// const activeLineGraph = (nodeId?: number) => {
//   activity.state.activeNodeId =
//     activity.state.activeNodeId == nodeId ? undefined : nodeId;
//   activity.chartGraph?.panels.forEach((panel) =>
//     panel.model.updateActiveMarker(state.selectedRecord as NodeRecord)
//   );
//   activity.chartGraph?.react();
// };

const colMean = (key: string) => {
  return mean(state.items.map((item) => item[key]) as number[]);
};

// const colorRowItem = (item: Record<string, number | string>) => {
//   const color = record.value.getColor(item.internalItem.index as number);
//   return { style: { color } };
// };

// const isActive = (nodeId: number) => {
//   return activity.state.activeNodeId === nodeId;
// };

const selected = () => {
  nextTick(() => update());
};

const unselectAll = () => {
  activity.value.state.selected = [];
  activity.value.chartGraph.update()
}

/**
 * Update stats of analog activity.
 */
const update = () => {
  state.loading = true;
  state.items = [];

  if (!state.selectedRecord && activity.value.recorder.records.length > 0) {
    state.selectedRecord = record.value.id;
  }

  if (activity.value && state.selectedRecord) {
    const activityData: number[] = activity.value.events[state.selectedRecord];
    const data: number[][] = Object.create(null);
    activity.value.nodeIds.forEach((id) => (data[id] = []));
    activity.value.events.senders.forEach((sender: number, idx: number) => {
      data[sender].push(activityData[idx]);
    });
    state.items = activity.value.nodeIds.map((id: number) => {
      const d: number[] = data[id];
      return {
        id,
        mean: d.length > 0 ? mean(d) : NaN,
        std: d.length > 0 ? deviation(d) : NaN,
      };
    });
  }
  state.activityHash = activity.value.hash;
  state.loading = false;
};

/**
 * Triggers when record color is changed.
 */
const updateRecordsColor = () => {
  nextTick(() => {
    activity.value.chartGraph.updateRecordsColor();
  });
};

/**
 * Triggers when a trace is selected.
 */
const updateGraph = () => {
  nextTick(() => {
    activity.value.state.selected.sort((a: number, b: number) => a - b);
    activity.value.chartGraph.update();
  });
};

onMounted(() => update());

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
