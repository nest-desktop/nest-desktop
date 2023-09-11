<template>
  <v-container>
    <v-row>
      <v-col md="6">
        <v-card>
          <v-card-title>
            <v-img class="mx-10" :src="pynnLogo" max-height="400" />
          </v-card-title>
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
            <p>
              PyNN is open-source software (CeCILL licence). For downloads and
              full documentation see http://neuralensemble.org/PyNN/. For more
              information, see Davison et al. (2009)
            </p>
          </v-card-text>
        </v-card>

        <v-card class="mt-2">
          <v-card-title> References </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                append-icon="mdi-open-in-new"
                href="https://pynn.github.io/pynn"
                prepend-icon="mdi-github"
                target="_blank"
              >
                https://github.com/pynn
              </v-list-item>
              <v-list-item
                append-icon="mdi-open-in-new"
                href="https://pynn.github.io/pynn"
                prepend-icon="mdi-book-open"
                target="_blank"
              >
                https://pynn.github.io/pynn
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col md="6">
        <v-expansion-panels>
          <v-expansion-panel>
            <v-expansion-panel-title> Settings </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-row>
                <v-col cols="1">
                  <v-checkbox v-model="pynnSimulatorStore.enabled" />
                </v-col>
                <v-col cols="11">
                  <v-text-field
                    :disabled="!pynnSimulatorStore.enabled"
                    density="compact"
                    label="URL of backend"
                    v-model="pynnSimulatorStore.url"
                    variant="outlined"
                  >
                    <template #append>
                      <v-btn
                        @click="pynnSimulatorStore.ping()"
                        variant="outlined"
                      >
                        <template #append>
                          <v-icon
                            icon="mdi-circle"
                            :color="pynnSimulatorStore.isOK ? 'green' : 'red'"
                          />
                        </template>
                        ping
                      </v-btn>
                    </template>

                    <template #details>
                      <div
                        v-if="
                          pynnSimulatorStore.isOK && pynnSimulatorStore.isValid
                        "
                      >
                        {{ pynnSimulatorStore.response.data }}
                      </div>
                      <div v-else>
                        {{ pynnSimulatorStore.error }}
                      </div>
                    </template>
                  </v-text-field>
                </v-col>
              </v-row>
            </v-expansion-panel-text>
          </v-expansion-panel>
        </v-expansion-panels>

        <v-card class="mt-2">
          <v-card-title> Projects </v-card-title>
          <v-list lines="two" nav>
            <v-list-item :to="{ name: 'pynnProjectNew' }">
              <template #prepend>
                <v-icon icon="mdi-plus" />
              </template>
              New project
            </v-list-item>
            <v-divider />
            <v-list-subheader>Existing projects</v-list-subheader>
            <v-list-item
              :key="index"
              :subtitle="`${project.network.nodes.length} nodes, ${project.network.connections.length} connections`"
              :title="project.name"
              :to="{
                name: 'pynnProject',
                params: { projectId: project.id },
              }"
              v-for="(project, index) in projectDBStore.projects"
            >
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import pynnLogo from "@/assets/img/logo/pynn-logo.png";

import { usePyNNProjectDBStore } from "../store/project/projectDBStore";
const projectDBStore = usePyNNProjectDBStore();

import { usePyNNSimulatorStore } from "../store/backends/pynnSimulatorStore";
const pynnSimulatorStore = usePyNNSimulatorStore();
</script>
