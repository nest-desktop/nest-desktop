<template>
  <v-chip
    :color="nodeRecord.state.color || ''"
    :title="nodeRecord.title"
    @click.prevent
    @click.stop
    class="nodeRecordChip"
    label
    size="small"
    v-if="nodeRecord.state"
  >
    <v-menu
      :close-on-content-click="false"
      activator="parent"
      transition="slide-y-transition"
    >
      <v-card>
        <ColorPicker
          :colorScheme
          hide-inputs
          @update:model-value="updateRecordsColor()"
          v-model="nodeRecord.state.color"
        />

        <v-card-actions>
          <v-select
            :items="colorSchemes"
            class="mx-2"
            density="compact"
            hide-details
            v-model="colorScheme"
          />
          <v-btn @click="resetColor" size="small" text="reset" />
        </v-card-actions>
      </v-card>
    </v-menu>

    {{ nodeRecord.groupId }}
    {{ nodeRecord.uuid.slice(0, 6) }}
  </v-chip>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref } from "vue";

import { NodeRecord } from "@/helpers/node/nodeRecord";
import ColorPicker from "../common/ColorPicker.vue";

const props = defineProps<{ nodeRecord: NodeRecord }>();
const nodeRecord = computed(() => props.nodeRecord);

const colorScheme = ref("category10");

const colorSchemes = [
  "all",
  "category10",
  "category20",
  "paired",
  "set1",
  "set2",
  "set3",
  "tableau10",
  "google10c",
  "google20c",
];

/**
 * Reset node color.
 */
const resetColor = () => {
  nodeRecord.value.state.color = "";
  nodeRecord.value.node.changes();
  updateRecordsColor();
};

/**
 * Triggers when record color is changed.
 */
const updateRecordsColor = () => {
  nextTick(() =>
    nodeRecord.value.node.network.project.activityGraph.activityChartGraph.updateRecordsColor()
  );
};
</script>

<style lang="scss">
.nodeRecordChip {
  margin: 0 1px;
}
</style>
