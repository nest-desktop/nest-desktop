<template>
  <div class="projectBar" v-if="projectView.state.project">
    <v-app-bar
      app
      class="no-print"
      clipped-right
      color="project"
      dark
      dense
      flat
    >
      <v-tabs
        :show-arrows="false"
        @change="() => projectView.updateProjectMode()"
        align-with-title
        color="secondary"
        grow
        icons-and-text
        style="max-width: 278px; width: 434px"
        v-model="projectView.state.modeIdx"
      >
        <v-tab class="ma-0" title="Edit network">
          <div class="tab-text" v-text="'Editor'" />
          <v-icon v-text="'$network'" />
        </v-tab>

        <v-menu offset-y open-on-hover>
          <template #activator="{ on, attrs }">
            <v-tab title="Explore activity" v-bind="attrs" v-on="on">
              <div class="tab-text" v-text="'Explorer'" />
              <ActivityGraphIcon
                :project="projectView.state.project"
                v-if="projectView.state.project.state.activities.hasSomeEvents"
              />
              <v-icon class="rotate-90" v-else v-text="'mdi-border-style'" />
            </v-tab>
          </template>

          <v-list dense>
            <v-list-item
              :disabled="
                !projectView.state.project.state.activities.hasSomeEvents
              "
              @click="projectView.selectActivityGraph('abstract')"
            >
              <v-list-item-icon>
                <ActivityGraphIcon
                  :project="projectView.state.project"
                  fixed
                  v-if="
                    projectView.state.project.state.activities.hasSomeEvents
                  "
                />
                <v-icon class="rotate-90" v-else v-text="'mdi-border-style'" />
              </v-list-item-icon>
              <v-list-item-title v-text="'abstract'" />
            </v-list-item>

            <v-list-item
              :disabled="
                !projectView.state.project.state.activities
                  .hasSomeSpatialActivities
              "
              @click="projectView.selectActivityGraph('spatial')"
            >
              <v-list-item-icon>
                <v-icon v-text="'mdi-axis-arrow'" />
              </v-list-item-icon>
              <v-list-item-title v-text="'spatial'" />
            </v-list-item>
          </v-list>
        </v-menu>

        <v-tab title="Lab book">
          <div class="tab-text" v-text="'Lab book'" />
          <v-icon v-text="'mdi-book-open-outline'" />
        </v-tab>
      </v-tabs>

      <v-spacer />

      <v-toolbar-title
        slass="d-none d-sm-flex mx-2"
        style="width: 100%"
        title="Rename project"
      >
        <v-text-field
          @change="projectView.state.project.clean()"
          append-icon="mdi-pencil-outline"
          hide-details
          v-model="projectView.state.project.name"
        />
      </v-toolbar-title>

      <span class="mx-2">
        <span class="d-flex d-md-none">
          <v-menu
            :close-on-content-click="false"
            left
            style="overflow: hidden; transform: translate(-100px, 0)"
          >
            <template #activator="{ on, attrs }">
              <v-btn text title="Network history" v-bind="attrs" v-on="on">
                <v-icon v-text="'mdi-history'" />
              </v-btn>
            </template>
            <v-card>
              <v-list class="ma-0 pa-0" dense>
                <v-list-item class="ma-0 pa-0">
                  <NetworkHistory />
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
        </span>

        <span class="d-none d-md-flex">
          <v-card flat text tile>
            <v-list class="ma-0 pa-0" color="project" dense>
              <v-list-item class="ma-0 pa-0">
                <NetworkHistory />
              </v-list-item>
            </v-list>
          </v-card>
        </span>
      </span>

      <div @click="projectView.state.modeIdx = 1">
        <SimulationButton
          :disabled="!nestSimulatorState.ready"
          :project="projectView.state.project"
        />
      </div>
    </v-app-bar>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import ActivityGraph from '@/components/activity/ActivityGraph.vue';
import ActivityGraphIcon from '@/components/activity/ActivityGraphIcon.vue';
import core from '@/core';
import NetworkHistory from '@/components/network/NetworkHistory.vue';
import SimulationButton from '@/components/simulation/SimulationButton.vue';

export default Vue.extend({
  name: 'ProjectBar',
  components: {
    ActivityGraph,
    ActivityGraphIcon,
    NetworkHistory,
    SimulationButton,
  },
  setup() {
    return {
      nestSimulatorState: core.app.backends.nestSimulator.state,
      projectView: core.app.project.view,
    };
  },
});
</script>

<style>
.projectBar .tab-text {
  font-size: 10px;
  margin-bottom: 2px !important;
}

.projectBar .rotate-90 {
  transform: rotate(-90deg);
}
</style>
