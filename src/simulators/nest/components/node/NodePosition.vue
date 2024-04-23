<template>
  <v-expansion-panels v-if="node.spatial.positions">
    <v-expansion-panel density="compact" elevation="0" flat rounded="0">
      <v-expansion-panel-title class="expansion-panel-title">
        <NodePositionTitle
          :key="node.spatial.hash"
          :nodeSpatial="node.spatial"
        />
      </v-expansion-panel-title>

      <v-expansion-panel-text>
        <v-select
          :items="state.positions"
          @update:model-value="initPositions()"
          density="compact"
          hide-details
          v-model="state.selectedPositions"
          variant="outlined"
        />

        <v-switch
          inset
          max="3"
          min="2"
          true-icon="mdi:mdi-numeric-3"
          false-icon="mdi:mdi-numeric-2"
          show-ticks="always"
          step="1"
          @update:model-value="
            (value) => (node.spatial.positions.numDimensions = value ? 3 : 2)
          "
          v-model="state.numDimensions"
          label="number of dimensions"
        >
        </v-switch>

        <span v-if="node.spatial.positions.name === 'free'">
          <ValueSlider
            :thumb-color="node.view.color"
            @update:model-value="node.changes()"
            id="n"
            input-label="n"
            label="population size"
            v-model="node.size"
          />
        </span>

        <span v-if="node.spatial.positions.name === 'grid'">
          <v-row>
            <v-col class="ma-auto" cols="3">shape</v-col>
            <v-spacer />
            <v-col
              :key="idx"
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
                :model-value="item"
                @update:model-value="
                  (value) =>
                    (node.spatial.positions.shape[idx] = parseInt(value))
                "
                density="compact"
                hide-details
                type="number"
                variant="outlined"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col class="ma-auto" cols="3">center</v-col>
            <v-spacer />
            <v-col
              :key="idx"
              cols="3"
              v-for="(item, idx) of node.spatial.positions.center"
            >
              <v-text-field
                :label="['x', 'y', 'z'][idx]"
                :model-value="item"
                :step="0.1"
                @update:model-value="
                  (value) =>
                    (node.spatial.positions.center[idx] = parseFloat(value))
                "
                density="compact"
                hide-details
                type="number"
                variant="outlined"
              />
            </v-col>
          </v-row>
        </span>

        <v-row>
          <v-col class="ma-auto" cols="3" title="">extent</v-col>
          <v-spacer />
          <v-col
            :key="idx"
            cols="3"
            v-for="(item, idx) of node.spatial.positions.extent"
          >
            <v-text-field
              :label="['x', 'y', 'z'][idx]"
              :min="0"
              :model-value="item"
              :step="0.1"
              @update:model-value="
                (value) =>
                  (node.spatial.positions.extent[idx] = parseFloat(value))
              "
              density="compact"
              hide-details
              type="number"
              variant="outlined"
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
        <v-btn @click="updatePositions()" size="small" variant="outlined">
          Update positions
        </v-btn>
        <!-- <v-spacer />
        <v-btn :title="state.node.spatial.positions.pos" icon>
          <v-icon v-text="'mdi-map-outline'" />
        </v-btn> -->
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, reactive } from "vue";

import NodePositionTitle from "./NodePositionTitle.vue";
import ValueSlider from "@/components/controls/ValueSlider.vue";
import { NESTNode } from "../../helpers/node/node";

const props = defineProps<{ node: NESTNode }>();
const node = computed(() => props.node);

const state = reactive({
  numDimensions: false,
  positions: [
    { title: "Free positions", value: "free" },
    { title: "Grid positions", value: "grid" },
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
  nextTick(() => {
    node.value.spatial.init({
      positions: state.selectedPositions,
    });
  });
};

const updatePositions = () => {
  // node.value.spatial.positions?.generate();
  node.value.changes();
};

onMounted(() => {
  state.selectedPositions = node.value.spatial.positions?.name || "free";
});
</script>
