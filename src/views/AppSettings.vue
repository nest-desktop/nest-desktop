<template>
  <div class="appSettings">
    <v-main>
      <v-container>
        <v-card class="my-1" flat tile>
          <v-card-title v-text="'App'" />
          <v-card-text>
            <v-checkbox
              @change="
                e => state.appConfig.updateConfig({ autoUpdate: e || false })
              "
              color="accent"
              label="Auto update"
              v-model="state.appConfig.config.autoUpdate"
            />
            <v-checkbox
              @change="
                e => state.appConfig.updateConfig({ devMode: e || false })
              "
              color="accent"
              label="Development mode *"
              v-model="state.appConfig.config.devMode"
            />
            <v-checkbox
              @change="
                e => state.appConfig.updateConfig({ pinNav: e || false })
              "
              color="accent"
              label="Pin navigation *"
              v-model="state.appConfig.config.pinNav"
            />
            <v-checkbox
              @change="
                e =>
                  state.projectViewConfig.updateConfig({ showHelp: e || false })
              "
              color="accent"
              label="Show help"
              v-model="state.projectViewConfig.config.showHelp"
            />
            <v-checkbox
              @change="
                e =>
                  state.projectViewConfig.updateConfig({
                    coloredToolbar: e || false,
                  })
              "
              color="accent"
              label="Colored toolbar"
              v-model="state.projectViewConfig.config.coloredToolbar"
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
              <v-col cols="4">
                <NESTSimulatorConfig />
              </v-col>
              <v-col cols="4">
                <InsiteAccessConfig />
              </v-col>
              <v-col cols="4">
                <ElephantAnalysisToolkitConfig />
              </v-col>
            </v-row>
            <v-row>
              <v-col>
                <ParameterEdit
                  :options="{
                    label:
                      'Interval to check backends (s) * (Page reload required)',
                    input: 'tickSlider',
                    ticks: [-1, 1, 2, 6, 10, 20, 60],
                  }"
                  :value="state.appConfig.config.intervalCheckBackends"
                  @update:value="
                    e =>
                      state.appConfig.updateConfig({
                        intervalCheckBackends: e || 0,
                      })
                  "
                />
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
                v-for="recordable in state.modelConfig.config.recordables"
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
                  <span
                    v-if="recordable.unit"
                    v-text="` (${recordable.unit})`"
                  />
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
                :value="state.networkConfig.config.color.scheme"
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

        <v-card class="my-1" flat tile>
          <v-card-title v-text="'Parameter'" />

          <v-card-text>
            <v-checkbox
              @change="
                e =>
                  state.parameterConfig.updateConfig({ rawLabel: e || false })
              "
              color="accent"
              label="Show NEST-alike parameter labels (for experts)"
              v-model="state.parameterConfig.config.rawLabel"
            />
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
import ElephantAnalysisToolkitConfig from '@/components/setting/ElephantAnalysisToolkitConfig.vue';
import InsiteAccessConfig from '@/components/setting/InsiteAccessConfig.vue';
import NESTSimulatorConfig from '@/components/setting/NESTSimulatorConfig.vue';
import ParameterEdit from '@/components/parameter/ParameterEdit.vue';

import colorSchemes from '@/assets/config/ColorSchemes.json';

export default Vue.extend({
  name: 'AppSettings',
  components: {
    ElephantAnalysisToolkitConfig,
    InsiteAccessConfig,
    NESTSimulatorConfig,
    ParameterEdit,
  },
  setup() {
    const state = reactive({
      app: core.app,
      appConfig: new Config('App'),
      colorSchemes: colorSchemes,
      modelConfig: new Config('Model'),
      networkConfig: new Config('Network'),
      parameterConfig: new Config('Parameter'),
      projectViewConfig: new Config('ProjectView'),
    });

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
      state.networkConfig.updateConfig(networkConfig);
    };

    return {
      state,
      updateNetworkColorScheme,
    };
  },
});
</script>

<style>
.appSettings {
  height: 100vh;
  overflow-y: auto;
}
</style>
