<template>
  <div class="home">
    <!-- <v-app-bar app clipped-left color="black" dark dense flat>
      <v-toolbar-title>
        NEST Desktop
      </v-toolbar-title>
    </v-app-bar> -->
    <v-container class="fill-height" style="height: 100vh">
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

      <v-row>
        <v-col class="text-center">
          <v-btn class="ma-3" to="project" v-text="'Start a new project'" />
          <v-menu>
            <template #activator="{ on, attrs }">
              <v-btn
                @click="loadProjects"
                class="mx-3"
                v-bind="attrs"
                v-on="on"
                v-text="'Load a project'"
              />
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

      <v-spacer />

      <v-row>
        <v-col cols="12" md="7">
          <v-card flat>
            <v-card-text class="text-justify">
              <p>
                NEST Desktop is a web-based GUI application for NEST Simulator,
                an advanced simulation tool for computational neuroscience.
              </p>
              <p>
                The application enables the rapid construction, parametrization,
                and instrumentation of neuronal network models. The primary
                objective is to provide an accessible classroom tool that allows
                users to rapidly explore neuroscience concepts without the need
                to learn a simulator control language at the same time.
              </p>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col cols="12" md="5">
          <v-card flat class="app-details">
            <v-card-text class="py-0">
              <About />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="3">
          <a href="https://www.nest-simulator.org" target="_blank">
            <v-img
              contain
              max-height="42"
              src="@/assets/img/logo/nest-simulated.png"
            />
          </a>
        </v-col>
        <v-col cols="3">
          <a href="https://www.humanbrainproject.eu" target="_blank">
            <v-img
              contain
              max-height="42"
              src="@/assets/img/logo/hbp-logo.jpeg"
            />
          </a>
        </v-col>
        <v-col cols="3">
          <a href="https://www.ebrains.eu" target="_blank">
            <v-img
              contain
              max-height="42"
              src="@/assets/img/logo/ebrains-logo.png"
            />
          </a>
        </v-col>
        <v-col cols="3">
          <a href="https://europa.eu/european-union/index_en" target="_blank">
            <v-img
              contain
              max-height="42"
              src="@/assets/img/logo/eu-logo.png"
            />
          </a>
        </v-col>
      </v-row>
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
    const state = reactive({
      projects: core.app.projects,
    });

    /**
     * Load projects from app core component
     */
    const loadProjects = () => {
      state.projects = core.app.projects;
    };

    return { loadProjects, state };
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
