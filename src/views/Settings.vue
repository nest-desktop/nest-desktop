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
              v-model="state.appConfig.autoUpdate"
            />
            <v-checkbox
              @change="e => updateAppConfig({ devMode: e || false })"
              label="Development mode"
              v-model="state.appConfig.devMode"
            />
            <v-checkbox
              @change="e => updateAppConfig({ pinNav: e || false })"
              label="Pin navigation (Page reload required)"
              v-model="state.appConfig.pinNav"
            />
            <v-checkbox
              @change="e => updateProjectViewConfig({ showHelp: e || false })"
              label="Show help"
              v-model="state.projectViewConfig.showHelp"
            />
            <v-checkbox
              label="Colored toolbar"
              @change="
                e => updateProjectViewConfig({ coloredToolbar: e || false })
              "
              v-model="state.projectViewConfig.coloredToolbar"
            />
          </v-card-text>
        </v-card>

        <!-- <v-card flat tile>
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
        </v-card> -->

        <v-card flat tile>
          <v-card-title v-text="'Backend'" />
          <v-card-text>
            <v-tooltip top open-delay="300">
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  @change="updateNESTSimulatorConfig"
                  label="URL of NEST Simulator"
                  placeholder="http://127.0.0.1:5000"
                  v-model="state.app.NESTSimulator.url"
                  v-bind="attrs"
                  v-on="on"
                />
              </template>
              <span>
                Please enter the URL where the server of NEST Simulator can be
                found at (including protocol!).
              </span>
            </v-tooltip>
            <span
              v-if="
                state.simulatorVersion && state.simulatorVersion != 'unknown'
              "
            >
              <label>Response: </label>
              <v-tooltip right open-delay="300">
                <template v-slot:activator="{ on, attrs }">
                  <v-chip color="green" dark small v-bind="attrs" v-on="on">
                    <v-avatar left>
                      <v-icon small v-text="'mdi-checkbox-marked-circle'" />
                    </v-avatar>
                    NEST version: {{ state.simulatorVersion }}
                  </v-chip>
                </template>
                <span
                  >A server of NEST Simulator has been found at the given
                  URL.</span
                >
              </v-tooltip>
            </span>
            <span v-else-if="state.simulatorVersion === 'unknown'">
              <label>Response: </label>
              <v-tooltip right open-delay="300">
                <template v-slot:activator="{ on, attrs }">
                  <v-chip color="gray" dark small v-bind="attrs" v-on="on">
                    <v-avatar left>
                      <v-icon small v-text="'mdi-help-circle-outline'" />
                    </v-avatar>
                    <span>Unknown</span>
                  </v-chip>
                </template>
                <span>
                  The server state of NEST Simulator has not been checked yet.
                </span>
              </v-tooltip>
            </span>
            <span v-else>
              <label>Response: </label>
              <v-tooltip right open-delay="300">
                <template v-slot:activator="{ on, attrs }">
                  <v-chip color="red" dark small v-bind="attrs" v-on="on">
                    <v-avatar left>
                      <v-icon small v-text="'mdi-power-off'" />
                    </v-avatar>
                    <span> No valid response </span>
                  </v-chip>
                </template>
                <span>
                  The server of NEST Simulator seems to be unavailable at this
                  URL.
                </span>
              </v-tooltip>
            </span>
          </v-card-text>

          <v-card-actions>
            <v-btn
              @click="checkNESTSimulator"
              outlined
              small
              v-text="'Check'"
            />
          </v-card-actions>
        </v-card>

        <v-card flat tile>
          <v-card-title v-text="'Model'" />
          <v-card-text>
            <v-card flat tile>
              <v-card-subtitle v-text="'Accepted recordables'" />
              <span
                :key="recordable.id"
                v-for="recordable in state.model.config.recordables"
              >
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attrs }">
                    <v-chip
                      class="ma-1"
                      outlined
                      small
                      v-text="recordable.id"
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  {{ recordable.label }}
                  <span v-if="recordable.unit"> ({{ recordable.unit }})</span>
                </v-tooltip>
              </span>
            </v-card>
          </v-card-text>
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
import { onBeforeMount, reactive } from '@vue/composition-api';

import { Config } from '@/core/config';
import core from '@/core';

import colorSchemes from '@/assets/config/ColorSchemes.json';

export default Vue.extend({
  name: 'Settings',
  setup() {
    const projectView = core.app.projectView;
    const state = reactive({
      app: core.app,
      model: new Config('Model'),
      simulatorVersion: 'unknown',
      network: new Config('Network'),
      appConfig: core.app.config,
      projectViewConfig: projectView.config,
      colorSchemes: colorSchemes,
    });

    onBeforeMount(() => checkNESTSimulator());

    /**
     * Check if NEST Simulator is running in the backend.
     */
    async function checkNESTSimulator() {
      core.app.NESTSimulator.check()
        .catch(() => {
          // connection errors are already processed in httpClient
        })
        .finally(function () {
          // update the version (is updated as well in case of failure)
          state.simulatorVersion =
            core.app.NESTSimulator.state.simulatorVersion;
        });
    }

    /**
     * Update app configuration.
     */
    const updateAppConfig = (d: any) => {
      core.app.updateConfig(d);
    };

    /**
     * Update project configuration.
     */
    const updateProjectViewConfig = (d: any) => {
      core.app.projectView.updateConfig(d);
    };

    /**
     * Update configurations for NEST Simulator.
     */
    const updateNESTSimulatorConfig = () => {
      state.app.NESTSimulator.updateConfig({ custom: true });
      checkNESTSimulator();
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
      checkNESTSimulator,
      projectView,
      state,
      updateAppConfig,
      updateNESTSimulatorConfig,
      updateNetworkColorScheme,
      updateProjectViewConfig,
    };
  },
});
</script>
