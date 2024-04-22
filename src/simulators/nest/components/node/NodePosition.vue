<template>
  <div class="NodePosition">
    <v-card flat height="40" rounded="0">
      <v-card-text class="px-2" style="padding: 10px 0">
        <NodePositionTitle :key="node.spatial.hash" :spatial="node.spatial" />
      </v-card-text>

      <v-menu
        :close-on-content-click="false"
        activator="parent"
        v-if="node.spatial.positions"
      >
        <v-card tile style="width: 315px">
          <v-card-subtitle>
            <NodePositionTitle
              :key="node.spatial.hash"
              :spatial="node.spatial"
            />
          </v-card-subtitle>

          <v-card-text class="py-0">
            <v-select
              :items="state.positions"
              @change="initPositions()"
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
                  v-model="node.spatial.positions.numDimensions"
                />
              </v-col>
            </v-row>

            <span v-if="node.spatial.positions.name === 'free'">
              <ParameterEdit
                :color="node.view.color"
                :options="state.sizeOptions"
                :value.sync="node.size"
              />
            </span>

            <span v-if="node.spatial.positions.name === 'grid'">
              <v-row class="mt-1">
                <v-col class="ma-auto" cols="3">shape</v-col>
                <v-spacer />
                <v-col
                  :key="idx"
                  class="py-1"
                  cols="3"
                  v-for="(item, idx) of node.spatial.positions.shape"
                >
                  <v-text-field
                    :label="
                      (node.spatial.positions.numDimensions === 2
                        ? ['rows', 'columns']
                        : ['x', 'y', 'z'])[idx]
                    "
                    :min="1"
                    :value="item"
                    hide-details
                    type="number"
                  />
                </v-col>
              </v-row>

              <v-row class="mt-1">
                <v-col class="ma-auto" cols="3">center</v-col>
                <v-spacer />
                <v-col
                  :key="idx"
                  class="py-1"
                  cols="3"
                  v-for="(item, idx) of node.spatial.positions.center"
                >
                  <v-text-field
                    :label="['x', 'y', 'z'][idx]"
                    :step="0.1"
                    :value="item"
                    hide-details
                    type="number"
                  />
                </v-col>
              </v-row>
            </span>

            <v-row class="mt-1">
              <v-col class="ma-auto" cols="3">extent</v-col>
              <v-spacer />
              <v-col
                :key="idx"
                class="py-1"
                cols="3"
                v-for="(item, idx) of node.spatial.positions.extent"
              >
                <v-text-field
                  :label="['x', 'y', 'z'][idx]"
                  :min="0"
                  :step="0.1"
                  :value="item"
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
                  v-model="node.spatial.positions.edgeWrap"
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
    </v-card>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive } from "vue";

import ParameterEdit from "@/components/parameter/ParameterEdit.vue";
import NodePositionTitle from "@/components/node/NodePositionTitle.vue";
import { NESTNode } from "../../helpers/node/node";

const props = defineProps<{ node: NESTNode }>();
const node = computed(() => props.node);

const state = reactive({
  positions: [
    { id: "free", name: "Free positions" },
    { id: "grid", name: "Grid positions" },
  ],
  selectedPositions: "free",
  sizeOptions: {
    input: "valueSlider",
    label: "population size",
    max: 1000,
    rules: [
      ["value > 0", "The value must be strictly positive.", "error"],
      [
        "value < 1000",
        "Large values generate many data points and can put quite a load on your browser.",
        "warning",
      ],
    ],
    value: 1,
  },
});

const initPositions = () => {
  const specs: any = node.value.spatial.positions?.toJSON();
  node.value.spatial.init({
    positions: state.selectedPositions,
    specs: specs,
  });
};

const updatePositions = () => {
  // state.node.spatial.positions.generate();
  node.value.changes();
};

onMounted(() => {
  state.selectedPositions = node.value.spatial.positions?.name || "free";
});
</script>
