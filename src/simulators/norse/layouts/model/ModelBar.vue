<template>
  <v-tabs stacked>
    <v-tab
      :to="{
        name: 'NorseModelExplorer',
        params: { modelId: model.id },
      }"
      size="small"
      title="Explore model"
    >
      <v-icon icon="mdi-chart-scatter-plot" />
      Explorer
    </v-tab>
    <v-tab
      :to="{
        name: 'NorseModelEditor',
        params: { modelId: model.id },
      }"
      size="small"
      title="Edit model"
    >
      <v-icon icon="mdi-pencil" />
      Editor
    </v-tab>
  </v-tabs>

  <v-spacer />

  <v-app-bar-title> {{ model.id }} </v-app-bar-title>

  <v-spacer />

  <v-btn variant="outlined"> Simulate </v-btn>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { NorseModel } from "@norse/helpers/model/norseModel";

const props = defineProps({
  model: NorseModel,
});

const model = computed(() => props.model as NorseModel);
</script>
