<template>
  <v-container>
    <v-row>
      <v-col md="6">
        <v-card>
          <v-img
            :src="pynnLogo"
            alt="pynn-logo"
            class="ma-2 mx-10"
            max-height="400"
          />

          <v-card-subtitle>
            An integration layer for neural simulation
          </v-card-subtitle>

          <v-card-text>
            <p>
              PyNN (pronounced 'pine') is a simulator-independent language for
              building spiking neuronal network models. A PyNN script runs
              without modification on any simulator or neuromorphic hardware
              platform that PyNN supports (currently NEURON, NEST, PCSIM, MOOSE,
              Brian, the BrainScaleS platform and the SpiNNaker platform).
            </p>
            <p>
              PyNN provides a library of standard neuron, synapse and synaptic
              plasticity models, which have been verified to work the same on
              the different supported simulators. PyNN also provides a set of
              commonly-used connectivity algorithms (e.g. all-to-all, random,
              distance-dependent, small-world) but makes it easy to provide your
              own connectivity in a simulator-independent way.
            </p>
            <p>
              Even if you don't wish to run simulations on multiple simulators,
              you may benefit from writing your simulation code using PyNN's
              powerful, high-level interface. In this case, you can use any
              neuron or synapse model supported by your simulator, and are not
              restricted to the standard models.
            </p>
          </v-card-text>
        </v-card>

        <v-card class="mt-2" elevation="1">
          <v-card-title>References</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                :key="index"
                append-icon="mdi:mdi-open-in-new"
                target="_blank"
                v-bind="refItem"
                v-for="(refItem, index) in refItems"
              />
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col md="6">
        <v-card elevation="1" title="Backend">
          <v-expansion-panels elevation="0" title variant="accordion">
            <v-expansion-panel>
              <v-expansion-panel-title>
                Backend settings
                <v-spacer />
                <BackendStatusIcon
                  :backend-store="pynnSimulatorStore"
                  :title="pynnSimulatorStore.state.name"
                />
              </v-expansion-panel-title>

              <v-expansion-panel-text>
                <v-window class="mx-2">
                  <BackendSettings :store="pynnSimulatorStore" />
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
import pynnLogo from "@/assets/img/logo/pynn-logo.png";
import { TBackendStore } from "@/stores/defineBackendStore";

import { usePyNNSimulatorStore } from "../stores/backends/pynnSimulatorStore";
import BackendStatusIcon from "@/components/iconsets/BackendStatusIcon.vue";
const pynnSimulatorStore: TBackendStore = usePyNNSimulatorStore();

const refItems = [
  {
    href: "http://neuralensemble.org/PyNN/",
    prependIcon: "mdi:mdi-home",
    title: "http://neuralensemble.org/PyNN/",
  },
  {
    href: "https://github.com/NeuralEnsemble/PyNN/",
    prependIcon: "mdi:mdi-github",
    title: "https://github.com/NeuralEnsemble/PyNN/",
  },
  {
    href: "http://neuralensemble.org/docs/PyNN/",
    prependIcon: "mdi:mdi-book-open",
    title: "http://neuralensemble.org/docs/PyNN/",
  },
];
</script>
