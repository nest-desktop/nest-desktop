<template>
  <div class="activityChartPanelMenuPopover">
    <v-card>
      <v-list
        v-show="projectStore.project.activities.state.hasSomeAnalogRecorders"
      >
        <v-list-subheader>Analog signals</v-list-subheader>
        <v-list-item
          :key="'analogPanel' + index"
          @click="selectModel(model.id)"
          v-for="(model, index) in projectStore.project.activityGraph
            .activityChartGraph.modelsAnalog"
        >
          <v-icon left small icon="model.icon" />
          <v-list-item-title> {{ model.label }}</v-list-item-title>
        </v-list-item>
      </v-list>

      <v-list
        v-show="projectStore.project.activities.state.hasSomeSpikeRecorders"
      >
        <v-list-subheader>Spike activity</v-list-subheader>
        <v-list-item
          :key="'spikePanel' + index"
          @click="selectModel(model.id)"
          v-for="(model, index) in projectStore.project.activityGraph
            .activityChartGraph.modelsSpike"
        >
          <v-icon left small :icon="model.icon" />
          <v-list-item-title>{{ model.label }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import { useProjectStore } from "@/nest/store/project/projectStore";
const projectStore = useProjectStore();

const emit = defineEmits(["changed"]);

/**
 * Select panel model.
 */
const selectModel = (modelId: string) => {
  emit("changed", modelId);
};
</script>

<style lang="scss">
.activityChartPanelToolbar .icons {
  display: none;
  line-height: 36px;
  position: absolute;
  right: 4px;
  top: 0;
}
.activityChartPanelToolbar:hover .icons {
  display: block;
}
</style>
