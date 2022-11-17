<template>
  <div class="NodePosition">
    <v-menu :close-on-content-click="false" v-if="state.node.spatial.positions">
      <template #activator="{ on, attrs }">
        <v-card flat height="40" tile v-bind="attrs" v-on="on">
          <v-card-text class="px-2" style="padding: 10px 0">
            <NodePositionTitle
              :key="state.node.spatial.hash"
              :spatial="state.node.spatial"
            />
          </v-card-text>
        </v-card>
      </template>

      <v-card tile style="width: 315px">
        <v-card-subtitle>
          <NodePositionTitle
            :key="state.node.spatial.hash"
            :spatial="state.node.spatial"
          />
        </v-card-subtitle>

        <v-card-text class="py-0">
          <v-select
            :items="state.positions"
            @change="initPositions"
            class="ma-0 pa-0"
            hide-details
            item-text="name"
            item-value="id"
            v-model="state.selectedPositions"
          />

          <v-row class="mt-1">
            <v-col cols="8" v-text="'number of dimensions'" />
            <v-col class="py-0" cols="4">
              <v-slider
                :tick-labels="[2, 3]"
                max="3"
                min="2"
                ticks="always"
                v-model="state.node.spatial.positions.numDimensions"
              />
            </v-col>
          </v-row>

          <span v-if="state.node.spatial.positions.name === 'free'">
            <ParameterEdit
              :color="state.node.view.color"
              :options="state.sizeOptions"
              :value.sync="state.node.size"
            />
          </span>

          <span v-if="state.node.spatial.positions.name === 'grid'">
            <v-row class="mt-1">
              <v-col class="ma-auto" cols="3" v-text="'shape'" />
              <v-spacer />
              <v-col
                :key="idx"
                class="py-1"
                cols="3"
                v-for="(item, idx) of state.node.spatial.positions.shape"
              >
                <v-text-field
                  :label="
                    (state.node.spatial.positions.numDimensions === 2
                      ? ['rows', 'columns']
                      : ['x', 'y', 'z'])[idx]
                  "
                  :min="1"
                  :value="item"
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

            <v-row class="mt-1">
              <v-col class="ma-auto" cols="3" v-text="'center'" />
              <v-spacer />
              <v-col
                :key="idx"
                class="py-1"
                cols="3"
                v-for="(item, idx) of state.node.spatial.positions.center"
              >
                <v-text-field
                  :label="['x', 'y', 'z'][idx]"
                  :step="0.1"
                  :value="item"
                  @change="
                    value => {
                      state.node.spatial.positions.center[idx] =
                        parseInt(value);
                    }
                  "
                  hide-details
                  type="number"
                />
              </v-col>
            </v-row>
          </span>

          <v-row class="mt-1">
            <v-col class="ma-auto" cols="3" v-text="'extent'" />
            <v-spacer />
            <v-col
              :key="idx"
              class="py-1"
              cols="3"
              v-for="(item, idx) of state.node.spatial.positions.extent"
            >
              <v-text-field
                :label="['x', 'y', 'z'][idx]"
                :min="0"
                :step="0.1"
                :value="item"
                @change="
                  value => {
                    state.node.spatial.positions.extent[idx] = parseInt(value);
                    updatePositions();
                  }
                "
                hide-details
                type="number"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col class="py-0">
              <v-checkbox
                class="ma-0"
                color="accent"
                label="Edge wrap"
                v-model="state.node.spatial.positions.edgeWrap"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions>
          <v-btn
            @click="updatePositions"
            outlined
            small
            v-text="'Update positions'"
          />
          <!-- <v-spacer />
          <v-btn :title="state.node.spatial.positions.pos" icon>
            <v-icon v-text="'mdi-map-outline'" />
          </v-btn> -->
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { onMounted, reactive } from '@vue/composition-api';

import { Node } from '@/core/node/node';
import ParameterEdit from '@/components/parameter/ParameterEdit.vue';
import NodePositionTitle from '@/components/node/NodePositionTitle.vue';

export default Vue.extend({
  name: 'NodePosition',
  components: {
    NodePositionTitle,
    ParameterEdit,
  },
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
      sizeOptions: {
        input: 'valueSlider',
        label: 'population size',
        max: 1000,
        rules: [
          ['value > 0', 'The value must be strictly positive.', 'error'],
          [
            'value < 1000',
            'Large values generate many data points and can put quite a load on your browser.',
            'warning',
          ],
        ],
        value: 1,
      },
    });

    const initPositions = () => {
      const specs: any = state.node.spatial.positions.toJSON();
      state.node.spatial.init({
        positions: state.selectedPositions,
        specs: specs,
      });
    };

    const updatePositions = () => {
      // state.node.spatial.positions.generate();
      state.node.nodeChanges();
    };

    onMounted(() => {
      state.selectedPositions = state.node.spatial.positions.name;
    });

    return {
      state,
      initPositions,
      updatePositions,
    };
  },
});
</script>
