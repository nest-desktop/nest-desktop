<template>
  <v-toolbar :title="panel.model.label" class="px-1" color="transparent" density="compact">
    <template #prepend>
      <v-icon :icon="panel.model.icon" />
    </template>

    <template #append>
      <v-btn-group class="py-2" style="height: 100%">
        <v-btn
          :icon="panel.state.visible ? 'mdi:mdi-eye' : 'mdi:mdi-eye-off'"
          size="x-small"
          @click="panel.toggleVisible()"
        />
        <v-btn icon="mdi:mdi-minus" size="x-small" @click="panel.decreaseHeight()" />
        <v-btn icon="mdi:mdi-plus" size="x-small" @click="panel.increaseHeight()" />
        <v-btn icon="mdi:mdi-trash-can-outline" size="x-small" @click="panel.remove()" />

        <v-menu :close-on-content-click="false">
          <template #activator="{ props: itemProps }">
            <v-btn icon="mdi:mdi-dots-vertical" size="small" v-bind="itemProps" />
          </template>

          <ActivityChartPanelMenuPopover :graph="(panel.graph as ActivityChartGraph)" @changed="selectModel" />
        </v-menu>
      </v-btn-group>
    </template>
  </v-toolbar>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import ActivityChartPanelMenuPopover from "./ActivityChartPanelMenuPopover.vue";
import { ActivityChartGraph } from "@/helpers/activityChartGraph/activityChartGraph";
import { ActivityChartPanel } from "@/helpers/activityChartGraph/activityChartPanel";

const props = defineProps<{ panel: ActivityChartPanel }>();
const panel = computed(() => props.panel);

const selectModel = (modelId: string) => {
  panel.value.selectModel(modelId);
  panel.value.graph.update();
};
</script>
