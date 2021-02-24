<template>
  <div class="lab-book" v-if="state.project">
    <v-container>
      <v-card
        flat
        style="height:calc(70vh - 48px); overflow-y:auto; overflow-x:hidden"
        tile
      >
        <v-card-title
          class="print"
          style="display: none"
          v-text="state.project.name"
        />

        <v-row dense>
          <v-col cols="6">
            <draggable v-model="state.project.network.nodes">
              <transition-group>
                <v-card
                  :color="node.view.color"
                  :key="node.idx"
                  class="mb-1"
                  flat
                  tile
                  v-for="node of state.project.network.nodes"
                >
                  <v-row no-gutters>
                    <v-col cols="3">
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
                    <v-col cols="9">
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
                  <v-list
                    class="ml-1"
                    style="opacity:0.8"
                    v-if="node.filteredParams.length > 0"
                  >
                    <v-list-item
                      :key="param.id"
                      style="min-height:20px"
                      two-line
                      v-for="param of node.filteredParams"
                    >
                      <v-row no-gutters>
                        <span v-text="param.options.label" />
                        <v-spacer />
                        <span
                          class="mx-1"
                          style="font-weight: bold"
                          v-text="param.value"
                        />
                        <v-col
                          cols="1"
                          class="text-no-wrap"
                          v-text="param.options.unit"
                        />
                      </v-row>
                    </v-list-item>
                  </v-list>
                </v-card>
              </transition-group>
            </draggable>
          </v-col>

          <v-col cols="6">
            <draggable v-model="state.project.network.connections">
              <transition-group>
                <v-card
                  :color="connection.source.view.color"
                  :key="connection.idx"
                  class="mb-1"
                  flat
                  tile
                  v-for="connection of state.project.network.connections"
                >
                  <v-img
                    :gradient="'to right, ' + connection.view.backgroundImage"
                  >
                    <v-row no-gutters>
                      <v-col cols="3" class="py-0" style="text-align:center">
                        <v-btn
                          @click="() => connection.source.view.select()"
                          block
                          dark
                          height="40"
                          text
                          tile
                          v-text="connection.source.view.label"
                        />
                      </v-col>
                      <v-col cols="5">
                        <v-btn
                          @click="() => connection.view.select()"
                          block
                          dark
                          height="40"
                          text
                          tile
                        >
                          <v-icon v-text="'mdi-arrow-right-bold-outline'" />
                        </v-btn>
                      </v-col>
                      <v-col cols="4" class="py-0" style="text-align:center">
                        <v-btn
                          @click="() => connection.target.view.select()"
                          block
                          dark
                          height="40"
                          text
                          tile
                          v-text="connection.target.view.label"
                        />
                      </v-col>
                    </v-row>
                    <v-list
                      class="mx-1"
                      style="opacity:0.8"
                      v-if="connection.synapse.filteredParams.length > 0"
                    >
                      <v-list-item
                        :key="param.id"
                        style="min-height:20px; height:20px"
                        v-for="param of connection.synapse.filteredParams"
                      >
                        <span v-text="param.options.label" />
                        <v-spacer />
                        <span
                          class="mx-1"
                          style="font-weight: bold"
                          v-text="param.value"
                        />
                        <v-col
                          cols="1"
                          class="text-no-wrap"
                          v-text="param.options.unit"
                        />
                      </v-list-item>
                    </v-list>
                  </v-img>
                </v-card>
              </transition-group>
            </draggable>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive, watch, onMounted } from '@vue/composition-api';
import draggable from 'vuedraggable';

import core from '@/core/index';

export default Vue.extend({
  name: 'LabBook',
  components: {
    draggable,
  },
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
