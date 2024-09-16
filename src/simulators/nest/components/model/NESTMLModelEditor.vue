<template>
  <v-card class="my-2" flat>
    <v-toolbar color="transparent" density="compact">
      <v-btn
        @click="loadNESTMLScript()"
        prepend-icon="mdi:mdi-cloud-arrow-down-outline"
        text="Load NESTML script"
      />

      <v-btn @click="updateSpecs" class="mx-1" text="update specs" />

      <v-spacer />

      <template #append>
        <NESTModuleCombobox
          @click.stop
          @update:model-value="updateModules()"
          chips
          width="400"
          multiple
          v-model="state.selectedModules"
        />
      </template>
    </v-toolbar>

    <v-card-text>
      <codemirror v-model="model.nestmlScript" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { AxiosError, AxiosResponse } from "axios";
import { computed, nextTick, onMounted, reactive, watch } from "vue";
import { createDialog, notifySuccess } from "vuetify3-dialog";

import { TModelStore } from "@/stores/model/defineModelStore";
import { notifyError } from "@/utils/dialog";

import NESTMLScriptDialog from "../dialog/NESTMLScriptDialog.vue";
import NESTModuleCombobox from "../module/NESTModuleCombobox.vue";
import { NESTModel } from "../../helpers/model/model";
import { updateSimulationModules } from "../../stores/model/modelStore";

import { useNESTModelStore } from "../../stores/model/modelStore";
const modelStore: TModelStore = useNESTModelStore();

import { IModule, useNESTModuleStore } from "../../stores/moduleStore";
const moduleStore = useNESTModuleStore();

import { useNESTMLServerStore } from "../../stores/backends/nestmlServerStore";
const nestmlServerStore = useNESTMLServerStore();

const props = defineProps<{ model: NESTModel }>();
const model = computed(() => props.model as NESTModel);

const state = reactive<{
  selectedModules: IModule[];
}>({
  selectedModules: moduleStore.state.modules.filter((module: IModule) =>
    module.models.includes(model.value.id)
  ),
});

const loadNESTMLScript = () => {
  createDialog({
    title: "",
    text: "",
    customComponent: {
      component: NESTMLScriptDialog,
      props: { elementType: model.value.elementType },
    },
    dialogOptions: {
      width: "1280px",
    },
  }).then((response: any) => {
    if (response) {
      model.value.nestmlScript = response.script;
      model.value.elementType = response.elementType;
    }
  });
};

const update = () => {
  state.selectedModules = moduleStore.state.modules.filter((module: IModule) =>
    module.models.includes(model.value.id)
  );
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
      } else if (
        !state.selectedModules.includes(module) &&
        module.models.includes(model.value.id)
      ) {
        module.models.splice(module.models.indexOf(model.value.id), 1);
      }

      updateSimulationModules();
    });
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

onMounted(update);

watch(() => props.model, update);
</script>
