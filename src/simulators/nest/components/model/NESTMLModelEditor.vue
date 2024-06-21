<template>
  <v-card>
    <v-toolbar class="px-2" color="transparent" density="compact" tile>
      Load NESTML template from GitHub

      <template #append>
        <v-btn>Load</v-btn>
      </template>
    </v-toolbar>

    <v-card-text>
      <codemirror v-model="state.script" />
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-text-field
        class="my-2"
        clearable
        density="compact"
        hide-details
        label="Module name"
        placeholder="Module name"
        prepend-inner-icon="mdi:mdi-memory"
        v-model="state.moduleName"
        variant="outlined"
        max-width="400"
      />

      <v-btn @click="generateModel" :disabled="state.script.length === 0">
        Generate
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import { notifyError, notifySuccess } from "@/helpers/common/dialog";
import axios, { AxiosError, AxiosResponse } from "axios";
import { watch } from "vue";
import { computed, onMounted, reactive } from "vue";

const props = defineProps<{ modelId: string }>();
const modelId = computed(() => props.modelId);

const state = reactive({
  moduleName: "nestmlmodule",
  script: "",
});

const generateModel = () => {
  axios
    .post("http://localhost:52426/generate", {
      module_name: state.moduleName,
      models: [
        {
          name: modelId.value,
          script: state.script,
        },
      ],
    })
    .then((response: AxiosResponse) => {
      console.log(response);
      switch (response.status) {
        case 200:
          notifySuccess(
            `Models (${response.data.status["INSTALLED"].join(
              ","
            )}) are successfully generated in "${state.moduleName}" module.`
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

const loadNESTMLScript = () => {
  axios
    .get(
      `https://raw.githubusercontent.com/nest/nestml/v7.0.2/models/neurons/${modelId.value}.nestml`
    )
    .then((response: AxiosResponse) => {
      if (response.data) {
        state.script = response.data;
      }
    })
    .catch(() => {
      state.script = "";
    });
};

onMounted(() => {
  loadNESTMLScript();
});

watch(() => props.modelId, loadNESTMLScript);
</script>
