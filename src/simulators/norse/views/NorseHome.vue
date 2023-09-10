<template>
  <v-container>
    <v-row>
      <v-col md="6">
        <v-card>
          <v-card-title>
            <v-img class="mx-10" :src="norseLogo" />
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
          <v-card-title> References </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item
                append-icon="mdi-open-in-new"
                href="https://norse.github.io/norse"
                prepend-icon="mdi-github"
                target="_blank"
              >
                https://github.com/norse
              </v-list-item>
              <v-list-item
                append-icon="mdi-open-in-new"
                href="https://norse.github.io/norse"
                prepend-icon="mdi-book-open"
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
          <v-expansion-panel>
            <v-expansion-panel-title> Settings </v-expansion-panel-title>
            <v-expansion-panel-text>
              <v-row>
                <v-col cols="1">
                  <v-checkbox v-model="norseSimulatorStore.enabled" />
                </v-col>
                <v-col cols="11">
                  <v-text-field
                    :disabled="!norseSimulatorStore.enabled"
                    density="compact"
                    label="URL of backend"
                    v-model="norseSimulatorStore.url"
                    variant="outlined"
                  >
                    <template #append>
                      <v-btn
                        @click="norseSimulatorStore.ping()"
                        variant="outlined"
                      >
                        <template #append>
                          <v-icon
                            icon="mdi-circle"
                            :color="norseSimulatorStore.isOK ? 'green' : 'red'"
                          />
                        </template>
                        ping
                      </v-btn>
                    </template>

                    <template #details>
                      <div
                        v-if="
                          norseSimulatorStore.isOK &&
                          norseSimulatorStore.isValid
                        "
                      >
                        {{ norseSimulatorStore.response.data }}
                      </div>
                      <div v-else>
                        {{ norseSimulatorStore.error }}
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
            <v-list-item :to="{ name: 'norseProjectNew' }">
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
                name: 'norseProject',
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
import norseLogo from "@/assets/img/logo/norse-logo.png";

import { useNorseProjectDBStore } from "../store/project/norseProjectDBStore";
const projectDBStore = useNorseProjectDBStore();

import { useNorseSimulatorStore } from "../store/backends/norseSimulatorStore";
const norseSimulatorStore = useNorseSimulatorStore();
//
</script>
