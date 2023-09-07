<template>
  <v-tabs stacked>
    <v-tab
      :key="index"
      :to="tab.to"
      :title="tab.title"
      size="small"
      v-for="(tab, index) in tabItems"
    >
      <v-icon :icon="tab.icon" />
      <span class="text-no-wrap">{{ tab.label }}</span>
    </v-tab>
  </v-tabs>

  <v-spacer />

  <v-app-bar-title> {{ model.id }} </v-app-bar-title>

  <v-spacer />

  <v-btn variant="outlined"> Simulate </v-btn>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { Model, ModelPropTypes } from "@/types/modelTypes";

const props = defineProps({
  model: ModelPropTypes,
  tabItems: Object,
});

const model = computed(() => props.model as Model);
const tabItems = computed(() => props.tabItems as Object);
</script>
