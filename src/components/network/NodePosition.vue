<template>
  <div class="NodePosition">
    <v-menu :close-on-content-click="false" v-if="state.node.spatial.positions">
      <template v-slot:activator="{ on, attrs }">
        <v-card height="40" tile flat v-bind="attrs" v-on="on">
          <v-card-text class="px-2" style="padding: 10px 0">
            <v-row no-gutters>
              <span v-text="'Positions'" />
              <v-spacer />
              <span v-text="state.node.spatial.positions.pos.length" />
            </v-row>
          </v-card-text>
        </v-card>
      </template>

      <v-card tile style="width:315px">
        <v-card-subtitle v-text="'Positions'" />

        <v-card-text class="py-0">
          <v-select
            :items="state.positions"
            @change="initPositions"
            hide-details
            item-text="name"
            item-value="id"
            v-model="state.selectedPositions"
          />

          <span v-if="state.node.spatial.positions.name === 'free'">
            <!-- <v-row>
              <v-col class="py-3" cols="8" v-text="'pos'" />
              <v-text-field :value="state.node.spatial.positions.pos" />
            </v-row> -->

            <v-row>
              <v-col class="py-3" cols="8" v-text="'number of dimensions'" />
              <v-col class="py-0" cols="4">
                <v-slider
                  :tick-labels="[2, 3]"
                  min="2"
                  max="3"
                  ticks="always"
                  v-model="state.node.spatial.positions.numDimensions"
                />
              </v-col>
            </v-row>
          </span>

          <span v-if="state.node.spatial.positions.name === 'grid'">
            <v-row>
              <v-col class="py-4" cols="6" v-text="'shape'" />
              <v-col
                :key="idx"
                class="py-1"
                cols="3"
                v-for="(item, idx) of state.node.spatial.positions.shape"
              >
                <v-text-field
                  :value="item"
                  :label="['rows', 'columns'][idx]"
                  @change="
                    value => {
                      state.node.spatial.positions.shape[idx] = parseInt(value);
                    }
                  "
                  hide-details
                  type="number"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col class="py-4" cols="3" v-text="'center'" />
              <v-spacer />
              <v-col
                :key="idx"
                class="py-1"
                cols="3"
                v-for="(item, idx) of state.node.spatial.positions.center"
              >
                <v-text-field
                  :label="['x', 'y'][idx]"
                  :value="item"
                  @change="
                    value => {
                      state.node.spatial.positions.center[idx] = parseInt(
                        value
                      );
                    }
                  "
                  hide-details
                  type="number"
                />
              </v-col>
            </v-row>
          </span>

          <v-row>
            <v-col class="py-4" cols="3" v-text="'extent'" />
            <v-spacer />
            <v-col
              :key="idx"
              class="py-1"
              cols="3"
              v-for="(item, idx) of state.node.spatial.positions.extent"
            >
              <v-text-field
                :label="['x', 'y', 'z'][idx]"
                :value="item"
                @change="
                  value => {
                    state.node.spatial.positions.extent[idx] = parseInt(value);
                  }
                "
                hide-details
                type="number"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col class="py-0">
              <v-checkbox v-model="state.node.spatial.positions.edgeWrap">
                <template v-slot:label>
                  Edge wrap
                </template>
              </v-checkbox>
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-btn
            @click="updatePositions"
            outlined
            v-text="'Generate positions'"
          />
          <v-spacer />
          <v-btn :title="state.node.spatial.positions.pos" icon>
            <v-icon v-text="'mdi-map-outline'" />
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive } from '@vue/composition-api';

import { Node } from '@/core/node/node';

export default Vue.extend({
  name: 'NodePosition',
  props: {
    node: Node,
  },
  setup(props) {
    const state = reactive({
      node: props.node as Node,
      positions: [
        { id: 'free', name: 'Free positions' },
        { id: 'grid', name: 'Grid positions' },
      ],
      selectedPositions: 'free',
    });

    const initPositions = () => {
      // console.log(this.positionType, event);
      const config: any =
        state.selectedPositions === 'free'
          ? { numDimensions: 2 }
          : { shape: [1, 1] };
      state.node.initSpatial(config);
      updatePositions();
    };

    const updatePositions = () => {
      state.node.spatial.positions.generate();
      state.node.nodeChanges();
    };

    return {
      state,
      initPositions,
      updatePositions,
    };
  },
});
</script>
