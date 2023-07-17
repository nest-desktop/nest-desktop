<template>
  <div class="activityChartPanelToolbar">
    <v-menu offset-y>
      <template #activator="{ props }">
        <v-btn
          :prepend-icon="panel.model.icon"
          block
          class="justify-start"
          v-bind="props"
          size="x-large"
        >
          {{ props.panel.model.label }}
          <v-spacer />
        </v-btn>

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
      </template>

      <activity-chart-panel-menu-popover @changed="selectModel" />
    </v-menu>
  </div>
</template>

<script lang="ts" setup>
import { ActivityChartPanel } from "@nest/graph/activityGraph/activityChart/activityChartPanel";
import ActivityChartPanelMenuPopover from "@nest/components/activity/activityChartGraph/ActivityChartPanelMenuPopover.vue";
import { computed } from "vue";

const props = defineProps({
  panel: { required: true, type: ActivityChartPanel },
});

const panel = computed(() => props.panel);

const selectModel = (modelId: string) => {
  props.panel.selectModel(modelId, props.panel.model.toJSON());
  props.panel.graph.update();
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
