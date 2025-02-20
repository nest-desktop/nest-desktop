<template>
  <div class="activityChartPanelMenuPopover">
    <v-card>
      <v-list density="compact">
        <v-list-group fluid value="Analog signals">
          <template #activator="{ props: itemProps }">
            <v-list-item v-bind="itemProps" title="Analog signals" />
          </template>
          <v-list-item
            v-for="(model, index) in graph.modelsAnalog"
            :key="'analogPanel' + index"
            :prepend-icon="model.icon"
            :title="model.label"
            @click="selectModel(model.id)"
          />
        </v-list-group>

        <v-list-group fluid value="Spike activity">
          <template #activator="{ props: itemProps }">
            <v-list-item v-bind="itemProps" title="Spike activity" />
          </template>
          <v-list-item
            v-for="(model, index) in graph.modelsSpike"
            :key="'spikePanel' + index"
            :prepend-icon="model.icon"
            :title="model.label"
            @click="selectModel(model.id)"
          />
        </v-list-group>
      </v-list>
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { ActivityChartGraph } from "@/helpers/activityGraph/activityChartGraph/activityChartGraph";

const props = defineProps<{ graph: ActivityChartGraph }>();
const graph = computed(() => props.graph as ActivityChartGraph);

const emit = defineEmits(["changed"]);

/**
 * Select panel model.
 */
const selectModel = (modelId: string) => {
  emit("changed", modelId);
};
</script>
