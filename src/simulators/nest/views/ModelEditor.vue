<template>
  <v-container>
    <v-card title="Model editor">
      <v-text-field
        class="ma-2"
        density="compact"
        hide-details
        label="Model id"
        v-model="model.id"
        variant="outlined"
      />

      <v-text-field
        class="ma-2"
        density="compact"
        hide-details
        label="Model label"
        v-model="model.label"
        variant="outlined"
      />

      <NESTMLModelEditor :elementType="model.elementType" :modelId="model.id" />
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import NESTMLModelEditor from "../components/model/NESTMLModelEditor.vue";
import { NESTModel } from "../helpers/model/model";
import { TModelStore } from "@/stores/model/defineModelStore";

import { useNESTModelStore } from "../stores/model/modelStore";
const modelStore: TModelStore = useNESTModelStore();

const model = computed(() => modelStore.model as NESTModel);
</script>
