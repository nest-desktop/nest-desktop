<template>
  <v-container>
    <v-row>
      <v-col md="6">
        <v-card>
          <v-img :src="elephantLogo" alt="elephant-logo" class="ma-2 mx-10" max-height="400" />

          <v-card-subtitle>The analysis of electrophysiological data</v-card-subtitle>

          <v-card-text>
            <p>
              The focus of Elephant is on generic analysis functions for spike train data and time series recordings
              from electrodes, such as the local field potentials (LFP) or intracellular voltages. In addition to
              providing a common platform for analysis codes from different laboratories, the Elephant project aims to
              provide a consistent and homogeneous analysis framework that is built on a modular foundation. Elephant is
              the direct successor to Neurotools and maintains ties to complementary projects such as ephyviewer and
              neurotic for raw data visualization. Elephant (pronounced 'pine') is a simulator-independent language for
              building spiking neuronal network models. A Elephant script runs without modification on any simulator or
              neuromorphic hardware platform that Elephant supports (currently NEURON, NEST, PCSIM, MOOSE, Brian, the
              BrainScaleS platform and the SpiNNaker platform).
            </p>
            <p>
              The input-output data format is either Neo, Quantity or Numpy array. Quantity is a Numpy-wrapper package
              for handling physical quantities like seconds, milliseconds, Hz, volts, etc. Quantity is used in both Neo
              and Elephant.
            </p>
          </v-card-text>
        </v-card>

        <v-card class="mt-2" title="References">
          <v-card-text>
            <v-list>
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
          <v-expansion-panels elevation="0" title variant="accordion">
            <v-expansion-panel>
              <v-expansion-panel-title>
                Backend settings
                <v-spacer />
                <BackendStatusIcon :backend-store="elephantServerStore" :title="elephantServerStore.state.name" />
              </v-expansion-panel-title>

              <v-expansion-panel-text>
                <v-window class="mx-2">
                  <BackendSettings :store="elephantServerStore" />
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
import StoreList from "@/components/StoreList.vue";
import elephantLogo from "@/assets/img/logo/elephant-logo.png";
import BackendStatusIcon from "@/components/iconsets/BackendStatusIcon.vue";

import { useElephantServerStore } from "../stores/backends/elephantServerStore";
const elephantServerStore = useElephantServerStore();

const refItems = [
  {
    href: "http://neuralensemble.org/elephant/",
    prependIcon: "mdi:mdi-home",
    title: "http://neuralensemble.org/elephant/",
  },
  {
    href: "https://github.com/neuralensemble/elephant/",
    prependIcon: "mdi:mdi-github",
    title: "https://github.com/neuralensemble/elephant/",
  },
  {
    href: "http://neuralensemble.org/docs/elephant/",
    prependIcon: "mdi:mdi-book-open",
    title: "http://neuralensemble.org/docs/elephant/",
  },
];
</script>
