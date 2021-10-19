<template>
  <div class="projectLabBook" v-if="projectView.state.project">
    <v-container>
      <v-card
        flat
        style="height: calc(70vh - 48px); overflow-y: auto; overflow-x: hidden"
        tile
      >
        <v-card-title
          class="print"
          style="display: none"
          v-text="projectView.state.project.name"
        />

        <span class="d-flex flex-md-row">
          <div
            class="mx-1"
            style="width: 100%"
            v-if="projectView.state.project.network.visibleNodes.length > 0"
          >
            <v-card
              :key="'node-' + node.idx"
              :style="{
                borderLeft: `4px solid ${node.view.color}`,
              }"
              class="ma-1"
              tile
              outlined
              v-for="node of projectView.state.project.network.visibleNodes"
            >
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
          </div>

          <div
            class="mx-1"
            style="width: 100%"
            v-if="
              projectView.state.project.network.visibleConnections.length > 0
            "
          >
            <v-card
              :key="'connection-' + connection.idx"
              :style="{
                borderLeft: `4px solid ${connection.source.view.color}`,
                borderRight: `4px solid ${connection.target.view.color}`,
              }"
              class="ma-1"
              tile
              outlined
              v-for="connection of projectView.state.project.network
                .visibleConnections"
            >
              <v-card-title class="pa-0">
                <v-row no-gutters>
                  <v-col cols="4" class="py-0">
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
                      color="white"
                      depressed
                      height="40"
                      tile
                    >
                      <v-icon v-text="'mdi-arrow-right-bold-outline'" />
                    </v-btn>
                  </v-col>
                  <v-col cols="4" class="py-0" style="text-align: center">
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
                    <span style="min-width: 24px" v-text="param.options.unit" />
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </div>
        </span>
      </v-card>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import core from '@/core';

export default Vue.extend({
  name: 'ProjectLabBook',
  setup() {
    const projectView = core.app.projectView;

    return {
      projectView,
    };
  },
});
</script>
