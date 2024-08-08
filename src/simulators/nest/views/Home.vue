<template>
  <v-container>
    <v-row>
      <v-col md="6">
        <v-card>
          <v-img :src="nestLogo" alt="nest-logo" class="ma-2 mx-10" />

          <v-card-subtitle class="mt-4">
            Simulator for spiking neural network models
          </v-card-subtitle>

          <v-card-text>
            <div class="text-justify">
              NEST is a simulator for spiking neural network models that focuses
              on the dynamics, size and structure of neural systems rather than
              on the exact morphology of individual neurons. The development of
              NEST is coordinated by the NEST Initiative.
            </div>

            <div class="mt-3">
              NEST is ideal for networks of spiking neurons of any size, for
              example:

              <v-list density="compact">
                <v-list-item prepend-icon="mdi:mdi-numeric-1-circle-outline">
                  Models of information processing e.g. in the visual or
                  auditory cortex of mammals,
                </v-list-item>
                <v-list-item prepend-icon="mdi:mdi-numeric-2-circle-outline">
                  Models of network activity dynamics, e.g. laminar cortical
                  networks or balanced random networks,
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
                append-icon="mdi:mdi-open-in-new"
                href="https://nest-initiative.org/"
                prepend-icon="mdi:mdi-home"
                target="_blank"
              >
                https://nest-initiative.org/
              </v-list-item>
              <v-list-item
                append-icon="mdi:mdi-open-in-new"
                href="https://github.com/nest/nest-simulator/"
                prepend-icon="mdi:mdi-github"
                target="_blank"
              >
                https://github.com/nest/nest-simulator/
              </v-list-item>
              <v-list-item
                append-icon="mdi:mdi-open-in-new"
                href="https://nest-simulator.readthedocs.io/"
                prepend-icon="mdi:mdi-book-open"
                target="_blank"
              >
                https://nest-simulator.readthedocs.io/
              </v-list-item>

              <v-list-item
                append-icon="mdi:mdi-open-in-new"
                href="https://twitter.com/NestSimulator"
                prepend-icon="mdi:mdi-twitter"
                target="_blank"
              >
                https://twitter.com/NestSimulator
              </v-list-item>
              <v-list-item
                append-icon="mdi:mdi-open-in-new"
                href="https://www.ebrains.eu/tools/nest"
                prepend-icon="mdi:mdi-brain"
                target="_blank"
              >
                https://www.ebrains.eu/tools/nest
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col md="6">
        <v-expansion-panels variant="accordion">
          <v-expansion-panel title="Backend settings">
            <v-expansion-panel-text>
              <v-tabs v-model="state.backendTab" density="compact">
                <v-tab
                  :key="index"
                  :value="backend.state.name"
                  v-for="(backend, index) in appStore.currentSimulator.backends"
                >
                  {{ backend.state.name }}
                  <template #append>
                    <v-icon
                      :color="
                        backend.state.enabled
                          ? backend.isOK && backend.isValid
                            ? 'green'
                            : 'red'
                          : ''
                      "
                      class="mx-1"
                      icon="mdi:mdi-circle"
                    />
                  </template>
                </v-tab>
              </v-tabs>

              <!-- <v-btn-toggle
                class="mx-1"
                density="compact"
                divided
                v-model="state.backendTab"
              >
                <v-btn
                  :key="index"
                  :value="backend.state.name"
                  variant="outlined"
                  v-for="(backend, index) in appStore.currentSimulator.backends"
                >
                  {{ backend.state.name }}
                  <v-icon
                    :color="
                      backend.state.enabled
                        ? backend.isOK && backend.isValid
                          ? 'green'
                          : 'red'
                        : ''
                    "
                    class="mx-1"
                    icon="mdi:mdi-circle"
                  />
                </v-btn>
              </v-btn-toggle> -->

              <v-window v-model="state.backendTab" class="mx-2">
                <v-window-item
                  :key="index"
                  :value="backend.state.name"
                  v-for="(backend, index) in appStore.currentSimulator.backends"
                >
                  <backend-settings :store="backend" />
                </v-window-item>
              </v-window>
            </v-expansion-panel-text>
          </v-expansion-panel>

          <v-expansion-panel
            :disabled="
              appStore.currentSimulator.stores.modelStore.state.models
                .length === 0
            "
          >
            <v-expansion-panel-title>
              Models from NEST backend
              <v-spacer />

              <v-btn
                @click.stop="openNESTModuleDialog()"
                class="mx-1"
                flat
                icon="nest:build-models"
                size="x-small"
                title="Generate NESTML models"
              />
            </v-expansion-panel-title>

            <v-expansion-panel-text class="pa-2">
              <NESTModuleSelect
                :hide-details="false"
                @update:model-value="
                  (item) =>
                    item
                      ? nestSimulator.installModule(item.name)
                      : resetKernel()
                "
                clearable
                return-object
                v-model="state.selectedModule"
              >
                <!-- <template #append>
                  <v-btn
                    @click="
                      nestSimulator.installModule(state.selectedModule.name)
                    "
                    flat
                    icon="nest:install-module"
                    size="x-small"
                    title="Install module"
                  />
                </template> -->
                <template #details>
                  <span
                    :title="customModels?.join(',')"
                    density="compact"
                    variant="text"
                    v-if="customModels ? customModels.length > 0 : false"
                  >
                    {{ customModels?.length }}
                    custom model
                    <span
                      v-show="customModels ? customModels.length > 1 : false"
                    >
                      s
                    </span>
                  </span>
                </template>
              </NESTModuleSelect>

              <v-text-field
                class="my-2"
                clearable
                density="compact"
                label="Search model"
                placeholder="Search model"
                prepend-inner-icon="mdi:mdi-magnify"
                v-model="state.modelSearch"
                variant="outlined"
              >
                <!-- <template #append>
                  <v-btn
                    @click="nestSimulator.fetchModels()"
                    flat
                    icon="mdi:mdi-refresh"
                    size="x-small"
                    title="Fetch models"
                  />
                </template> -->
                <template #details>
                  {{ models.length }} model
                  <span v-show="models.length > 1">s</span>
                </template>
              </v-text-field>

              <v-list density="compact">
                <template v-for="model in models">
                  <v-list-item>
                    {{ model.id }}
                    <template #append>
                      <span class="text-caption">
                        {{ model.elementType }}
                      </span>
                    </template>
                  </v-list-item>
                </template>
              </v-list>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <StoreList />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { computed, reactive } from "vue";

import BackendSettings from "@/components/BackendSettings.vue";
import StoreList from "@/components/StoreList.vue";
import nestLogo from "@/assets/img/logo/nest-logo.svg";

import NESTModuleSelect from "../components/module/NESTModuleSelect.vue";
import nestSimulator, {
  IModelProps,
} from "../stores/backends/nestSimulatorStore";
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
  const models = appStore.currentSimulator.stores.modelStore.state.models;
  return state.modelSearch
    ? models.filter((model: IModelProps) =>
        model.id.includes(state.modelSearch)
      )
    : models;
});

const resetKernel = () => {
  nestSimulator.resetKernel();
};
</script>
