<template>
  <div class="settingsMenu">
    <v-menu
      :close-on-content-click="false"
      :position-x="state.position.x"
      :position-y="state.position.y"
      :value="state.show"
      transition="slide-y-transition"
    >
      <v-card flat style="min-width: 300px" tile>
        <span v-if="state.content == null">
          <v-list dense>
            <v-list-item
              :key="index"
              @click="item.onClick"
              v-for="(item, index) in state.items"
            >
              <v-list-item-icon>
                <v-icon v-text="item.icon" />
              </v-list-item-icon>
              <v-list-item-title v-text="item.title" />

              <v-list-item-action v-show="item.append">
                <v-icon small v-text="'mdi-menu-right'" />
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </span>

        <span v-if="state.content === 'databasesReset'">
          <v-card-title v-text="'Are you sure to reset all databases?'" />

          <v-card-text>
            The databases (stored in the NEST Desktop cookies of your browser)
            will be reset.
          </v-card-text>

          <v-card-actions>
            <v-btn @click="reset" outlined small text>
              <v-icon left v-text="'mdi-menu-left'" /> back
            </v-btn>
            <v-spacer />
            <v-btn @click="resetDatabases" outlined small v-text="'Reset'" />
          </v-card-actions>
        </span>

        <span v-if="state.content === 'configsReset'">
          <v-card-title v-text="'Are you sure to reset all configs?'" />

          <v-card-text>
            The configurations will be reset and then the app will be reloaded.
          </v-card-text>

          <v-card-actions>
            <v-btn @click="reset" outlined small text>
              <v-icon left v-text="'mdi-menu-left'" /> back
            </v-btn>
            <v-spacer />
            <v-btn @click="resetConfigs" outlined small v-text="'Reset'" />
          </v-card-actions>
        </span>
      </v-card>
    </v-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive, watch } from '@vue/composition-api';

import core from '@/core';

export default Vue.extend({
  name: 'SettingsMenu',
  props: {
    position: Object,
  },
  setup(props) {
    const state = reactive({
      content: undefined,
      position: props.position,
      show: true,
      items: [
        {
          id: 'configsReset',
          icon: 'mdi-cog-refresh',
          title: 'Reset all configurations',
          onClick: () => {
            state.content = 'configsReset';
          },
          append: true,
        },
        {
          id: 'databasesReset',
          icon: '$mdiDatabaseRefreshOutline',
          title: 'Reset all databases',
          onClick: () => {
            state.content = 'databasesReset';
          },
          append: true,
        },
      ],
    });

    /**
     * Reset states.
     */
    const reset = () => {
      state.content = undefined;
    };

    /**
     * Reset configurations.
     */
    const resetDatabases = () => {
      core.app.resetDatabases();
      state.show = false;
    };

    /**
     * Reset configurations.
     */
    const resetConfigs = () => {
      localStorage.clear();
      location.reload();
    };

    watch(
      () => props.position,
      () => {
        state.show = false;
        reset();
        state.position = props.position;
        state.show = true;
      }
    );

    return {
      reset,
      resetDatabases,
      resetConfigs,
      state,
    };
  },
});
</script>
