<template>
  <div
    class="home"
    style="
      left: 50%;
      position: relative;
      top: 50%;
      transform: translate(-50%, -50%);
      y-overflow: scroll;
    "
  >
    <!-- <v-app-bar app clipped-left color="black" dark dense flat>
      <v-toolbar-title>
        NEST Desktop
      </v-toolbar-title>
    </v-app-bar> -->

    <v-container
      align="center"
      class="ml-10"
      clipped-left
      fill-height
      fluid
      style="background-color: white"
    >
      <v-container align="center" justify="center">
        <v-row class="mb-15">
          <v-col class="pa-10 text-center">
            <v-img
              :src="require('@/assets/img/logo/nest-desktop-logo.png')"
              class="my-6"
              contain
              height="250"
            />

            <h1 class="display-3 font-weight-light" v-text="'NEST Desktop'" />
            <p class="subheading font-weight-regular ma-3">
              An educational GUI for neuroscience
            </p>
          </v-col>
        </v-row>

        <v-row align="center">
          <v-col class="text-center">
            <v-btn
              class="ma-3"
              outlined
              text
              to="project"
              v-text="'Start a new project'"
              width="210px"
            />
            <v-menu>
              <template #activator="{ on, attrs }">
                <v-btn
                  @click="loadProjects"
                  class="mx-3"
                  outlined
                  text
                  v-bind="attrs"
                  v-on="on"
                  width="210px"
                >
                  Load a project <v-icon right v-text="'mdi-dots-vertical'" />
                </v-btn>
              </template>
              <v-list dense>
                <v-list-item
                  :key="index"
                  :to="`project/${project.id}`"
                  v-for="(project, index) in state.projects"
                >
                  <v-list-item-title v-text="project.name" />
                </v-list-item>
              </v-list>
            </v-menu>
            <v-row align="center" class="mb-2 mt-2">
              <v-col align-self="stretch" cols="6">
                <v-card
                  align-center
                  class="app-details align-stretch"
                  d-flex
                  flat
                  height="100%"
                  min-height="182px"
                  outlined
                  tile
                >
                  <v-layout fill-height="true">
                    <v-card class="app-details align-center d-flex" flat>
                      <v-card-text align="left" class="mb-3 mt-3 py-0">
                        <p>
                          NEST Desktop is a web-based GUI application for NEST
                          Simulator, an advanced simulation tool for
                          computational neuroscience. The application enables
                          the rapid construction, parametrization, and
                          instrumentation of neuronal network models.
                        </p>
                        <p>
                          The primary objective is to provide an accessible
                          classroom tool that allows users to rapidly explore
                          neuroscience concepts without the need to learn a
                          simulator control language at the same time.
                        </p>
                      </v-card-text>
                    </v-card>
                  </v-layout>
                </v-card>
              </v-col>

              <v-col align-self="stretch" cols="6">
                <v-card
                  align-center
                  class="align-stretch app-details"
                  d-flex
                  flat
                  height="100%"
                  min-height="182px"
                  outlined
                  tile
                >
                  <v-layout fill-height="true">
                    <v-row align="center">
                      <v-col align="center" cols="12">
                        <v-card class="app-details align-end d-flex" flat>
                          <v-card-text align="center" class="py-0 text-center">
                            <About />
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-layout>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <v-row class="mt-2">
          <v-col
            :cols="3"
            :key="reference.title"
            v-for="reference in references"
          >
            <v-card flat outlined tile>
              <v-sheet :color="reference.color" class="pa-1">
                <v-img
                  :gradient="reference.gradient"
                  :href="reference.url"
                  :src="require(`@/assets/img/logo/` + reference.iconSrc)"
                  class="white--text align-end"
                  contain
                  max-height="50px"
                >
                </v-img>
              </v-sheet>
              <v-card-title
                ><a
                  :href="reference.url"
                  class="subtitle-1"
                  onmouseout="style='color: black; text-decoration:none'"
                  onmouseover="style='color: black; text-decoration:underline'"
                  style="color: black; text-decoration: none"
                  target="_blank"
                  text-decoration="none"
                  v-text="reference.title"
                ></a
              ></v-card-title>

              <!-- <v-card-actions>
              <v-spacer></v-spacer>

              <v-btn icon>
                <v-icon>mdi-heart</v-icon>
              </v-btn>

              <v-btn icon>
                <v-icon>mdi-bookmark</v-icon>
              </v-btn>

              <v-btn icon>
                <v-icon>mdi-share-variant</v-icon>
              </v-btn>
            </v-card-actions> -->
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive } from '@vue/composition-api';
import core from '@/core';

import About from '@/components/About.vue';

export default Vue.extend({
  name: 'Home',
  components: {
    About,
  },
  setup() {
    const references = [
      {
        iconSrc: 'ebrains-logo.png',
        color: 'rgba(178, 245, 23, 0.1)',
        title: 'EBRAINS',
        url: 'https://www.ebrains.eu',
      },
      {
        color: 'rgba(17,31,138,0.1)',
        iconSrc: 'eu-logo.png',
        title: 'European Union',
        url: 'https://europa.eu/european-union/index_en',
      },
      {
        iconSrc: 'hbp-logo.jpeg',
        color: 'rgba(16, 188, 220, 0.1)',
        title: 'Human Brain Project',
        url: 'https://www.humanbrainproject.eu',
      },
      {
        iconSrc: 'nest-simulated.png',
        color: 'rgba(255,102,51,0.1)',
        title: 'NEST Simulator',
        url: 'https://www.nest-simulator.org',
      },
    ];
    const state = reactive({
      projects: core.app.projects,
    });

    /**
     * Load projects from app core component
     */
    const loadProjects = () => {
      state.projects = core.app.projects;
    };

    return { loadProjects, references, state };
  },
});
</script>

<style>
.app-details .v-list {
  font-size: 12px;
}

.app-details .v-list-item {
  min-height: 28px !important;
}
.app-details a {
  text-decoration: none;
  color: black;
}
.app-details .col-4,
.app-details .col-8 {
  padding: 4px;
}
</style>
