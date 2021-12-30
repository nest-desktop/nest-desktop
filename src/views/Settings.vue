<template>
  <div style="height: 100vh; overflow-y: auto">
    <v-main>
      <v-container>
        <v-card class="my-1" flat tile>
          <v-card-title v-text="'App'" />
          <v-card-text>
            <v-checkbox
              @change="e => updateAppConfig({ autoUpdate: e || false })"
              color="accent"
              label="Auto update"
              v-model="state.appConfig.autoUpdate"
            />
            <v-checkbox
              @change="e => updateAppConfig({ devMode: e || false })"
              color="accent"
              label="Development mode *"
              v-model="state.appConfig.devMode"
            />
            <v-checkbox
              @change="e => updateAppConfig({ pinNav: e || false })"
              color="accent"
              label="Pin navigation *"
              v-model="state.appConfig.pinNav"
            />
            <v-checkbox
              @change="e => updateProjectViewConfig({ showHelp: e || false })"
              color="accent"
              label="Show help"
              v-model="state.projectViewConfig.showHelp"
            />
            <v-checkbox
              @change="
                e => updateProjectViewConfig({ coloredToolbar: e || false })
              "
              color="accent"
              label="Colored toolbar"
              v-model="state.projectViewConfig.coloredToolbar"
            />
            <span>* Page restart required</span>
          </v-card-text>
        </v-card>

        <!-- <v-card class="my-1" flat tile>
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

        <v-card class="my-1" flat tile>
          <v-card-title v-text="'Backends'" />
          <v-card-text>
            <v-row>
              <v-col cols="6">
                <NESTSimulatorConfig />
              </v-col>
              <v-col cols="6">
                <InsiteAccessConfig />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>

        <v-card class="my-1" flat tile>
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
                      label
                      outlined
                      small
                      v-bind="attrs"
                      v-on="on"
                      v-text="recordable.id"
                    />
                  </template>
                  <span v-text="recordable.label" />
                  <span v-if="recordable.unit" v-text="` (${recordable.unit})`" />
                </v-tooltip>
              </span>
            </v-card>
          </v-card-text>
        </v-card>

        <v-card class="my-1" flat tile>
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

import { Config } from '@/core/common/config';
import core from '@/core';
import InsiteAccessConfig from '@/components/setting/InsiteAccessConfig.vue';
import NESTSimulatorConfig from '@/components/setting/NESTSimulatorConfig.vue';

import colorSchemes from '@/assets/config/ColorSchemes.json';

export default Vue.extend({
  name: 'Settings',
  components: {
    InsiteAccessConfig,
    NESTSimulatorConfig,
  },
  setup() {
    const projectView = core.app.project.view;
    const state = reactive({
      app: core.app,
      appConfig: core.app.config,
      colorSchemes: colorSchemes,
      model: new Config('Model'),
      network: new Config('Network'),
      projectViewConfig: projectView.config,
    });
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
      core.app.project.view.updateConfig(d);
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
      projectView,
      state,
      updateAppConfig,
      updateNetworkColorScheme,
      updateProjectViewConfig,
    };
  },
});
</script>
