<template>
  <v-card class="my-2" flat>
    <v-toolbar color="transparent" density="compact">
      <NESTMLModelSelect
        :model
        :model-value="model.templateName"
        @update:model-value="updateOnSelect"
        class="pt-1"
      />

      <v-spacer />

      <NESTModuleCombobox
        @click.stop
        @update:model-value="updateModules()"
        chips
        class="pt-1"
        label="module"
        max-width="400"
        multiple
        v-model="state.selectedModules"
      />
    </v-toolbar>

    <v-card-text>
      <codemirror :extensions v-model="model.nestmlScript" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
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
// const modelStore: TModelStore = useNESTModelStore();

import { IModule, useNESTModuleStore } from "../../stores/moduleStore";
const moduleStore = useNESTModuleStore();

// import { useNESTMLServerStore } from "../../stores/backends/nestmlServerStore";
// const nestmlServerStore = useNESTMLServerStore();

const props = defineProps<{ model: NESTModel }>();
const model = computed(() => props.model as NESTModel);

const state = reactive<{
  selectedModules: IModule[];
}>({
  selectedModules: moduleStore.state.modules.filter((module: IModule) =>
    module.models.includes(model.value.id)
  ),
});

const extensions: Extension[] = [basicSetup];

if (darkMode()) {
  extensions.push(oneDark);
}

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

const updateOnSelect = () => {
  model.value.replaceModelId(model.value.id);
};

onMounted(update);

watch(() => props.model, update);
</script>
