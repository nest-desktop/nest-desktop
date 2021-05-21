<template>
  <div class="lab-book" v-if="state.project">
    <v-container>
      <v-card
        flat
        style="height: calc(70vh - 48px); overflow-y: auto; overflow-x: hidden"
        tile
      >
        <v-card-title
          class="print"
          style="display: none"
          v-text="state.project.name"
        />

        <span class="d-flex flex-md-row">
          <div
            class="mx-1"
            style="width: 100%"
            v-if="state.project.network.visibleNodes.length > 0"
          >
            <v-card
              :key="'node-' + node.idx"
              class="mb-1"
              flat
              tile
              v-for="node of state.project.network.visibleNodes"
            >
              <v-sheet :color="node.view.color">
                <v-row no-gutters>
                  <v-col cols="4">
                    <v-btn
                      @click="node.view.select()"
                      block
                      dark
                      height="40"
                      text
                      tile
                      v-text="node.view.label"
                    />
                  </v-col>
                  <v-col cols="8">
                    <v-btn
                      class="ma-0"
                      block
                      dark
                      height="40"
                      text
                      tile
                      v-text="node.model.label"
                    />
                  </v-col>
                </v-row>
              </v-sheet>

              <v-card-text
                :style="{
                  borderLeft: `4px solid ${node.view.color}`,
                }"
                class="pa-0"
              >
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
            v-if="state.project.network.visibleConnections.length > 0"
          >
            <v-card
              :key="'connection-' + connection.idx"
              class="mb-1"
              flat
              tile
              v-for="connection of state.project.network.visibleConnections"
            >
              <v-row no-gutters>
                <v-col cols="4" class="py-0">
                  <v-btn
                    :color="connection.source.view.color"
                    @click="() => connection.source.view.select()"
                    block
                    dark
                    depressed
                    height="40"
                    tile
                    v-text="connection.source.view.label"
                  />
                </v-col>
                <v-col cols="4">
                  <v-btn
                    @click="() => connection.view.select()"
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
                    @click="() => connection.target.view.select()"
                    block
                    dark
                    depressed
                    height="40"
                    tile
                    v-text="connection.target.view.label"
                  />
                </v-col>
              </v-row>

              <v-card-text
                :style="{
                  borderLeft: `4px solid ${connection.source.view.color}`,
                  borderRight: `4px solid ${connection.target.view.color}`,
                }"
                class="pa-0"
              >
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
import { reactive, watch, onMounted } from '@vue/composition-api';

import core from '@/core';

export default Vue.extend({
  name: 'LabBook',
  props: {
    hash: String,
  },
  setup(props) {
    const state = reactive({
      hash: props.hash,
      project: undefined,
    });

    watch(
      () => props.hash,
      hash => {
        state.hash = hash;
        state.project = core.app.project;
      }
    );

    onMounted(() => {
      state.project = core.app.project;
    });

    return {
      state,
    };
  },
});
</script>
