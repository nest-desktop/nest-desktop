<template>
  <div class="SettingsDialog">
    <v-dialog max-width="480" v-model="dialogState.open">
      <v-card>
        <span v-if="dialogState.action === 'resetDatabases'">
          <v-card-title v-text="'Are you sure to reset all databases?'" />

          <v-card-text>
            Your modified models and projects will be lost!
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn @click="closeDialog" outlined small text v-text="'cancel'" />
            <v-btn @click="resetDatabases" outlined small v-text="'reset'" />
          </v-card-actions>
        </span>

        <span v-if="dialogState.action === 'resetConfigs'">
          <v-card-title v-text="'Are you sure to reset all configurations?'" />

          <v-card-text>
            All configurations for the app will be lost! The app will be
            reloaded afterwards.
          </v-card-text>

          <v-card-actions>
            <v-spacer />
            <v-btn @click="closeDialog" outlined small text v-text="'cancel'" />
            <v-btn @click="resetConfigs" outlined small v-text="'reset'" />
          </v-card-actions>
        </span>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import Vue from 'vue';

import core from '@/core';

export default Vue.extend({
  name: 'SettingsDialog',
  setup() {
    /**
     * Reset configurations.
     */
    const resetDatabases = () => {
      core.app.resetDatabases();
    };

    /**
     * Reset configurations.
     */
    const resetConfigs = () => {
      localStorage.clear();
      location.reload();
    };

    return {
      closeDialog: () => core.app.closeDialog(),
      dialogState: core.app.state.dialog,
      resetDatabases,
      resetConfigs,
    };
  },
});
</script>
