<template>
  <div class="activityChartPanelToolbar">
    <v-menu :close-on-content-click="false">
      <template #activator="{ props }">
        <v-btn
          :prepend-icon="panel.model.icon"
          block
          class="justify-start"
          size="x-large"
          v-bind="props"
        >
          {{ panel.model?.label }}
        </v-btn>
      </template>

      <activity-chart-panel-menu-popover :panel="panel" @changed="selectModel" />
    </v-menu>

    <span class="icons">
      <v-btn
        :icon="panel.state.visible ? 'mdi-eye' : 'mdi-eye-off'"
        @click="panel.toggleVisible()"
        class="mx-1"
        right
        size="small"
        variant="text"
      />
      <v-btn
        @click="panel.decreaseHeight()"
        class="mx-1"
        icon="mdi-minus"
        right
        size="small"
        variant="text"
      />
      <v-btn
        @click="panel.increaseHeight()"
        class="mx-1"
        icon="mdi-plus"
        right
        size="small"
        variant="text"
      />
      <v-btn
        @click="panel.remove()"
        class="mx-1"
        icon="mdi-trash-can-outline"
        right
        size="small"
        variant="text"
      />
    </span>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { ActivityChartPanel } from "./activityChartPanel";
import ActivityChartPanelMenuPopover from "./ActivityChartPanelMenuPopover.vue";

const props = defineProps({
  panel: ActivityChartPanel,
});

const panel = computed(() => props.panel as ActivityChartPanel);

const selectModel = (modelId: string) => {
  panel.value.selectModel(modelId, panel.value.model.toJSON());
  panel.value.graph.update();
};
</script>

<style lang="scss">
.activityChartPanelToolbar .icons {
  display: none;
  line-height: 48px;
  position: absolute;
  right: 4px;
  top: 0;
}
.activityChartPanelToolbar:hover .icons {
  display: block;
}
</style>
