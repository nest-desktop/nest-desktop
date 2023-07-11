<template>
  <div class="CoSimConfig">
    <v-card outlined>
      <v-card-title class="d-flex">
        CoSim
        <v-spacer />
        <v-switch
          :title="
            (state.app.backends.coSim.enabled ? 'Ignore' : 'Search for') +
            ' this backend'
          "
          dense
          hide-details
          v-model="state.app.backends.coSim.enabled"
        />
      </v-card-title>
      <v-card-subtitle>Co-simulation framework</v-card-subtitle>

      <v-card-text v-if="state.app.backends.coSim.state.enabled">
        <v-text-field
          :rules="rules"
          @change="updateCoSimConfig({ custom: true })"
          hint="Please enter the URL where the server of CoSim can be found at (including protocol!)."
          label="URL of CoSim access"
          persistent-hint
          placeholder="http://127.0.0.1:52428"
          v-model="state.app.backends.coSim.url"
        />
      </v-card-text>

      <v-card-actions v-if="state.app.backends.coSim.state.enabled">
        <v-btn @click="checkcoSim" outlined small v-text="'Check'" />

        <div class="mx-3">
          <span v-if="state.coSimVersion && state.coSimVersion !== 'unknown'">
            <label>Response: </label>
            <v-chip
              color="green"
              dark
              small
              title="A server of CoSim has been found at the given URL."
            >
              <v-avatar left>
                <v-icon small v-text="'mdi-checkbox-marked-circle'" />
              </v-avatar>
              CoSim version: {{ state.coSimVersion }}
            </v-chip>
          </span>

          <span v-else-if="state.coSimVersion === 'unknown'">
            <label>Response: </label>
            <v-chip
              color="gray"
              dark
              small
              title="The server state of CoSim has not been checked yet."
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
              title="The server of CoSim seems to be unavailable at this URL."
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
  name: 'coSimConfig',
  setup() {
    const state = reactive({
      app: core.app,
      coSimVersion: 'unknown',
    });

    onBeforeMount(() => checkCoSim());

    /**
     * Check if CoSim is running in the backend.
     */
    async function checkCoSim() {
      core.app.backends.coSim.check().finally(function () {
        // update the version (is updated as well in case of failure)
        state.coSimVersion =
          core.app.backends.coSim.state.version.CoSimServer || '';
      });
    }

    const rules = [
      (value: string) => {
        const pattern =
          /(https?:\/\/\b)(www\.)?([-a-zA-Z0-9@:%._\+~#=]{2,256}(\.[a-z]{2,4})?\b)(:\d{5,6}\b)?(\/[-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)?/;
        return (
          pattern.test(value) ||
          'Invalid pattern. Please enter the correct URL (http://localhost:8080).'
        );
      },
    ];

    /**
     * Update configurations for CoSim access.
     */
    const updateCoSimConfig = (config: any = {}) => {
      state.app.backends.coSim.updateConfig(config);
      checkCoSim();
    };

    return {
      checkCoSim,
      rules,
      state,
      updateCoSimConfig,
    };
  },
});
</script>

<style></style>
