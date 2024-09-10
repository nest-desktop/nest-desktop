<template>
  <div class="activityChartPanelToolbar">
    <v-icon :text="panel.model.icon" class="ma-3" size="small" />
    {{ panel.model?.label }}

    <v-spacer />

    <span class="icons">
      <v-btn
        :icon="panel.state.visible ? 'mdi:mdi-eye' : 'mdi:mdi-eye-off'"
        @click="panel.toggleVisible()"
        class="mx-1"
        right
        size="x-small"
        variant="text"
      />
      <v-btn
        @click="panel.decreaseHeight()"
        class="mx-1"
        icon="mdi:mdi-minus"
        right
        size="x-small"
        variant="text"
      />
      <v-btn
        @click="panel.increaseHeight()"
        class="mx-1"
        icon="mdi:mdi-plus"
        right
        size="x-small"
        variant="text"
      />
      <v-btn
        @click="panel.remove()"
        class="mx-1"
        icon="mdi:mdi-trash-can-outline"
        right
        size="x-small"
        variant="text"
      />

      <v-menu :close-on-content-click="false">
        <template #activator="{ props }">
          <v-btn
            icon="mdi:mdi-dots-vertical"
            color="primary"
            size="x-small"
            v-bind="props"
            variant="text"
          />
        </template>

        <ActivityChartPanelMenuPopover
          :graph="(panel.graph as ActivityChartGraph)"
          @changed="selectModel"
        />
      </v-menu>
    </span>
  </div>
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

<style lang="scss">
.activityChartPanelToolbar {
  .icons {
    display: none;
    line-height: 48px;
    position: absolute;
    right: 4px;
    top: 0;
  }

  &:hover .icons {
    display: block;
  }
}
</style>
