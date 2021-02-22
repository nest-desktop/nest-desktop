<template>
  <div class="home">
    <!-- <v-app-bar app clipped-left color="black" dark dense flat>
      <v-toolbar-title>
        NEST Desktop
      </v-toolbar-title>
    </v-app-bar> -->
    <v-main style="height:100vh; overflow-y:auto">
      <v-container class="fill-height">
        <v-row>
          <v-col class="text-center pa-12" cols="12">
            <v-img
              :src="require('@/assets/img/logo/nest-desktop-logo.png')"
              class="my-6"
              contain
              height="200"
            />

            <h1 class="display-3 font-weight-light">NEST Desktop</h1>

            <p class="subheading font-weight-regular ma-3">
              An educational GUI for neuroscience
            </p>
          </v-col>
        </v-row>

        <v-spacer />

        <v-row>
          <v-col cols="12" md="7">
            <v-card flat>
              <v-card-text class="text-justify">
                <p>
                  NEST Desktop is a web-based GUI application for NEST
                  Simulator, an advanced simulation tool for computational
                  neuroscience.
                </p>
                <p>
                  The application enables the rapid construction,
                  parametrization, and instrumentation of neuronal network
                  models. The primary objective is to provide an accessible
                  classroom tool that allows users to rapidly explore
                  neuroscience concepts without the need to learn a simulator
                  control language at the same time.
                </p>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="5">
            <v-card flat tile class="app-details">
              <v-card-text class="py-0">
                <v-list dense>
                  <v-list-item>
                    <v-row>
                      <v-col class="font-weight-bold" cols="4">
                        Documentation
                      </v-col>
                      <v-col cols="8">
                        <a
                          href="https://nest-desktop.readthedocs.io"
                          target="_blank"
                        >
                          https://nest-desktop.readthedocs.io
                        </a>
                      </v-col>
                    </v-row>
                  </v-list-item>
                  <v-list-item>
                    <v-row>
                      <v-col class="font-weight-bold" cols="4">
                        Source Code
                      </v-col>
                      <v-col cols="8">
                        <a
                          href="https://github.com/babsey/nest-desktop"
                          target="_blank"
                        >
                          https://github.com/babsey/nest-desktop
                        </a>
                      </v-col>
                    </v-row>
                  </v-list-item>
                  <v-list-item>
                    <v-row>
                      <v-col class="font-weight-bold" cols="4">
                        License
                      </v-col>
                      <v-col cols="8">
                        MIT License
                      </v-col>
                    </v-row>
                  </v-list-item>
                  <v-list-item>
                    <v-row>
                      <v-col class="font-weight-bold" cols="4">
                        Current Version
                      </v-col>
                      <v-col cols="8">
                        {{ state.version }}
                      </v-col>
                    </v-row>
                  </v-list-item>
                  <v-list-item>
                    <v-row>
                      <v-col class="font-weight-bold" cols="4">
                        Contact
                      </v-col>
                      <v-col cols="8">
                        <a href="mailto:spreizer@uni-trier.de">
                          Sebastian Spreizer
                        </a>
                      </v-col>
                    </v-row>
                  </v-list-item>
                </v-list>
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
    </v-main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive } from '@vue/composition-api';
import core from '@/core/index';

export default Vue.extend({
  name: 'Home',
  setup() {
    const state = reactive({ version: core.app.version });
    return { state };
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
