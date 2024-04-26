<template>
  <v-container>
    <v-row>
      <v-col md="6">
        <v-card>
          <v-img :src="pynnLogo" class="ma-2 mx-10" max-height="400" />

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

        <v-card class="mt-2">
          <v-card-title>References</v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                append-icon="mdi:mdi-open-in-new"
                href="http://neuralensemble.org/PyNN/"
                prepend-icon="mdi:mdi-home"
                target="_blank"
              >
                http://neuralensemble.org/PyNN/
              </v-list-item>
              <v-list-item
                append-icon="mdi:mdi-open-in-new"
                href="https://github.com/NeuralEnsemble/PyNN/"
                prepend-icon="mdi:mdi-github"
                target="_blank"
              >
                https://github.com/NeuralEnsemble/PyNN/
              </v-list-item>
              <v-list-item
                append-icon="mdi:mdi-open-in-new"
                href="http://neuralensemble.org/docs/PyNN/"
                prepend-icon="mdi:mdi-book-open"
                target="_blank"
              >
                http://neuralensemble.org/docs/PyNN/
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col md="6">
        <v-expansion-panels variant="accordion">
          <v-expansion-panel title="Backend settings">
            <v-expansion-panel-text>
              <backend-settings :store="pynnSimulatorStore" />
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <StoreList
          :modelDBStore
          :modelStore
          :projectStore
          :projectDBStore
          simulator="pynn"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import BackendSettings from "@/components/BackendSettings.vue";
import StoreList from "@/components/StoreList.vue";
import pynnLogo from "@/assets/img/logo/pynn-logo.png";

import { usePyNNModelDBStore } from "../stores/model/modelDBStore";
const modelDBStore = usePyNNModelDBStore();

import { usePyNNModelStore } from "../stores/model/modelStore";
const modelStore = usePyNNModelStore();

import { usePyNNProjectDBStore } from "../stores/project/projectDBStore";
const projectDBStore = usePyNNProjectDBStore();

import { usePyNNProjectStore } from "../stores/project/projectStore";
const projectStore = usePyNNProjectStore();

import { usePyNNSimulatorStore } from "../stores/backends/pynnSimulatorStore";
const pynnSimulatorStore = usePyNNSimulatorStore();
</script>
