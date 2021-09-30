<template>
  <div
    class="home"
    style="
      left: 50%;
      position: relative;
      top: 38%;
      transform: translate(-50%, -38%);
      y-overflow: scroll;
    "
  >
    <!-- <v-app-bar app clipped-left color="black" dark dense flat>
      <v-toolbar-title>
        NEST Desktop
      </v-toolbar-title>
    </v-app-bar> -->

    <v-container
      style="background-color: white"
      fill-height
      fluid
      clipped-left
      class="ml-10"
      align="center"
    >
      <v-container align="center" justify="center">
        <v-row>
          <v-col class="text-center pa-10">
            <v-img
              :src="require('@/assets/img/logo/nest-desktop-logo.png')"
              class="my-6"
              contain
              height="200"
            />

            <h1 class="display-3 font-weight-light" v-text="'NEST Desktop'" />
            <p class="subheading font-weight-regular ma-3">
              An educational GUI for neuroscience
            </p>
          </v-col>
        </v-row>

        <v-row align="center">
          <v-col class="text-center">
            <v-row align="center" class="mb-2">
              <v-col cols="6" align-self="stretch">
                <v-card
                  elevation="1"
                  class="app-details align-stretch"
                  tile
                  outlined
                  height="100%"
                  min-height="182px"
                  d-flex
                  align-center
                >
                  <v-layout fill-height="true">
                    <v-card flat class="app-details d-flex align-center">
                      <v-card-text align="left" class="py-0 mt-3 mb-3">
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

              <v-col cols="6" align-self="stretch">
                <v-card
                  elevation="1"
                  class="app-details align-stretch"
                  tile
                  outlined
                  height="100%"
                  min-height="182px"
                  d-flex
                  align-center
                >
                  <v-layout fill-height="true">
                    <v-row align="center">
                      <v-col cols="12" align="center">
                        <v-card flat class="app-details d-flex align-end">
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
            <v-btn
              class="ma-3"
              to="project"
              v-text="'Start a new project'"
              width="210px"
            />
            <v-menu>
              <template #activator="{ on, attrs }">
                <v-btn
                  @click="loadProjects"
                  class="mx-3"
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
          </v-col>
        </v-row>

        <v-row class="mt-2">
          <v-col
            v-for="reference in references"
            :key="reference.title"
            :cols="3"
          >
            <v-card>
              <v-img
                :src="require(`@/assets/img/logo/` + reference.iconSrc)"
                class="white--text align-end mt-2"
                :gradient="reference.gradient"
                max-height="50px"
                contain
                :href="reference.url"
              >
              </v-img>
              <v-card-title
                ><a
                  :href="reference.url"
                  class="subtitle-1"
                  onmouseover="style='text-decoration:underline; color: black'"
                  onmouseout="style='text-decoration:none; color: black'"
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
        gradient:
          'to bottom, rgba(178, 245, 23, 0.05), 90%, rgba(178, 245, 23, 0.23)',
        iconSrc: 'ebrains-logo.png',
        title: 'EBrains',
        url: 'https://www.ebrains.eu',
      },
      {
        gradient: 'to bottom, rgba(17,31,138,0.05), 90%, rgba(17,31,138,0.23)',
        iconSrc: 'eu-logo.png',
        title: 'European Union',
        url: 'https://europa.eu/european-union/index_en',
      },
      {
        gradient:
          'to bottom, rgba(16, 188, 220, 0.05), 90%, rgba(16, 188, 220, 0.23)',
        iconSrc: 'hbp-logo.jpeg',
        title: 'Human Brain Project',
        url: 'https://www.humanbrainproject.eu',
      },
      {
        gradient:
          'to bottom, rgba(255,102,51,0.05), 90%, rgba(255,102,51,0.23)',
        iconSrc: 'nest-simulated.png',
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
