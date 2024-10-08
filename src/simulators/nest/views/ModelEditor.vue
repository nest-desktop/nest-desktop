<template>
  <v-card flat title="Model editor" v-if="model">
    <v-card-text>
      <v-row>
        <v-col cols="5">
          <v-text-field
            density="compact"
            disabled
            hide-details
            label="model id"
            v-model="state.modelId"
          />
        </v-col>

        <v-col cols="5">
          <v-text-field
            density="compact"
            hide-details
            label="model label"
            v-model="model.state.label"
            v-if="model.state"
          />
        </v-col>

        <v-col cols="2">
          <v-btn
            @click="saveModel()"
            block
            prepend-icon="mdi-content-save-outline"
            text="save"
          />
        </v-col>

        <!-- <v-col cols="4">
          <v-select
            :items
            density="compact"
            hide-details
            label="Model element type"
            v-model="model.elementType"
          />
        </v-col> -->
      </v-row>

      <NESTMLModelEditor :model />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { AxiosError, AxiosResponse } from "axios";
import { computed, reactive, watch } from "vue";

import { TModelStore } from "@/stores/model/defineModelStore";
import { notifyError, notifySuccess } from "@/utils/notification";

import NESTMLModelEditor from "../components/model/NESTMLModelEditor.vue";
import { NESTModel } from "../helpers/model/model";

import { useRouter } from "vue-router";
const router = useRouter();

import { useNESTModelStore } from "../stores/model/modelStore";
const modelStore: TModelStore = useNESTModelStore();

import { useNESTMLServerStore } from "../stores/backends/nestmlServerStore";
const nestmlServerStore = useNESTMLServerStore();

const model = computed(() => modelStore.model as NESTModel);

const state = reactive<{ modelId: string }>({
  modelId: modelStore.state.modelId,
});

const saveModel = () => {
  modelStore.saveModel();

  if (model.value.nestmlScript.length > 0) {
    updateSpecs();
  }

  router.push({
    name: "nestModelEditor",
    params: { modelId: modelStore.state.modelId },
  });
};

const updateSpecs = () => {
  nestmlServerStore
    .axiosInstance()
    .post("getSpecs", {
      element_type: model.value.elementType,
      script: model.value.nestmlScript,
    })
    .then((response: AxiosResponse) => {
      switch (response.status) {
        case 200:
          model.value.updateParameters(response.data.params);
          model.value.updateRecordables(response.data.states);
          modelStore.saveModel();
          notifySuccess("Updated specifications from backend successfully.");
          break;
        case 400:
          notifyError("Failed to get specs for model.");
          break;
      }
    })
    .catch((error: AxiosError) => {
      notifyError(error.message);
    });
};

watch(
  () => modelStore.state.modelId,
  () => {
    state.modelId = modelStore.state.modelId;
  }
);
</script>
