<template>
  <v-container>
    <v-row>
      <v-col md="6">
        <v-card>
          <v-img :src="nestLogo" alt="nest-logo" class="ma-2 mx-10" />

          <v-card-subtitle class="mt-4"> Simulator for spiking neural network models </v-card-subtitle>

          <v-card-text>
            <div class="text-justify">
              NEST is a simulator for spiking neural network models that focuses on the dynamics, size and structure of
              neural systems rather than on the exact morphology of individual neurons. The development of NEST is
              coordinated by the NEST Initiative.
            </div>

            <div class="mt-3">
              NEST is ideal for networks of spiking neurons of any size, for example:

              <v-list density="compact">
                <v-list-item prepend-icon="mdi:mdi-numeric-1-circle-outline">
                  Models of information processing e.g. in the visual or auditory cortex of mammals,
                </v-list-item>
                <v-list-item prepend-icon="mdi:mdi-numeric-2-circle-outline">
                  Models of network activity dynamics, e.g. laminar cortical networks or balanced random networks,
                </v-list-item>
                <v-list-item prepend-icon="mdi:mdi-numeric-3-circle-outline">
                  Models of learning and plasticity.
                </v-list-item>
              </v-list>
            </div>
          </v-card-text>
        </v-card>

        <v-card class="mt-2" title="References">
          <v-card-text>
            <v-list density="compact">
              <v-list-item
                v-for="(refItem, index) in refItems"
                :key="index"
                append-icon="mdi:mdi-open-in-new"
                target="_blank"
                v-bind="refItem"
              />
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col md="6">
        <v-card title="Backend">
          <v-expansion-panels elevation="0" variant="accordion">
            <v-expansion-panel>
              <v-expansion-panel-title>
                Backend settings
                <v-spacer />

                <BackendStatusIcon
                  v-for="(backend, index) in appStore.currentWorkspace.backends"
                  :key="index"
                  :backend-store="backend"
                  :title="backend.state.name"
                />
              </v-expansion-panel-title>

              <v-expansion-panel-text>
                <v-tabs v-model="state.backendTab" density="compact">
                  <v-tab
                    v-for="(backend, index) in appStore.currentWorkspace.backends"
                    :key="index"
                    :value="backend.state.name"
                  >
                    {{ backend.state.name }}
                    <template #append>
                      <BackendStatusIcon :backend-store="backend" :title="backend.state.name" />
                    </template>
                  </v-tab>
                </v-tabs>

                <v-window v-model="state.backendTab" class="mx-2">
                  <v-window-item
                    v-for="(backend, index) in appStore.currentWorkspace.backends"
                    :key="index"
                    :value="backend.state.name"
                  >
                    <BackendSettings :store="backend" />
                  </v-window-item>
                </v-window>
              </v-expansion-panel-text>
            </v-expansion-panel>

            <v-expansion-panel :disabled="appStore.currentWorkspace.stores.modelStore.state.models.length === 0">
              <v-expansion-panel-title>
                Models from NEST backend
                <v-spacer />

                <v-btn
                  class="mx-1"
                  flat
                  icon="nest:build-models"
                  size="x-small"
                  title="Generate NESTML models"
                  variant="text"
                  @click.stop="openNESTModuleDialog()"
                />
              </v-expansion-panel-title>

              <v-expansion-panel-text>
                <v-card>
                  <v-card-title>
                    <NESTModuleSelect
                      v-model="state.selectedModule"
                      :hide-details="false"
                      clearable
                      return-object
                      @update:model-value="(item) => (item ? nestSimulator.installModule(item.name) : resetKernel())"
                    >
                      <template #details>
                        <span
                          v-if="customModels ? customModels.length > 0 : false"
                          :title="customModels?.join(',')"
                          density="compact"
                          variant="text"
                        >
                          {{ customModels?.length }}
                          custom model
                          <span v-show="customModels ? customModels.length > 1 : false" text="s" />
                        </span>
                      </template>
                    </NESTModuleSelect>

                    <v-text-field
                      v-model="state.modelSearch"
                      class="my-2"
                      clearable
                      density="compact"
                      hide-details="auto"
                      label="Search model"
                      placeholder="Search model"
                      prepend-inner-icon="mdi:mdi-magnify"
                    >
                      <template #details>
                        {{ models.length }} model
                        <span v-show="models.length > 1" text="s" />
                      </template>
                    </v-text-field>
                  </v-card-title>

                  <v-divider />

                  <v-virtual-scroll :items="models" max-height="300">
                    <template #default="{ item }">
                      <v-list-item>
                        <!-- @vue-ignore item is unknown -->
                        {{ item.id }}
                        <template #append>
                          <span class="text-caption">
                            <!-- @vue-ignore item is unknown -->
                            {{ item.elementType }}
                          </span>
                        </template>
                      </v-list-item>
                    </template>
                  </v-virtual-scroll>
                </v-card>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>
        </v-card>

        <StoreList />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, reactive } from "vue";

import BackendSettings from "@/components/BackendSettings.vue";
import BackendStatusIcon from "@/components/iconsets/BackendStatusIcon.vue";
import StoreList from "@/components/StoreList.vue";
import nestLogo from "@/assets/img/logo/nest-logo.svg";
import { IModelProps } from "@/stores/model/defineModelStore";

import NESTModuleSelect from "../components/module/NESTModuleSelect.vue";
import nestSimulator from "../stores/backends/nestSimulatorStore";
import { IModule, openNESTModuleDialog } from "../stores/moduleStore";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

const state = reactive<{
  backendTab: string;
  modelSearch: string;
  selectedModule: IModule | null;
}>({
  backendTab: "nest",
  modelSearch: "",
  selectedModule: null,
});

const customModels = computed(() => state.selectedModule?.models);

const models = computed(() => {
  const models = appStore.currentWorkspace.stores.modelStore.state.models;
  return state.modelSearch ? models.filter((model: IModelProps) => model.id.includes(state.modelSearch)) : models;
});

const refItems = [
  {
    href: "https://nest-initiative.org/",
    prependIcon: "mdi:mdi-home",
    title: "https://nest-initiative.org/",
  },
  {
    href: "https://github.com/nest/nest-simulator/",
    prependIcon: "mdi:mdi-github",
    title: "https://github.com/nest/nest-simulator/",
  },
  {
    href: "https://nest-simulator.readthedocs.io/",
    prependIcon: "mdi:mdi-book-open",
    title: "https://nest-simulator.readthedocs.io/",
  },
  {
    href: "https://twitter.com/NestSimulator",
    prependIcon: "mdi:mdi-twitter",
    title: "https://twitter.com/NestSimulator",
  },
  {
    href: "https://www.ebrains.eu/tools/nest",
    prependIcon: "mdi:mdi-brain",
    title: "https://www.ebrains.eu/tools/nest",
  },
];

const resetKernel = () => {
  nestSimulator.resetKernel();
};
</script>
