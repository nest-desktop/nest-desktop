<template>
  <v-container>
    <v-row>
      <v-col md="6">
        <v-card>
          <v-card-title>
            <v-img class="mx-10" :src="nestLogo" />
          </v-card-title>
          <v-card-subtitle>
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
                <v-list-item prepend-icon="mdi-numeric-1-circle-outline">
                  Models of information processing e.g. in the visual or
                  auditory cortex of mammals,
                </v-list-item>
                <v-list-item prepend-icon="mdi-numeric-2-circle-outline">
                  Models of network activity dynamics, e.g. laminar cortical
                  networks or balanced random networks,
                </v-list-item>
                <v-list-item prepend-icon="mdi-numeric-3-circle-outline">
                  Models of learning and plasticity.
                </v-list-item>
              </v-list>
            </div>
          </v-card-text>
        </v-card>

        <v-card class="mt-2">
          <v-card-title> References </v-card-title>
          <v-card-text>
            <v-list density="compact">
              <v-list-item
                append-icon="mdi-open-in-new"
                href="https://nest-initiative.org/"
                prepend-icon="mdi-home"
                target="_blank"
              >
                https://nest-initiative.org/
              </v-list-item>
              <v-list-item
                append-icon="mdi-open-in-new"
                href="https://github.com/nest/nest-simulator/"
                prepend-icon="mdi-github"
                target="_blank"
              >
                https://github.com/nest/nest-simulator/
              </v-list-item>
              <v-list-item
                append-icon="mdi-open-in-new"
                href="https://nest-simulator.readthedocs.io/"
                prepend-icon="mdi-book-open"
                target="_blank"
              >
                https://nest-simulator.readthedocs.io/
              </v-list-item>

              <v-list-item
                append-icon="mdi-open-in-new"
                href="https://twitter.com/NestSimulator"
                prepend-icon="mdi-twitter"
                target="_blank"
              >
                https://twitter.com/NestSimulator
              </v-list-item>
              <v-list-item
                append-icon="mdi-open-in-new"
                href="https://www.ebrains.eu/tools/nest"
                prepend-icon="mdi-brain"
                target="_blank"
              >
                https://www.ebrains.eu/tools/nest
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col md="6">
        <v-expansion-panels>
          <v-expansion-panel title="Backend settings">
            <v-expansion-panel-text class="ma-0 pa-0">
              <v-tabs density="compact" v-model="backendTab">
                <v-tab value="one">NEST Simulator</v-tab>
                <v-tab value="two">Insite Access</v-tab>
              </v-tabs>
              <v-window v-model="backendTab">
                <v-window-item value="one">
                  <backend-settings :store="nestSimulatorStore" />
                </v-window-item>

                <v-window-item value="two">
                  <backend-settings :store="insiteAccessStore" />
                </v-window-item>
              </v-window>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <store-list :stores="stores" simulator="nest" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";

import BackendSettings from "@/components/BackendSettings.vue";
import StoreList from "@/components/StoreList.vue";

import nestLogo from "@/assets/img/logo/nest-logo.svg";

import { useNESTModelDBStore } from "../store/model/modelDBStore";
const modelDBStore = useNESTModelDBStore();

import { useNESTProjectDBStore } from "../store/project/projectDBStore";
const projectDBStore = useNESTProjectDBStore();

import { useNESTModelStore } from "../store/model/modelStore";
const modelStore = useNESTModelStore();

import { useNESTProjectStore } from "../store/project/projectStore";
const projectStore = useNESTProjectStore();

import { useNESTSimulatorStore } from "../store/backends/nestSimulatorStore";
const nestSimulatorStore = useNESTSimulatorStore();

import { useInsiteAccessStore } from "../store/backends/insiteAccessStore";
const insiteAccessStore = useInsiteAccessStore();

const stores = { modelDBStore, modelStore, projectStore, projectDBStore };

const backendTab = ref("one");
</script>
