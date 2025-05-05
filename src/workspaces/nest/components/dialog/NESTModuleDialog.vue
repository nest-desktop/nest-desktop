<template>
  <v-card title="Select a module">
    <v-card-text>
      <NESTModuleSelect v-model="state.selectedModule" return-object @update:model-value="fetchInstalledModels()" />

      <v-list v-model:selected="state.selectedModule.models" select-strategy="leaf">
        <v-list-subheader>Models</v-list-subheader>
        <v-list-item v-for="model in customModels" :key="model.id" :title="model.id" :value="model.id">
          <template v-slot:prepend="{ isSelected, select }">
            <v-list-item-action start>
              <v-checkbox-btn :model-value="isSelected" @update:model-value="select" />
            </v-list-item-action>
          </template>

          <template #append>
            <v-icon v-if="moduleStore.state.installedModels.includes(model.id)" color="green" icon="mdi:mdi-check" />
            <v-icon v-else color="red" icon="mdi:mdi-cancel" />

            <!-- <v-btn class="mx-1" icon size="small" variant="text">
              <v-icon icon="mdi:mdi-dots-vertical" />

              <v-menu activator="parent">
                <v-list>
                  <v-list-item v-for="(item, index) in items" :key="index" @click="() => item.onClick(index)">
                    <v-list-item-title>{{ item.title }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-btn> -->
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
import { computed, nextTick, reactive } from "vue";

import NESTModuleSelect from "../module/NESTModuleSelect.vue";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

import { useNESTModelDBStore } from "../../stores/model/modelDBStore";
const modelDBStore = useNESTModelDBStore();

import { IModule, useNESTModuleStore } from "../../stores/moduleStore";
const moduleStore = useNESTModuleStore();

const state = reactive<{ selectedModule: IModule }>({
  selectedModule: moduleStore.findModule("nestmlmodule") as IModule,
});

const emit = defineEmits(["closeDialog"]);
const closeDialog = (module?: IModule | null) => emit("closeDialog", module ? module : false);

const customModels = computed(() => modelDBStore.state.models.filter((model: NESTModel) => model.state.custom));

const fetchInstalledModels = () => {
  nextTick(() => {
    moduleStore.fetchInstalledModels(state.selectedModule.name);
  });
};

const items = [{ title: "Remove from the module", onClick: (idx) => state.selectedModule.models.splice(idx, 1) }];
</script>
