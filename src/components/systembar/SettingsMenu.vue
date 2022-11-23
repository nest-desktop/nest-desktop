<template>
  <div class="settingsMenu">
    <v-menu offset-y transition="slide-y-transition">
      <template #activator="{ on, attrs }">
        <v-btn small text v-bind="attrs" v-on="on">
          Settings
          <v-icon right v-text="'mdi-menu-down'" />
        </v-btn>
      </template>

      <v-card flat tile>
        <span v-if="state.content == null">
          <v-list dense>
            <v-list-item
              :key="index"
              @click="openDialog(item.id)"
              v-for="(item, index) in state.items"
            >
              <v-list-item-icon>
                <v-icon v-text="item.icon" />
              </v-list-item-icon>
              <v-list-item-title v-text="item.title" />
            </v-list-item>
          </v-list>
        </span>
      </v-card>
    </v-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive } from '@vue/composition-api';

import core from '@/core';

export default Vue.extend({
  name: 'SettingsMenu',
  setup() {
    const state = reactive({
      items: [
        {
          id: 'resetConfigs',
          icon: 'mdi-cog-refresh',
          title: 'Reset all configurations',
        },
        {
          id: 'resetDatabases',
          icon: '$mdiDatabaseRefreshOutline',
          title: 'Reset all databases',
        },
      ],
    });

    /**
     * Open a dialog for settings.
     * @param action Dialog to open
     */
    const openDialog = (action: string) => {
      core.app.openDialog('settings', action);
    };

    return {
      openDialog,
      state,
    };
  },
});
</script>
