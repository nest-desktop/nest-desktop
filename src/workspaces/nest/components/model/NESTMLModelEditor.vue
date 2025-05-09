<template>
  <v-card v-if="model && model.state.custom" class="my-2" flat>
    <v-toolbar color="transparent" density="compact">
      <NESTMLModelSelect :model :model-value="model.templateName" class="pt-1" @update:model-value="updateOnSelect" />

      <v-spacer />

      <NESTModuleCombobox
        v-model="state.selectedModules"
        chips
        class="pt-1"
        label="module"
        max-width="400"
        multiple
        @click.stop
        @update:model-value="updateModules()"
      />
    </v-toolbar>

    <v-card-text>
      <codemirror v-model="model.nestmlScript" :extensions />
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { Extension } from "@codemirror/state";
import { computed, nextTick, onMounted, reactive, watch } from "vue";

import { darkMode } from "@/helpers/common/theme";
import {
  basicSetup,
  // languageNESTML,
  // languageYAML,
  oneDark,
} from "@/plugins/codemirror";

import NESTMLModelSelect from "./NESTMLModelSelect.vue";
import NESTModuleCombobox from "../module/NESTModuleCombobox.vue";
import { NESTModel } from "../../helpers/model/model";
import { updateSimulationModules } from "../../stores/model/modelStore";

// import { useNESTModelStore } from "../../stores/model/modelStore";
// const modelStore = useNESTModelStore();

import { IModule, useNESTModuleStore } from "../../stores/moduleStore";
const moduleStore = useNESTModuleStore();

// import { useNESTMLServerStore } from "../../stores/backends/nestmlServerStore";
// const nestmlServerStore = useNESTMLServerStore();

const props = defineProps<{ model: NESTModel }>();
const model = computed(() => props.model as NESTModel);

const state = reactive<{
  selectedModules: IModule[];
}>({
  selectedModules: moduleStore.state.modules.filter((module: IModule) => module.models.includes(model.value.id)),
});

const extensions: Extension[] = [basicSetup];

if (darkMode()) extensions.push(oneDark);

const update = () => {
  state.selectedModules = moduleStore.state.modules.filter((module: IModule) => module.models.includes(model.value.id));
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
      } else if (!state.selectedModules.includes(module) && module.models.includes(model.value.id)) {
        module.models.splice(module.models.indexOf(model.value.id), 1);
      }

      updateSimulationModules();
    });
  });
};

const updateOnSelect = () => {
  model.value.replaceModelId(model.value.id);
};

onMounted(update);

watch(() => props.model, update);
</script>
