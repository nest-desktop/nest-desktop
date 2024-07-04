<template>
  <v-card class="my-2" flat>
    <v-toolbar color="transparent" density="compact">
      <v-btn
        @click="loadNESTMLScript()"
        prepend-icon="mdi:mdi-cloud-arrow-down-outline"
        text="Load nestml script"
        variant="outlined"
      />

      <v-btn @click="getParams" class="mx-1" variant="outlined">
        get params
      </v-btn>

      <v-spacer />

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

    <v-card-text>
      <codemirror v-model="model.nestmlScript" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { AxiosError, AxiosResponse } from "axios";
import { computed, nextTick, onMounted, reactive, watch } from "vue";
import { createDialog } from "vuetify3-dialog";

import NESTMLScriptDialog from "../dialog/NESTMLScriptDialog.vue";
import NESTModuleSelect from "./NESTModuleSelect.vue";
import { NESTModel } from "../../helpers/model/model";
import { notifyError } from "@/utils/dialog";

import { IModule, useModuleStore } from "../../stores/moduleStore";
const moduleStore = useModuleStore();

import { useNESTMLServerStore } from "../../stores/backends/nestmlServerStore";
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
