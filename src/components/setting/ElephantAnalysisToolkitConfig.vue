<template>
  <div class="ElephantAnalysisToolkitConfig">
    <v-card outlined>
      <v-card-subtitle v-text="'Elephant Analysis Toolkit'" />
      <v-card-text>
        <v-tooltip open-delay="300" top>
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              @change="updateElephantAnalysisToolkitConfig"
              hide-details
              label="URL of Elephant server for analysis"
              placeholder="http://127.0.0.1:8080"
              v-bind="attrs"
              v-model="state.app.backends.elephantAnalysis.url"
              v-on="on"
            />
          </template>
          <span>
            Please enter the URL where the Elephant server can be found at
            (including protocol!).
          </span>
        </v-tooltip>

        <div class="my-1">
          <span
            v-if="state.elephantVersion && state.elephantVersion !== 'unknown'"
          >
            <label>Response: </label>
            <v-tooltip open-delay="300" right>
              <template v-slot:activator="{ on, attrs }">
                <v-chip color="green" dark small v-bind="attrs" v-on="on">
                  <v-avatar left>
                    <v-icon small v-text="'mdi-checkbox-marked-circle'" />
                  </v-avatar>
                  Elephant version: {{ state.elephantVersion }}
                </v-chip>
              </template>
              <span>A server of Insite has been found at the given URL.</span>
            </v-tooltip>
          </span>

          <span v-else-if="state.elephantVersion === 'unknown'">
            <label>Response: </label>
            <v-tooltip open-delay="300" right>
              <template v-slot:activator="{ on, attrs }">
                <v-chip color="gray" dark small v-bind="attrs" v-on="on">
                  <v-avatar left>
                    <v-icon small v-text="'mdi-help-circle-outline'" />
                  </v-avatar>
                  <span>Unknown</span>
                </v-chip>
              </template>
              <span>
                The server state of Elephant has not been checked yet.
              </span>
            </v-tooltip>
          </span>

          <span v-else>
            <label>Response: </label>
            <v-tooltip open-delay="300" right>
              <template v-slot:activator="{ on, attrs }">
                <v-chip color="red" dark small v-bind="attrs" v-on="on">
                  <v-avatar left>
                    <v-icon small v-text="'mdi-power-off'" />
                  </v-avatar>
                  <span> No valid response </span>
                </v-chip>
              </template>
              <span>
                The server of Elephant seems to be unavailable at this URL.
              </span>
            </v-tooltip>
          </span>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-btn
          @click="checkElephantAnalysisToolkit"
          outlined
          small
          v-text="'Check'"
        />
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { onBeforeMount, reactive } from '@vue/composition-api';

import core from '@/core';

export default Vue.extend({
  name: 'elephantAnalysisToolkitConfig',
  setup() {
    const state = reactive({
      app: core.app,
      elephantVersion: 'unknown',
    });

    onBeforeMount(() => checkElephantAnalysisToolkit());

    /**
     * Check if Elephant is running in the backend.
     */
    async function checkElephantAnalysisToolkit() {
      core.app.backends.elephantAnalysis.check().finally(function () {
        // update the version (is updated as well in case of failure)
        state.elephantVersion =
          core.app.backends.elephantAnalysis.state.version.elephant || '';
      });
    }

    /**
     * Update configurations for Elephant analysis.
     */
    const updateElephantAnalysisToolkitConfig = () => {
      state.app.backends.elephantAnalysis.updateConfig({ custom: true });
      checkElephantAnalysisToolkit();
    };

    return {
      checkElephantAnalysisToolkit,
      state,
      updateElephantAnalysisToolkitConfig,
    };
  },
});
</script>
