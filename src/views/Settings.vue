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
                :value="core.app.config.devMode"
                @change="e => updateConfig({ devMode: e })"
                label="Development mode"
              />
            </v-card-text>
          </v-card>

          <v-card flat tile>
            <v-card-title v-text="'Database'" />
            <v-card-text>
              <v-text-field
                label="Model database"
                v-model="core.app.config.databases.model.name"
              />
              <v-text-field
                label="Project database"
                v-model="core.app.config.databases.project.name"
              />
            </v-card-text>
          </v-card>

          <v-card flat tile>
            <v-card-title v-text="'Backend'" />
            <v-card-text>
              <v-text-field
                label="NEST Server"
                v-model="core.app.nestServer.url"
              />
              <span v-if="state.nestVersion">
                Response:
                <v-chip small>
                  {{ state.nestVersion }}
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
import { reactive, watch } from '@vue/composition-api';

import { Config } from '@/core/config';
import core from '@/core/index';

export default Vue.extend({
  name: 'Settings',
  props: {
    id: String,
  },
  setup(props) {
    const state = reactive({
      nestVersion: '',
      network: new Config('Network'),
    });

    /**
     * Check if NEST is running in the backend.
     */
    const checkNEST = () => {
      core.app.nestServer.check();
      state.nestVersion = core.app.nestServer.state.simulatorVersion;
    };

    const updateConfig = (d: any) => {
      console.log(d);
      core.app.updateConfig(d);
    };

    watch(
      () => props.id,
      () => {
        console.log(props.id);
      }
    );

    return {
      checkNEST,
      core,
      state,
      updateConfig,
    };
  },
});
</script>
