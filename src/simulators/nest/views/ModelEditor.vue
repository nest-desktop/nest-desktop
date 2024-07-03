<template>
  <v-card flat title="Model editor" v-if="model">
    <v-card-text>
      <v-row>
        <v-col cols="6">
          <v-text-field
            density="compact"
            disabled
            hide-details
            label="Model id"
            v-model="state.modelId"
            variant="outlined"
          />
        </v-col>

        <v-col cols="6">
          <v-text-field
            density="compact"
            hide-details
            label="Model label"
            v-model="model.label"
            variant="outlined"
          />
        </v-col>

        <!-- <v-col cols="4">
          <v-select
            :items
            density="compact"
            hide-details
            label="Model element type"
            v-model="model.elementType"
            variant="outlined"
          />
        </v-col> -->
      </v-row>

      <NESTMLModelEditor :model v-if="model.custom" />
    </v-card-text>

    <v-card-actions>
      <v-btn @click="saveModel()">save</v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { computed, reactive, watch } from "vue";

import { TModelStore } from "@/stores/model/defineModelStore";

import NESTMLModelEditor from "../components/model/NESTMLModelEditor.vue";
import { NESTModel } from "../helpers/model/model";

import { useRouter } from "vue-router";
const router = useRouter();

import { useNESTModelStore } from "../stores/model/modelStore";
const modelStore: TModelStore = useNESTModelStore();

const model = computed(() => modelStore.model as NESTModel);

const state = reactive({
  modelId: modelStore.state.modelId,
});

const saveModel = () => {
  model.value.id = state.modelId;
  modelStore.state.modelId = state.modelId;
  modelStore.saveModel();

  router.push({
    name: "nestModelEditor",
    params: { modelId: modelStore.state.modelId },
  });
};

watch(
  () => modelStore.state.modelId,
  () => {
    state.modelId = modelStore.state.modelId;
  }
);

// const items = ["neuron", "recorder", "stimulator", "synapse"];
</script>
