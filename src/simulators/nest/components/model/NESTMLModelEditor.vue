<template>
  <v-card>
    <v-toolbar class="px-2" color="transparent" density="compact" tile>
      Load NESTML template from GitHub

      <template #append>
        <v-btn>Load</v-btn>
      </template>
    </v-toolbar>

    <v-card-text>
      <codemirror v-model="script" />
    </v-card-text>

    <v-card-actions>
      <v-spacer />

      <NESTModuleSelect class="px-2" max-width="400" />

      <v-btn @click="getParams">get params</v-btn>
      <v-btn @click="generateModel" :disabled="script.length === 0">
        generate
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref, watch } from "vue";
import axios, { AxiosError, AxiosResponse } from "axios";

import { notifyError, notifySuccess } from "@/helpers/common/dialog";
import NESTModuleSelect from "./NESTModuleSelect.vue";

import { useSimulatorStore } from "../../stores/simulatorStore";
const simulatorStore = useSimulatorStore();

const props = defineProps<{ elementType: string; modelId: string }>();
const modelId = computed(() => props.modelId);
const elementType = computed(() => props.elementType);

const script = ref("");

const generateModel = () => {
  axios
    .post("http://localhost:52426/generate", {
      module_name: simulatorStore.state.selectedModule[0],
      models: [
        {
          name: modelId.value,
          script: script.value,
        },
      ],
    })
    .then((response: AxiosResponse) => {
      switch (response.status) {
        case 200:
          notifySuccess(
            `Models (${response.data.status["INSTALLED"].join(
              ","
            )}) are successfully generated in "${
              simulatorStore.state.selectedModule[0]
            }" module.`
          );
          break;
        case 400:
          notifyError("Failed to generate model.");
          break;
      }
    })
    .catch((error: AxiosError) => {
      notifyError(error.message);
    });
};

const getParams = () => {
  axios
    .post("http://localhost:52426/getParams", {
      element_type: elementType.value,
      script: script.value,
    })
    .then((response: AxiosResponse) => {
      switch (response.status) {
        case 200:
          alert(JSON.stringify(response.data.params, null, 2));
          break;
        case 400:
          notifyError("Failed to get params for model.");
          break;
      }
    })
    .catch((error: AxiosError) => {
      notifyError(error.message);
    });
};

const loadNESTMLScript = () => {
  axios
    .get(
      `https://raw.githubusercontent.com/nest/nestml/v7.0.2/models/${elementType.value}s/${modelId.value}.nestml`
    )
    .then((response: AxiosResponse) => {
      if (response.data) {
        script.value = response.data;
      }
    })
    .catch(() => {
      script.value = "";
    });
};

onMounted(() => {
  loadNESTMLScript();
});

watch(() => props.modelId, loadNESTMLScript);
</script>
