<template>
  <v-toolbar :title="panel.model.label" class="px-1" color="transparent" density="compact">
    <template #prepend>
      <v-icon :icon="panel.model.icon" />
    </template>

    <template #append>
      <v-btn-group class="py-2" style="height: 100%">
        <v-icon-btn
          :icon="panel.state.visible ? 'mdi:mdi-eye' : 'mdi:mdi-eye-off'"
          size="small"
          @click="panel.toggleVisible()"
        />
        <v-icon-btn icon="mdi:mdi-minus" size="small" @click="panel.decreaseHeight()" />
        <v-icon-btn icon="mdi:mdi-plus" size="small" @click="panel.increaseHeight()" />
        <v-icon-btn icon="mdi:mdi-trash-can-outline" size="small" @click="panel.remove()" />

        <v-menu :close-on-content-click="false">
          <template #activator="{ props: itemProps }">
            <v-icon-btn icon="mdi:mdi-dots-vertical" size="small" v-bind="itemProps" />
          </template>

          <ActivityChartPanelMenuPopover :graph="panel.graph" @changed="selectModel" />
        </v-menu>
      </v-btn-group>
    </template>
  </v-toolbar>
</template>

<script setup lang="ts">
import { computed } from "vue";

import ActivityChartPanelMenuPopover from "./ActivityChartPanelMenuPopover.vue";
import { ActivityChartPanel } from "@/helpers/activityGraph/activityChartGraph/activityChartPanel";

const props = defineProps<{ panel: ActivityChartPanel }>();
const panel = computed(() => props.panel);

const selectModel = (modelId: string) => {
  panel.value.selectModel(modelId);
  panel.value.graph.update();
};
</script>
