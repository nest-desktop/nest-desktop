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
              <v-tabs v-model="backendTab" density="compact">
                <v-tab direction="vertical" value="nest">
                  NEST Simulator
                </v-tab>
                <v-tab direction="vertical" value="insite">
                  Insite Access
                </v-tab>
              </v-tabs>

              <v-window v-model="backendTab" class="mx-2">
                <v-window-item value="nest">
                  <backend-settings :store="nestSimulatorStore" />
                </v-window-item>
                <v-window-item value="insite">
                  <backend-settings :store="insiteAccessStore" />
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
                size="small"
              />
            </v-expansion-panel-title>
            <v-expansion-panel-text class="pa-2">
              <v-text-field
                class="my-2"
                clearable
                density="compact"
                hide-details
                label="Install module"
                placeholder="Install module"
                prepend-inner-icon="mdi:mdi-memory"
                v-model="module"
                variant="outlined"
              >
                <template #append>
                  <v-btn
                    @click="installModule"
                    flat
                    icon="nest:install-module"
                    title="Install module"
                  />
                </template>
              </v-text-field>

              <v-text-field
                class="my-2"
                clearable
                density="compact"
                hide-details
                label="Search model"
                placeholder="Search model"
                prepend-inner-icon="mdi:mdi-magnify"
                v-model="search"
                variant="outlined"
              >
                <template #append>
                  <v-btn
                    @click="fetchModels"
                    flat
                    icon="mdi:mdi-refresh"
                    title="Fetch models"
                  />
                </template>
              </v-text-field>

              <v-list>
                <template v-for="model in modelStore.state.models">
                  <v-list-item v-show="model.includes(search)">
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
import { ref } from "vue";

import BackendSettings from "@/components/BackendSettings.vue";
import StoreList from "@/components/StoreList.vue";
import nestLogo from "@/assets/img/logo/nest-logo.svg";
import { TModelStore } from "@/stores/model/defineModelStore";
import { TModelDBStore } from "@/stores/model/defineModelDBStore";
import { TProjectDBStore } from "@/stores/project/defineProjectDBStore";
import { TProjectStore } from "@/stores/project/defineProjectStore";

import { useNESTModelDBStore } from "../stores/model/modelDBStore";
const modelDBStore: TModelDBStore = useNESTModelDBStore();

import { useNESTProjectDBStore } from "../stores/project/projectDBStore";
const projectDBStore: TProjectDBStore = useNESTProjectDBStore();

import { useNESTModelStore } from "../stores/model/modelStore";
const modelStore: TModelStore = useNESTModelStore();

import { useNESTProjectStore } from "../stores/project/projectStore";
const projectStore: TProjectStore = useNESTProjectStore();

import { useNESTSimulatorStore } from "../stores/backends/nestSimulatorStore";
const nestSimulatorStore = useNESTSimulatorStore();

import { useInsiteAccessStore } from "../stores/backends/insiteAccessStore";
const insiteAccessStore = useInsiteAccessStore();

const backendTab = ref("nest");
const search = ref("");
const module = ref("nestmlmodule");

const fetchModels = () => {
  nestSimulatorStore
    .axiosInstance()
    .get("/api/Models")
    .then((response) => {
      // console.log(response);
      if (response.data && response.data.length > 0) {
        modelStore.state.models = response.data;
      }
    });
};

const installModule = () => {
  nestSimulatorStore
    .axiosInstance()
    .post("/api/Install", { module_name: module.value })
    .then(fetchModels);
};

const resetKernel = () => {
  nestSimulatorStore.axiosInstance().get("/api/ResetKernel").then(fetchModels);
};
</script>
