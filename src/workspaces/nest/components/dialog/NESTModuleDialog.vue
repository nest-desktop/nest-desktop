<template>
  <v-card title="Select a module">
    <v-card-text>
      <NESTModuleSelect v-model="state.selectedModule" return-object @update:model-value="fetchInstalledModels()" />

      <v-list>
        <v-list-subheader text="Models" />

        <v-list-item
          v-for="(modelId, index) in state.selectedModule.models"
          :key="index"
          :to="{
            name: 'nestModel',
            params: { modelId },
          }"
          @click="closeDialog()"
        >
          {{ modelId }}

          <template #append>
            <v-icon v-if="moduleStore.state.installedModels.includes(modelId)" color="green" icon="mdi:mdi-check" />
            <v-icon v-else color="red" icon="mdi:mdi-cancel" />
          </template>
        </v-list-item>
      </v-list>
    </v-card-text>

    <v-card-actions>
      <v-btn
        append-icon="mdi:mdi-open-in-new"
        href="https://nestml.readthedocs.io"
        target="_blank"
        text="help"
        title="Doc about NESTML"
      />

      <v-spacer />
      <v-btn
        :disabled="appStore.currentWorkspace.backends.nestml.state.response.status != 200"
        text="Generate module"
        @click="closeDialog(state.selectedModule)"
      />
      <v-btn text="close" @click="closeDialog()" />
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
  selectedModule: moduleStore.findModule("nestmlmodule") as IModule,
});

const emit = defineEmits(["closeDialog"]);
const closeDialog = (module?: IModule | null) => emit("closeDialog", module ? module : false);

const fetchInstalledModels = () => {
  nextTick(() => {
    moduleStore.fetchInstalledModels(state.selectedModule.name);
  });
};
</script>
