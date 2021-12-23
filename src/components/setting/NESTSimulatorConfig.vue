<template>
  <div class="NESTSimulatorConfig">
    <v-card outlined>
      <v-card-subtitle v-text="'NEST Simulator'" />
      <v-card-text>
        <v-tooltip top open-delay="300">
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              @change="updateNESTSimulatorConfig"
              hide-details
              label="URL of NEST Simulator"
              placeholder="http://127.0.0.1:5000"
              v-model="state.app.backends.nestSimulator.url"
              v-bind="attrs"
              v-on="on"
            />
          </template>
          <span>
            Please enter the URL where the server of NEST Simulator can be found
            at (including protocol!).
          </span>
        </v-tooltip>

        <div class="my-1">
          <span
            v-if="state.simulatorVersion && state.simulatorVersion != 'unknown'"
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
        </div>
      </v-card-text>

      <v-card-actions>
        <v-btn @click="checkNESTSimulator" outlined small v-text="'Check'" />
      </v-card-actions>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { onBeforeMount, reactive } from '@vue/composition-api';

import core from '@/core';

export default Vue.extend({
  name: 'NESTSimulatorConfig',
  setup() {
    const state = reactive({
      app: core.app,
      simulatorVersion: 'unknown',
    });

    onBeforeMount(() => checkNESTSimulator());

    /**
     * Check if NEST Simulator is running in the backend.
     */
    async function checkNESTSimulator() {
      core.app.backends.nestSimulator.check().finally(function () {
        // update the version (is updated as well in case of failure)
        state.simulatorVersion =
          core.app.backends.nestSimulator.state.version.nest || '';
      });
    }

    /**
     * Update configurations for NEST Simulator.
     */
    const updateNESTSimulatorConfig = () => {
      state.app.backends.nestSimulator.updateConfig({ custom: true });
      checkNESTSimulator();
    };

    return {
      checkNESTSimulator,
      state,
      updateNESTSimulatorConfig,
    };
  },
});
</script>
