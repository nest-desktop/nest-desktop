<template>
  <v-card flat>
    <v-card-text>
      <v-expansion-panels>
        <v-expansion-panel
          :disabled="!['neuron', 'synapse'].includes(model.elementType)"
        >
          <v-expansion-panel-title>
            NESTML script for {{ model.elementType }}
            <v-spacer />
            <v-chip
              :key="index"
              class="mx-1"
              size="small"
              v-for="(module, index) in state.selectedModules"
            >
              {{ module.id }}
            </v-chip>
          </v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-toolbar class="px-2" color="transparent" density="compact">
              <v-btn @click="loadNESTMLScript" variant="outlined">
                load nestml script
              </v-btn>
              <v-btn @click="getParams" class="mx-1" variant="outlined">
                get params
              </v-btn>

              <template #append>
                <NESTModuleSelect
                  @click.stop
                  @update:model-value="updateModules()"
                  chips
                  width="400"
                  multiple
                  v-model="state.selectedModules"
                />
              </template>
            </v-toolbar>

            <codemirror v-model="model.nestmlScript" />
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import axios, { AxiosError, AxiosResponse } from "axios";
import { computed, nextTick, onMounted, reactive } from "vue";

import { notifyError } from "@/helpers/common/dialog";

import NESTModuleSelect from "./NESTModuleSelect.vue";
import { NESTModel } from "../../helpers/model/model";

import { IModule, useModuleStore } from "../../stores/moduleStore";
const moduleStore = useModuleStore();

import { useNESTMLServerStore } from "../../stores/backends/nestmlServerStore";
import { watch } from "vue";
const nestmlServerStore = useNESTMLServerStore();

const props = defineProps<{ model: NESTModel }>();
const model = computed(() => props.model as NESTModel);

const state = reactive({
  selectedModules: moduleStore.state.modules.filter((module: IModule) =>
    module.models.includes(model.value.id)
  ),
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

const updateModules = () => {
  moduleStore.state.modules.forEach((module: IModule) => {
    nextTick(() => {
      if (
        state.selectedModules.includes(module) &&
        !module.models.includes(model.value.id) &&
        model.value.nestmlScript.length > 0
      ) {
        module.models.push(model.value.id);
      } else if (module.models.includes(model.value.id)) {
        module.models.splice(module.models.indexOf(model.value.id), 1);
      }
    });
  });
};

const update = () => {
  state.selectedModules = moduleStore.state.modules.filter((module: IModule) =>
    module.models.includes(model.value.id)
  );
};

onMounted(update);

watch(() => props.model, update);
</script>
