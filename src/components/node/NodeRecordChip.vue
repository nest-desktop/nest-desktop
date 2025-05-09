<template>
  <v-chip
    v-if="nodeRecord.state"
    :color="nodeRecord.state.color || ''"
    :title="nodeRecord.title"
    class="nodeRecordChip"
    label
    size="small"
    @click.prevent
    @click.stop
  >
    <v-menu :close-on-content-click="false" activator="parent" transition="slide-y-transition">
      <v-card>
        <ColorPicker
          v-model="nodeRecord.state.color"
          :color-scheme
          hide-inputs
          @update:model-value="updateRecordsColor()"
        />

        <v-card-actions>
          <v-select v-model="colorScheme" :items="colorSchemes" class="mx-2" density="compact" hide-details />
          <v-btn size="small" text="reset" @click="resetColor" />
        </v-card-actions>
      </v-card>
    </v-menu>

    {{ nodeRecord.groupId }}
  </v-chip>
</template>

<script setup lang="ts">
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
  "spectral11",
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
  nextTick(() => nodeRecord.value.node.network.project.activityGraph.activityChartGraph.updateRecordsColor());
};
</script>

<style lang="scss">
.nodeRecordChip {
  margin: 0 1px;
}
</style>
