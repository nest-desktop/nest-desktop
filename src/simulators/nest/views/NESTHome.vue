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
        <v-card>
          <v-card-title> Settings </v-card-title>

          <v-tabs density="compact" v-model="tab">
            <v-tab value="one">NEST Simulator</v-tab>
            <v-tab value="two">Insite Access</v-tab>
          </v-tabs>

          <v-card-text>
            <v-window v-model="tab">
              <v-window-item value="one">
                <v-row>
                  <v-col cols="1">
                    <v-checkbox v-model="nestSimulatorStore.enabled" />
                  </v-col>
                  <v-col cols="11">
                    <v-text-field
                      :disabled="!nestSimulatorStore.enabled"
                      class="my-2"
                      density="compact"
                      label="URL of backend"
                      v-model="nestSimulatorStore.url"
                      variant="outlined"
                    >
                      <template #append>
                        <v-btn
                          @click="nestSimulatorStore.ping()"
                          variant="outlined"
                        >
                          <template #append>
                            <v-icon
                              icon="mdi-circle"
                              :color="nestSimulatorStore.isOK ? 'green' : 'red'"
                            ></v-icon>
                          </template>
                          ping
                        </v-btn>
                      </template>

                      <template #details>
                        <div
                          v-if="
                            nestSimulatorStore.isOK &&
                            nestSimulatorStore.isValid
                          "
                        >
                          {{ nestSimulatorStore.response.data }}
                        </div>
                        <div v-else>
                          {{ nestSimulatorStore.error }}
                        </div>
                      </template>
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-window-item>

              <v-window-item value="two">
                <v-row>
                  <v-col cols="1">
                    <v-checkbox v-model="insiteAccessStore.enabled" />
                  </v-col>
                  <v-col cols="11">
                    <v-text-field
                      :disabled="!insiteAccessStore.enabled"
                      class="my-2"
                      density="compact"
                      label="URL of backend"
                      v-model="insiteAccessStore.url"
                      variant="outlined"
                    >
                      <template #append>
                        <v-btn
                          @click="insiteAccessStore.ping()"
                          variant="outlined"
                        >
                          <template #append>
                            <v-icon
                              icon="mdi-circle"
                              :color="insiteAccessStore.isOK ? 'green' : 'red'"
                            ></v-icon>
                          </template>
                          ping
                        </v-btn>
                      </template>

                      <template #details>
                        <div
                          v-if="
                            insiteAccessStore.isOK &&
                            insiteAccessStore.isValid
                          "
                        >
                          {{ insiteAccessStore.response.data }}
                        </div>
                        <div v-else>
                          {{ insiteAccessStore.error }}
                        </div>
                      </template>
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>

        <v-card class="mt-2">
          <v-card-title> Projects </v-card-title>
          <v-list lines="two" nav>
            <v-list-item to="/nest/project/new">
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
              :to="'/nest/project/' + project._id"
              v-for="(project, index) in projectDBStore.projects"
            />
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from "vue";
import nestLogo from "@/assets/img/logo/nest-logo.svg";

import { useInsiteAccessStore } from "@nest/store/backends/insiteAccessStore";
import { useNESTSimulatorStore } from "@nest/store/backends/nestSimulatorStore";
import { useNESTProjectDBStore } from "@nest/store/project/nestProjectDBStore";

const projectDBStore = useNESTProjectDBStore();
const nestSimulatorStore = useNESTSimulatorStore();
const insiteAccessStore = useInsiteAccessStore();

const tab = ref("one");
//
</script>
