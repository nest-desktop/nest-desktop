<template>
  <v-container>
    <v-card title="Model editor">
      <v-card-text>
        <v-row>
          <v-col cols="4">
            <v-text-field
              density="compact"
              hide-details
              label="Model id"
              v-model="model.id"
              variant="outlined"
            />
          </v-col>

          <v-col cols="4">
            <v-text-field
              density="compact"
              hide-details
              label="Model label"
              v-model="model.label"
              variant="outlined"
            />
          </v-col>

          <v-col cols="4">
            <v-select
              :items
              density="compact"
              hide-details
              label="Model element type"
              v-model="model.elementType"
              variant="outlined"
            />
          </v-col>
        </v-row>

        <NESTMLModelEditor :model />
      </v-card-text>

      <v-card-actions>
        <v-btn @click="modelStore.save()">save</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { computed } from "vue";

import { TModelStore } from "@/stores/model/defineModelStore";

import NESTMLModelEditor from "../components/model/NESTMLModelEditor.vue";
import { NESTModel } from "../helpers/model/model";

import { useNESTModelStore } from "../stores/model/modelStore";
const modelStore: TModelStore = useNESTModelStore();

const model = computed(() => modelStore.model as NESTModel);

const items = ["neuron", "recorder", "stimulator", "synapse"];
</script>
