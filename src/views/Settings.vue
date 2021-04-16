<template>
  <div class="settings">
    <v-app-bar app clipped-left color="settings" dark dense flat>
      <v-toolbar-title>
        <v-icon class="ma-2" v-text="'mdi-cogs'" />
        Settings
      </v-toolbar-title>
    </v-app-bar>

    <v-card
      color="white"
      flat
      style="height:calc(100vh - 48px); overflow-y:auto"
      tile
    >
      <v-main>
        <v-container>
          <v-card flat tile>
            <v-card-title v-text="'App'" />
            <v-card-text>
              <v-checkbox
                @change="e => updateAppConfig({ devMode: e || false })"
                label="Development mode"
                v-model="state.devMode"
              />
              <v-checkbox
                @change="e => updateProjectConfig({ showHelp: e || false })"
                label="Show help"
                v-model="state.showHelp"
              />
            </v-card-text>
          </v-card>

          <v-card flat tile>
            <v-card-title v-text="'Database'" />
            <v-card-text>
              <v-text-field
                label="Model database"
                v-model="state.app.config.databases.model.name"
              />
              <v-text-field
                label="Project database"
                v-model="state.app.config.databases.project.name"
              />
            </v-card-text>
          </v-card>

          <v-card flat tile>
            <v-card-title v-text="'Backend'" />
            <v-card-text>
              <v-text-field
                label="NEST Server"
                v-model="state.app.nestServer.url"
              />
              <span v-if="state.nestVersion">
                Response:
                <v-chip color="orange darken-3" dark small>
                  <v-avatar left>
                    <v-icon small v-text="'mdi-checkbox-marked-circle'" />
                  </v-avatar>
                  NEST version: {{ state.nestVersion }}
                </v-chip>
              </span>
            </v-card-text>

            <v-card-actions>
              <v-btn @click="checkNEST">Check</v-btn>
              <!-- <v-btn @click="() => core.app.nestServer.seek()">seek</v-btn> -->
            </v-card-actions>
          </v-card>

          <v-card flat tile>
            <v-card-title v-text="'Network'" />
            <v-card-text>
              <v-card flat tile>
                <v-card-subtitle v-text="'Color cycle of nodes'" />
                <v-row>
                  <v-sheet
                    :color="color"
                    :key="color"
                    :height="40"
                    class="flex"
                    v-for="color in state.network.config.color.cycle"
                  />
                </v-row>
              </v-card>
            </v-card-text>
          </v-card>
        </v-container>
      </v-main>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive } from '@vue/composition-api';

import { Config } from '@/core/config';
import core from '@/core';

export default Vue.extend({
  name: 'Settings',
  setup() {
    const state = reactive({
      app: core.app,
      devMode: core.app.config.devMode,
      nestVersion: '',
      network: new Config('Network'),
      showHelp: core.app.project.config.showHelp,
    });

    /**
     * Check if NEST is running in the backend.
     */
    const checkNEST = () => {
      core.app.nestServer.check().then(nestServer => {
        state.nestVersion = nestServer.state.simulatorVersion;
      });
    };
    /**
     * Update app configuration.
     */
    const updateAppConfig = (d: any) => {
      core.app.updateConfig(d);
    };
    /**

     * Update project configuration.
     */
    const updateProjectConfig = (d: any) => {
      core.app.project.updateConfig(d);
    };

    return {
      checkNEST,
      state,
      updateAppConfig,
      updateProjectConfig,
    };
  },
});
</script>
