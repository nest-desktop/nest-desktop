<template>
  <v-card class="my-2" flat>
    <v-toolbar color="transparent" density="compact">
      <NESTMLModelSelect :model class="pt-1" />

      <v-spacer />

      <NESTModuleCombobox
        @click.stop
        @update:model-value="updateModules()"
        chips
        class="pt-1"
        max-width="400"
        multiple
        v-model="state.selectedModules"
      />
    </v-toolbar>

    <v-card-text>
      <codemirror v-model="model.nestmlScript" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, reactive, watch } from "vue";

import NESTModuleCombobox from "../module/NESTModuleCombobox.vue";
import { NESTModel } from "../../helpers/model/model";
import { updateSimulationModules } from "../../stores/model/modelStore";

// import { useNESTModelStore } from "../../stores/model/modelStore";
// const modelStore: TModelStore = useNESTModelStore();

import { IModule, useNESTModuleStore } from "../../stores/moduleStore";
import NESTMLModelSelect from "./NESTMLModelSelect.vue";
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

onMounted(update);

watch(() => props.model, update);
</script>
