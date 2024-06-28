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

          <v-expansion-panel :disabled="modelStore.state.models.length === 0">
            <v-expansion-panel-title>
              Models in backend
              <v-spacer />

              <v-btn
                @click.stop="resetKernel"
                class="mx-2"
                flat
                icon="mdi:mdi-delete-empty-outline"
                title="Reset kernel"
                size="x-small"
              />
            </v-expansion-panel-title>

            <v-expansion-panel-text class="pa-2">
              <NESTModuleSelect v-model="state.selectedModule">
                <template #append>
                  <v-btn
                    @click="generateModels"
                    flat
                    icon="nest:build-models"
                    size="x-small"
                    title="Generate models"
                  />

                  <v-btn
                    @click="installModule"
                    flat
                    icon="nest:install-module"
                    size="x-small"
                    title="Install module"
                  />
                </template>
              </NESTModuleSelect>

              {{ state.selectedModule.models.length }} models

              <v-text-field
                class="my-2"
                clearable
                density="compact"
                hide-details
                label="Search model"
                placeholder="Search model"
                prepend-inner-icon="mdi:mdi-magnify"
                v-model="state.modelSearch"
                variant="outlined"
              >
                <template #append>
                  <v-btn
                    @click="fetchModels"
                    flat
                    icon="mdi:mdi-refresh"
                    size="x-small"
                    title="Fetch models"
                  />
                </template>
              </v-text-field>

              <v-list>
                <template v-for="model in modelStore.state.models">
                  <v-list-item v-show="model.includes(state.modelSearch)">
                    {{ model }}
                  </v-list-item>
                </template>
              </v-list>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <StoreList
          :modelDBStore
          :modelStore
          :projectStore
          :projectDBStore
          simulator="nest"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { AxiosError, AxiosResponse } from "axios";
import { reactive } from "vue";

import BackendSettings from "@/components/BackendSettings.vue";
import StoreList from "@/components/StoreList.vue";
import nestLogo from "@/assets/img/logo/nest-logo.svg";
import { TModelDBStore } from "@/stores/model/defineModelDBStore";
import { TModelStore } from "@/stores/model/defineModelStore";
import { TProjectDBStore } from "@/stores/project/defineProjectDBStore";
import { TProjectStore } from "@/stores/project/defineProjectStore";
import { notifyError, notifySuccess } from "@/helpers/common/dialog";

import NESTModuleSelect from "../components/model/NESTModuleSelect.vue";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

import { useNESTModelDBStore } from "../stores/model/modelDBStore";
const modelDBStore: TModelDBStore = useNESTModelDBStore();

import { useModuleStore } from "../stores/moduleStore";
const moduleStore = useModuleStore();

import { useNESTProjectDBStore } from "../stores/project/projectDBStore";
const projectDBStore: TProjectDBStore = useNESTProjectDBStore();

import { useNESTModelStore } from "../stores/model/modelStore";
const modelStore: TModelStore = useNESTModelStore();

import { useNESTProjectStore } from "../stores/project/projectStore";
const projectStore: TProjectStore = useNESTProjectStore();

import { useNESTMLServerStore } from "../stores/backends/nestmlServerStore";
const nestmlServerStore = useNESTMLServerStore();

import { useNESTSimulatorStore } from "../stores/backends/nestSimulatorStore";
const nestSimulatorStore = useNESTSimulatorStore();

const state = reactive({
  backendTab: "nest",
  modelSearch: "",
  modelsLength: 0,
  selectedModule: moduleStore.findModule("nestmlmodule"),
});

const fetchModels = () => {
  nestSimulatorStore
    .axiosInstance()
    .get("/api/Models")
    .then((response: AxiosResponse) => {
      if (response.data && response.data.length > 0) {
        modelStore.state.models = response.data;
      }
    });
};

const generateModels = () => {
  const models = state.selectedModule.models
    .filter((modelId: string) => modelDBStore.hasModel(modelId))
    .map((modelId: string) => ({
      name: state.selectedModule.id,
      script: modelDBStore.findModel(modelId).nestmlScript,
    }));

  if (!models && models.length === 0) return;

  nestmlServerStore
    .axiosInstance()
    .post("/generateModels", {
      module_name: state.selectedModule.id,
      models: models,
    })
    .then((response: AxiosResponse) => {
      switch (response.status) {
        case 200:
          notifySuccess(
            `Models (${response.data.status["INSTALLED"].join(
              ","
            )}) are successfully generated in "${
              state.selectedModule.id
            }" module.`
          );
          break;
        case 400:
          notifyError("Failed to generate model.");
          break;
      }
    })
    .catch((error: AxiosError) => {
      notifyError(error.message);
    });
};

const installModule = () => {
  nestSimulatorStore
    .axiosInstance()
    .post("/api/Install", { module_name: state.selectedModule.id })
    .then(fetchModels)
    .catch((error: AxiosError) => {
      if ("response" in error && error.response?.data != undefined) {
        // The request made and the server responded.
        if (typeof error.response.data === "string") {
          notifyError(error.response.data);
        }
      } else if ("request" in error) {
        // The request was made but no response was received.
        notifyError(
          "Failed to perform simulation (Simulator backend is not running)."
        );
      } else if ("message" in error && error.message != undefined) {
        // Something happened in setting up the request
        // that triggered an error.
        notifyError(error.message);
      }
    });
};

const resetKernel = () => {
  nestSimulatorStore.axiosInstance().get("/api/ResetKernel").then(fetchModels);
};
</script>
