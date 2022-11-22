<template>
  <div class="InsiteAccessConfig">
    <v-card outlined>
      <v-card-title class="d-flex">
        Insite
        <v-spacer />
        <v-switch
          :title="
            (state.app.backends.insiteAccess.enabled
              ? 'Ignore'
              : 'Search for') + ' this backend'
          "
          dense
          hide-details
          v-model="state.app.backends.insiteAccess.enabled"
        />
      </v-card-title>
      <v-card-subtitle>In-situ recording backend</v-card-subtitle>

      <v-card-text v-if="state.app.backends.insiteAccess.state.enabled">
        <v-text-field
          :rules="rules"
          @change="updateInsiteAccessConfig({ custom: true })"
          hint="Please enter the URL where the server of Insite can be found at (including protocol!)."
          label="URL of Insite access"
          persistent-hint
          placeholder="http://127.0.0.1:8080"
          v-model="state.app.backends.insiteAccess.url"
        />
      </v-card-text>

      <v-card-actions v-if="state.app.backends.insiteAccess.state.enabled">
        <v-btn @click="checkInsiteAccess" outlined small v-text="'Check'" />

        <div class="mx-3">
          <span v-if="state.insiteVersion && state.insiteVersion !== 'unknown'">
            <label>Response: </label>
            <v-chip
              color="green"
              dark
              small
              title="A server of Insite has been found at the given URL."
            >
              <v-avatar left>
                <v-icon small v-text="'mdi-checkbox-marked-circle'" />
              </v-avatar>
              Insite version: {{ state.insiteVersion }}
            </v-chip>
          </span>

          <span v-else-if="state.insiteVersion === 'unknown'">
            <label>Response: </label>
            <v-chip
              color="gray"
              dark
              small
              title="The server state of Insite has not been checked yet."
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
              title="The server of Insite seems to be unavailable at this URL."
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
  name: 'insiteAccessConfig',
  setup() {
    const state = reactive({
      app: core.app,
      insiteVersion: 'unknown',
    });

    onBeforeMount(() => checkInsiteAccess());

    /**
     * Check if Insite is running in the backend.
     */
    async function checkInsiteAccess() {
      core.app.backends.insiteAccess.check().finally(function () {
        // update the version (is updated as well in case of failure)
        state.insiteVersion =
          core.app.backends.insiteAccess.state.version.insite || '';
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
     * Update configurations for Insite access.
     */
    const updateInsiteAccessConfig = (config: any = {}) => {
      state.app.backends.insiteAccess.updateConfig(config);
      checkInsiteAccess();
    };

    return {
      checkInsiteAccess,
      rules,
      state,
      updateInsiteAccessConfig,
    };
  },
});
</script>
