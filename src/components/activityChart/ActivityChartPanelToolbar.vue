<template>
  <v-toolbar
    :title="panel.model.label"
    class="px-1"
    color="transparent"
    density="compact"
  >
    <template #prepend>
      <v-icon :icon="panel.model.icon" />
    </template>

    <template #append>
      <v-btn-group class="py-2" style="height: 100%">
        <v-btn
          :icon="panel.state.visible ? 'mdi:mdi-eye' : 'mdi:mdi-eye-off'"
          @click="panel.toggleVisible()"
          size="x-small"
        />
        <v-btn
          @click="panel.decreaseHeight()"
          icon="mdi:mdi-minus"
          size="x-small"
        />
        <v-btn
          @click="panel.increaseHeight()"
          icon="mdi:mdi-plus"
          size="x-small"
        />
        <v-btn
          @click="panel.remove()"
          icon="mdi:mdi-trash-can-outline"
          size="x-small"
        />

        <v-menu :close-on-content-click="false">
          <template #activator="{ props }">
            <v-btn icon="mdi:mdi-dots-vertical" size="small" v-bind="props" />
          </template>

          <ActivityChartPanelMenuPopover
            :graph="(panel.graph as ActivityChartGraph)"
            @changed="selectModel"
          />
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
