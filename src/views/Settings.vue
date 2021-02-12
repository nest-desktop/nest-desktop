<template>
  <div class="settings">
    <v-app-bar app clipped-left color="setting" dark dense flat>
      <v-toolbar-title>
        <v-icon class="ma-2">mdi-cogs</v-icon>
        Settings
      </v-toolbar-title>
    </v-app-bar>

    <v-main>
      <v-container>
        <v-card flat tile>
          <v-card-title>
            App
          </v-card-title>
          <v-card-text>
            <v-checkbox
              label="Development mode"
              v-model="core.app.config.devMode"
            />
          </v-card-text>
        </v-card>

        <v-card flat tile>
          <v-card-title>
            Database
          </v-card-title>
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
          <v-card-title>
            Backend
          </v-card-title>
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
      </v-container>
    </v-main>
  </div>
</template>

<script>
import Vue from 'vue';
import { reactive, watch } from '@vue/composition-api';
import core from '@/core/index';

export default Vue.extend({
  name: 'Settings',
  props: {
    id: String,
  },
  setup(props) {
    const state = reactive({ nestVersion: '' });

    const checkNEST = () => {
      core.app.nestServer.check();
      state.nestVersion = core.app.nestServer.state.simulatorVersion;
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
    };
  },
});
</script>
