<template>
  <v-card flat>
    <v-toolbar class="px-2" color="transparent" density="compact" tile>
      Load NESTML template from GitHub

      <template #append>
        <v-btn @click="loadNESTMLScript">load nestml script</v-btn>
        <v-btn @click="getParams">get params</v-btn>
      </template>
    </v-toolbar>

    <v-card-text>
      <codemirror v-model="model.nestmlScript" />
    </v-card-text>

    <v-card-actions>
      <v-spacer />

      <NESTModuleSelect
        class="px-2"
        max-width="300"
        v-model="state.selectedModule"
      />

      <v-btn
        @click="addModelToModule"
        :disabled="model.nestmlScript.length === 0"
      >
        add to module
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script lang="ts" setup>
import axios, { AxiosError, AxiosResponse } from "axios";
import { computed, reactive } from "vue";

import { notifyError } from "@/helpers/common/dialog";

import NESTModuleSelect from "./NESTModuleSelect.vue";
import { NESTModel } from "../../helpers/model/model";

import { useModuleStore } from "../../stores/moduleStore";
const moduleStore = useModuleStore();

import { useNESTMLServerStore } from "../../stores/backends/nestmlServerStore";
const nestmlServerStore = useNESTMLServerStore();

const props = defineProps<{ model: NESTModel }>();
const model = computed(() => props.model as NESTModel);

const state = reactive({
  selectedModule: moduleStore.findModule("nestmlmodule"),
});

const getParams = () => {
  nestmlServerStore
    .axiosInstance()
    .post("getParams", {
      element_type: model.value.elementType,
      script: model.value.nestmlScript,
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
  const path = `https://raw.githubusercontent.com/nest/nestml/v7.0.2/models/${model.value.elementType}s/${model.value.id}.nestml`;
  axios
    .get(path)
    .then((response: AxiosResponse) => {
      if (response.data) {
        model.value.nestmlScript = response.data;
      }
    })
    .catch(() => {
      model.value.nestmlScript = "";
    });
};

const addModelToModule = () => {
  if (!state.selectedModule.models.includes(model.value.id)) {
    state.selectedModule.models.push(model.value.id);
  }
};
</script>
