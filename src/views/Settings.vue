<template>
  <div style="height: 100vh; overflow-y: auto">
    <v-main>
      <v-container>
        <v-card flat tile>
          <v-card-title v-text="'App'" />
          <v-card-text>
            <v-checkbox
              @change="e => updateAppConfig({ autoUpdate: e || false })"
              label="Auto update"
              v-model="state.autoUpdate"
            />
            <v-checkbox
              @change="e => updateAppConfig({ devMode: e || false })"
              label="Development mode"
              v-model="state.devMode"
            />
            <v-checkbox
              @change="e => updateAppConfig({ pinNav: e || false })"
              label="Pin navigation (Page reload required)"
              v-model="state.pinNav"
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
              <v-select
                :items="state.colorSchemes"
                :value="state.network.config.color.scheme"
                @change="updateNetworkColorScheme"
                label="Color cycle of nodes"
              >
                <template #item="{ item }">
                  <v-row class="my-1">
                    <v-col cols="3" v-text="item.text" />
                    <v-col cols="9">
                      <v-row>
                        <v-sheet
                          :color="color"
                          :height="20"
                          :key="color"
                          :width="20"
                          class="mx-1 my-3"
                          v-for="color in item.colors"
                        />
                      </v-row>
                    </v-col>
                  </v-row>
                </template>

                <template #selection="{ item }">
                  <v-row>
                    <v-col cols="4" v-text="item.text" />
                    <v-col cols="8">
                      <v-row>
                        <v-sheet
                          :color="color"
                          :height="20"
                          :key="color"
                          :width="20"
                          class="mx-1 my-3"
                          v-for="color in item.colors"
                        />
                      </v-row>
                    </v-col>
                  </v-row>
                </template>
              </v-select>
            </v-card>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive } from '@vue/composition-api';

import { Config } from '@/core/config';
import core from '@/core';

import colorSchemes from '@/assets/config/ColorSchemes.json';

export default Vue.extend({
  name: 'Settings',
  setup() {
    const state = reactive({
      app: core.app,
      devMode: core.app.config.devMode,
      nestVersion: '',
      network: new Config('Network'),
      pinNav: core.app.config.pinNav,
      showHelp: core.app.project.config.showHelp,
      colorSchemes: colorSchemes,
    });

    /**
     * Check if NEST is running in the backend.
     */
    const checkNEST = () => {
      core.app.nestServer.check().then(() => {
        state.nestVersion = core.app.nestServer.state.simulatorVersion;
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

    /**
     * Update color cycle of nodes.
     */
    const updateNetworkColorScheme = (scheme: string) => {
      const colorScheme: any = colorSchemes.find(
        colorscheme => colorscheme.value === scheme
      );
      const networkConfig = {
        color: {
          scheme,
          cycle: colorScheme.colors,
        },
      };
      state.network.updateConfig(networkConfig);
    };

    return {
      checkNEST,
      state,
      updateAppConfig,
      updateNetworkColorScheme,
      updateProjectConfig,
    };
  },
});
</script>
