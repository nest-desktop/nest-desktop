<template>
  <v-tabs stacked>
    <v-tab
      :to="{
        name: 'NESTModelDoc',
        params: { modelId: model.id },
      }"
      size="small"
      title="Read documentation"
    >
      <v-icon icon="mdi-text-box-outline" />
      Doc
    </v-tab>
    <v-tab
      :to="{
        name: 'NESTModelExplorer',
        params: { modelId: model.id },
      }"
      size="small"
      title="Explore activity"
    >
      <v-icon icon="mdi-chart-scatter-plot" />
      Explorer
    </v-tab>
    <v-tab
      :to="{
        name: 'NESTModelEditor',
        params: { modelId: model.id },
      }"
      size="small"
      title="Edit network"
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

import { NESTModel } from "@nest/helpers/model/nestModel";

const props = defineProps({
  model: NESTModel,
});

const model = computed(() => props.model as NESTModel);
</script>
