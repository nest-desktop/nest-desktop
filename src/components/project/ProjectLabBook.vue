<template>
  <div
    class="projectLabBook"
    style="height: calc(70vh - 48px); overflow-y: auto"
    v-if="projectView.state.project"
  >
    <v-container>
      <span class="d-flex flex-md-row">
        <div
          class="mx-1"
          style="width: 100%"
          v-if="projectView.state.project.network.visibleNodes.length > 0"
        >
          <span
            :key="'node-' + node.idx"
            v-for="node of projectView.state.project.network.visibleNodes"
          >
            <v-card class="ma-2px" outlined tile>
              <v-sheet :color="node.view.color">
                <v-card class="ml-1" flat tile>
                  <v-card-title class="pa-0">
                    <v-row no-gutters>
                      <v-col cols="4">
                        <v-btn
                          :color="node.view.color"
                          :dark="projectView.config.coloredToolbar"
                          :text="!projectView.config.coloredToolbar"
                          @click="node.state.select()"
                          block
                          depressed
                          height="40"
                          tile
                          v-text="node.view.label"
                        />
                      </v-col>
                      <v-col cols="8">
                        <v-btn
                          :color="node.view.color"
                          :dark="projectView.config.coloredToolbar"
                          :text="!projectView.config.coloredToolbar"
                          block
                          depressed
                          height="40"
                          tile
                          v-text="node.model.label"
                        />
                      </v-col>
                    </v-row>
                  </v-card-title>

                  <v-card-text class="pa-0">
                    <v-list v-if="node.filteredParams.length > 0">
                      <v-list-item
                        :key="param.id"
                        style="min-height: 20px"
                        two-line
                        v-for="param of node.filteredParams"
                      >
                        <v-row no-gutters>
                          <span v-text="param.options.label" />
                          <v-spacer />
                          <span
                            class="mx-1 font-weight-bold text-right"
                            v-text="param.toCode()"
                          />
                          <span
                            style="min-width: 24px"
                            v-text="param.options.unit"
                          />
                        </v-row>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-sheet>
            </v-card>
          </span>
        </div>

        <div
          class="mx-1"
          style="width: 100%"
          v-if="projectView.state.project.network.visibleConnections.length > 0"
        >
          <span
            :key="'connection-' + connection.idx"
            v-for="connection of projectView.state.project.network
              .visibleConnections"
          >
            <v-card class="ma-2px" outlined tile>
              <v-sheet :color="connection.source.view.color">
                <v-card class="ml-1" flat tile>
                  <v-card-title class="pa-0">
                    <v-row no-gutters>
                      <v-col class="py-0" cols="4">
                        <v-btn
                          :color="connection.source.view.color"
                          :dark="projectView.config.coloredToolbar"
                          :text="!projectView.config.coloredToolbar"
                          @click="() => connection.source.state.select()"
                          block
                          depressed
                          height="40"
                          tile
                          v-text="connection.source.view.label"
                        />
                      </v-col>
                      <v-col cols="4">
                        <v-btn
                          @click="() => connection.state.select()"
                          block
                          depressed
                          height="40"
                          text
                          tile
                        >
                          <v-icon v-text="'mdi-arrow-right-bold-outline'" />
                        </v-btn>
                      </v-col>
                      <v-col class="py-0" cols="4" style="text-align: center">
                        <v-btn
                          :color="connection.target.view.color"
                          :dark="projectView.config.coloredToolbar"
                          :text="!projectView.config.coloredToolbar"
                          @click="() => connection.target.state.select()"
                          block
                          depressed
                          height="40"
                          tile
                          v-text="connection.target.view.label"
                        />
                      </v-col>
                    </v-row>
                  </v-card-title>

                  <v-card-text class="pa-0">
                    <v-list v-if="connection.synapse.filteredParams.length > 0">
                      <v-list-item
                        :key="param.id"
                        style="min-height: 20px; height: 20px"
                        v-for="param of connection.synapse.filteredParams"
                      >
                        <span v-text="param.options.label" />
                        <v-spacer />
                        <span
                          class="mx-1 font-weight-bold"
                          v-text="param.toCode()"
                        />
                        <span
                          style="min-width: 24px"
                          v-text="param.options.unit"
                        />
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>
              </v-sheet>
            </v-card>
          </span>
        </div>
      </span>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import core from '@/core';

export default Vue.extend({
  name: 'ProjectLabBook',
  setup() {
    const projectView = core.app.project.view;

    return {
      projectView,
    };
  },
});
</script>

<style>
.projectLabBook .v-card {
  border-width: 0;
}
</style>
