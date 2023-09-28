<template>
  <div class="appInfo">
    <v-main style="height: 100vh; overflow-y: auto">
      <v-container fill-height>
        <v-spacer />

        <v-row>
          <v-col align="center">
            <v-img
              :src="
                $vuetify.theme.dark
                  ? require('@/assets/img/logo/nest-desktop-logo-dark.svg')
                  : require('@/assets/img/logo/nest-desktop-logo-light.svg')
              "
              class="logo my-6"
              contain
              height="250"
            />

            <h1 class="display-3 font-weight-light" v-text="'NEST Desktop'" />
            <p
              class="font-weight-regular ma-3 subheading"
              v-text="'An educational GUI for neuroscience'"
            />
          </v-col>

          <v-col :cols="12" :md="12" :xl="8" :offset-xl="2">
            <v-row v-if="state.includeProjectButtons">
              <v-col :lg="4" :xs="6" :offset-lg="2">
                <v-btn class="project" block dark large text to="project">
                  <v-icon left v-text="'mdi-plus'" />
                  Start a new project
                </v-btn>
              </v-col>
              <v-col :lg="4" :xs="6">
                <v-menu>
                  <template #activator="{ on, attrs }">
                    <v-btn
                      @click="loadProjects"
                      class="project"
                      block
                      dark
                      large
                      text
                      v-bind="attrs"
                      v-on="on"
                    >
                      <v-spacer />
                      <v-icon left v-text="'mdi-upload-outline'" />
                      Load a project
                      <v-spacer />
                      <v-icon right v-text="'mdi-dots-vertical'" />
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

            <v-row>
              <v-col :cols="12" :md="6">
                <v-card flat height="100%" outlined tile>
                  <v-card-text>
                    <p class="text-justify">
                      NEST Desktop is a web-based GUI application for NEST
                      Simulator, an advanced simulation tool for computational
                      neuroscience. The application enables the rapid
                      construction, parametrization, and instrumentation of
                      neuronal network models.
                    </p>
                    <p class="text-justify">
                      The primary objective is to provide an accessible
                      classroom tool that allows users to rapidly explore
                      neuroscience concepts without the need to learn a
                      simulator control language at the same time.
                    </p>
                  </v-card-text>
                </v-card>
              </v-col>

              <v-col :cols="12" :md="6">
                <v-card flat height="100%" outlined tile>
                  <v-layout fill-height="true">
                    <v-row align="center">
                      <v-col align="center" cols="12">
                        <v-card flat>
                          <v-card-text>
                            <AppDetails />
                          </v-card-text>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-layout>
                </v-card>
              </v-col>
            </v-row>

            <v-row>
              <v-col
                :cols="12"
                :key="reference.title"
                :lg="3"
                :sm="6"
                v-for="reference in references"
              >
                <v-btn
                  :color="$vuetify.theme.dark ? 'none' : reference.color"
                  :href="reference.url"
                  :title="reference.title"
                  block
                  class="logo"
                  depressed
                  ripple
                  target="_blank"
                  tile
                  x-large
                >
                  <v-img
                    :src="
                      require('@/assets/img/logo/' +
                        ($vuetify.theme.dark
                          ? reference.iconSrcDark
                          : reference.iconSrc))
                    "
                    contain
                    height="32px"
                  />
                </v-btn>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { onMounted, reactive, watch } from '@vue/composition-api';
import core from '@/core';

import AppDetails from '@/components/app/AppDetails.vue';

export default Vue.extend({
  name: 'AppInfo',
  components: {
    AppDetails,
  },
  props: {
    includeProjectButtons: Boolean,
  },
  setup(props) {
    const references = [
      {
        color: 'rgba(178, 245, 23, 0.1)',
        iconSrc: 'ebrains-logo.svg',
        iconSrcDark: 'ebrains-logo-white-text.svg',
        title: 'EBRAINS',
        url: 'https://www.ebrains.eu',
      },
      {
        color: 'rgba(17,31,138,0.1)',
        iconSrc: 'eu-logo.png',
        iconSrcDark: 'eu-logo-white-text.png',
        title: 'European Union',
        url: 'https://europa.eu/european-union/index_en',
      },
      {
        color: 'rgba(16, 188, 220, 0.1)',
        iconSrc: 'hbp-logo.png',
        iconSrcDark: 'hbp-logo-white-text.png',
        title: 'Human Brain Project',
        url: 'https://www.humanbrainproject.eu',
      },
      {
        color: 'rgba(255,102,51,0.1)',
        iconSrc: 'nest.svg',
        iconSrcDark: 'nest.svg',
        title: 'NEST Simulator',
        url: 'https://www.nest-simulator.org',
      },
    ];
    const state = reactive({
      includeProjectButtons: props.includeProjectButtons,
      projects: [],
    });

    onMounted(() => {
      state.includeProjectButtons = props.includeProjectButtons as boolean;
    });

    watch(
      () => [props.includeProjectButtons],
      () => {
        state.includeProjectButtons = props.includeProjectButtons as boolean;
      }
    );

    /**
     * Load projects from app core component
     */
    const loadProjects = () => {
      state.projects = core.app.project.state.projects;
    };

    return { loadProjects, references, state };
  },
});
</script>

<style>
.appInfo .logo {
  overflow: hidden;
}
.appInfo .logo .v-image {
  transition: all 0.5s ease-in-out;
  transform: scale(1);
}
.appInfo .logo:hover .v-image {
  transform: scale(1.5);
}
</style>
