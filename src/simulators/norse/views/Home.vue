<template>
  <v-container>
    <v-row>
      <v-col md="6">
        <v-card>
          <v-card-title>
            <v-img
              :src="norseLogo"
              class="mx-10"
            />
          </v-card-title>
          <v-card-subtitle>
            Deep learning with spiking neural networks in PyTorch
          </v-card-subtitle>
          <v-card-text>
            Norse aims to exploit the advantages of bio-inspired neural
            components, which are sparse and event-driven - a fundamental
            difference from artificial neural networks. Norse expands PyTorch
            with primitives for bio-inspired neural components, bringing you two
            advantages: a modern and proven infrastructure based on PyTorch and
            deep learning-compatible spiking neural network components.
          </v-card-text>
        </v-card>

        <v-card class="mt-2">
          <v-card-title>References</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                append-icon="mdi:mdi-open-in-new"
                href="https://norse.github.io/norse"
                prepend-icon="mdi:mdi-github"
                target="_blank"
              >
                https://github.com/norse
              </v-list-item>
              <v-list-item
                append-icon="mdi:mdi-open-in-new"
                href="https://norse.github.io/norse"
                prepend-icon="mdi:mdi-book-open"
                target="_blank"
              >
                https://norse.github.io/norse
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col md="6">
        <v-expansion-panels>
          <v-expansion-panel title="Backend settings">
            <v-expansion-panel-text>
              <backend-settings :store="norseSimulatorStore" />
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <store-list
          :stores
          simulator="norse"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import BackendSettings from "@/components/BackendSettings.vue";
import StoreList from "@/components/StoreList.vue";
import norseLogo from "@/assets/img/logo/norse-logo.png";

import { useNorseModelDBStore } from "../stores/model/modelDBStore";
const modelDBStore = useNorseModelDBStore();

import { useNorseModelStore } from "../stores/model/modelStore";
const modelStore = useNorseModelStore();

import { useNorseProjectDBStore } from "../stores/project/projectDBStore";
const projectDBStore = useNorseProjectDBStore();

import { useNorseProjectStore } from "../stores/project/projectStore";
const projectStore = useNorseProjectStore();

import { useNorseSimulatorStore } from "../stores/backends/norseSimulatorStore";
const norseSimulatorStore = useNorseSimulatorStore();

const stores = { modelDBStore, modelStore, projectStore, projectDBStore };
</script>
