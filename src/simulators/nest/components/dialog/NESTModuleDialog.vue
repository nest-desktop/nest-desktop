<template>
  <v-card title="Select a module">
    <v-card-text>
      <NESTModuleSelect
        @update:model-value="fetchInstalledModels()"
        return-object
        v-model="state.selectedModule"
      />

      <v-list>
        <v-list-subheader>Models</v-list-subheader>

        <v-list-item
          :key="index"
          :to="{
            name: 'nestModel',
            params: { modelId },
          }"
          @click="closeDialog()"
          v-for="(modelId, index) in state.selectedModule.models"
        >
          {{ modelId }}

          <template #append>
            <v-icon
              color="green"
              icon="mdi:mdi-check"
              v-if="moduleStore.state.installedModels.includes(modelId)"
            />
            <v-icon color="red" icon="mdi:mdi-cancel" v-else />
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>

    <v-card-actions>
      <v-btn
        :disabled="
          appStore.currentSimulator.backends.nestml.state.response.status != 200
        "
        @click="closeDialog(state.selectedModule.name)"
        text="Generate module"
        variant="outlined"
      />

      <v-btn @click="closeDialog()" text="close" variant="outlined" />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { nextTick, reactive } from "vue";

import NESTModuleSelect from "../module/NESTModuleSelect.vue";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

import { IModule, useNESTModuleStore } from "../../stores/moduleStore";
const moduleStore = useNESTModuleStore();

const state = reactive<{ selectedModule: IModule }>({
  selectedModule: moduleStore.findModule("nestmlmodule"),
});

const emit = defineEmits(["closeDialog"]);
const closeDialog = (moduleName?: string | null) => {
  emit("closeDialog", moduleName ? moduleName : false);
};

const fetchInstalledModels = () => {
  nextTick(() => {
    moduleStore.fetchInstalledModels(state.selectedModule.name);
  });
};
</script>
