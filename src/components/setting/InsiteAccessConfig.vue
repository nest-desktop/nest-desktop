<template>
  <div class="InsiteAccessConfig">
    <v-card outlined>
      <v-card-subtitle v-text="'Insite Access'" />
      <v-card-text>
        <v-tooltip open-delay="300" top>
          <template v-slot:activator="{ on, attrs }">
            <v-text-field
              @change="updateInsiteAccessConfig"
              hide-details
              label="URL of Insite access"
              placeholder="http://127.0.0.1:8080"
              v-bind="attrs"
              v-model="state.app.backends.insiteAccess.url"
              v-on="on"
            />
          </template>
          <span>
            Please enter the URL where the server of Insite can be found at
            (including protocol!).
          </span>
        </v-tooltip>

        <div class="my-1">
          <span v-if="state.insiteVersion && state.insiteVersion !== 'unknown'">
            <label>Response: </label>
            <v-tooltip open-delay="300" right>
              <template v-slot:activator="{ on, attrs }">
                <v-chip color="green" dark small v-bind="attrs" v-on="on">
                  <v-avatar left>
                    <v-icon small v-text="'mdi-checkbox-marked-circle'" />
                  </v-avatar>
                  Insite version: {{ state.insiteVersion }}
                </v-chip>
              </template>
              <span>A server of Insite has been found at the given URL.</span>
            </v-tooltip>
          </span>

          <span v-else-if="state.insiteVersion === 'unknown'">
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
                The server state of Insite has not been checked yet.
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
                The server of Insite seems to be unavailable at this URL.
              </span>
            </v-tooltip>
          </span>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-btn @click="checkInsiteAccess" outlined small v-text="'Check'" />
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

    /**
     * Update configurations for Insite access.
     */
    const updateInsiteAccessConfig = () => {
      state.app.backends.insiteAccess.updateConfig({ custom: true });
      checkInsiteAccess();
    };

    return {
      checkInsiteAccess,
      state,
      updateInsiteAccessConfig,
    };
  },
});
</script>
