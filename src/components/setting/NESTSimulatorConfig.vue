<template>
  <div class="NESTSimulatorConfig">
    <v-card outlined>
      <v-card-title class="d-flex">
        NEST Simulator
        <v-spacer />
        <v-checkbox
          dense
          hide-details
          label="enabled"
          v-model="state.app.backends.nestSimulator.enabled"
        />
      </v-card-title>

      <v-card-text v-if="state.app.backends.nestSimulator.state.enabled">
        <v-text-field
          :rules="rules"
          @change="updateNESTSimulatorConfig({ custom: true })"
          hint="Please enter the URL where the server of NEST Simulator can be found at (including protocol!)."
          label="URL of NEST Simulator"
          persistent-hint
          placeholder="http://127.0.0.1:52425"
          v-model="state.app.backends.nestSimulator.url"
        />
      </v-card-text>

      <v-card-actions v-if="state.app.backends.nestSimulator.state.enabled">
        <v-btn @click="checkNESTSimulator" outlined small v-text="'Check'" />

        <div class="mx-3">
          <span
            v-if="
              state.simulatorVersion && state.simulatorVersion !== 'unknown'
            "
          >
            <label>Response: </label>
            <v-chip
              color="green"
              dark
              small
              title="A server of NEST Simulator has been found at the given URL."
            >
              <v-avatar left>
                <v-icon small v-text="'mdi-checkbox-marked-circle'" />
              </v-avatar>
              NEST version: {{ state.simulatorVersion }}
            </v-chip>
          </span>

          <span v-else-if="state.simulatorVersion === 'unknown'">
            <label>Response: </label>
            <v-chip
              color="gray"
              dark
              small
              title="The server state of NEST Simulator has not been checked yet."
            >
              <v-avatar left>
                <v-icon small v-text="'mdi-help-circle-outline'" />
              </v-avatar>
              <span>Unknown</span>
            </v-chip>
          </span>

          <span v-else>
            <label>Response: </label>
            <v-chip
              color="red"
              dark
              small
              title="The server of NEST Simulator seems to be unavailable at this URL."
            >
              <v-avatar left>
                <v-icon small v-text="'mdi-power-off'" />
              </v-avatar>
              <span> No valid response </span>
            </v-chip>
          </span>
        </div>
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
    const updateNESTSimulatorConfig = (config: any) => {
      state.app.backends.nestSimulator.updateConfig(config);
      checkNESTSimulator();
    };

    const rules = [
      (value: string) => {
        const pattern =
          /(https?:\/\/\b)(www\.)?([-a-zA-Z0-9@:%._\+~#=]{2,256}(\.[a-z]{2,4})?\b)(:\d{5,6}\b)?(\/[-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)?/;
        return (
          pattern.test(value) ||
          'Invalid pattern. Please enter the correct URL (http://localhost:52425).'
        );
      },
    ];

    return {
      checkNESTSimulator,
      rules,
      state,
      updateNESTSimulatorConfig,
    };
  },
});
</script>
