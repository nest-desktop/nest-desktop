<template>
  <v-container>
    <v-row>
      <v-col md="6">
        <v-card>
          <v-img :src="norseLogo" alt="norse-logo" class="ma-2 mx-10" />

          <v-card-subtitle> Deep learning with spiking neural networks in PyTorch </v-card-subtitle>

          <v-card-text>
            Norse aims to exploit the advantages of bio-inspired neural components, which are sparse and event-driven -
            a fundamental difference from artificial neural networks. Norse expands PyTorch with primitives for
            bio-inspired neural components, bringing you two advantages: a modern and proven infrastructure based on
            PyTorch and deep learning-compatible spiking neural network components.
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
                <BackendStatusIcon :backend-store="norseSimulatorStore" :title="norseSimulatorStore.state.name" />
              </v-expansion-panel-title>

              <v-expansion-panel-text>
                <v-window class="mx-2">
                  <BackendSettings :store="norseSimulatorStore" />
                </v-window>
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
import BackendSettings from "@/components/BackendSettings.vue";
import BackendStatusIcon from "@/components/iconsets/BackendStatusIcon.vue";
import StoreList from "@/components/StoreList.vue";
import norseLogo from "@/assets/img/logo/norse-logo.png";
import { TStore } from "@/types";

import { useNorseSimulatorStore } from "../stores/backends/norseSimulatorStore";
const norseSimulatorStore: TStore = useNorseSimulatorStore();

const refItems = [
  {
    href: "https://github.io/norse",
    prependIcon: "mdi:mdi-github",
    title: "https://github.com/norse",
  },
  {
    href: "https://norse.github.io/norse",
    prependIcon: "mdi:mdi-book-open",
    title: "https://norse.github.io/norse",
  },
];
</script>
