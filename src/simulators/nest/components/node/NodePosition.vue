<template>
  <v-expansion-panels v-if="nodeSpatial.positions" variant="accordion">
    <v-expansion-panel density="compact" elevation="0" tile>
      <v-expansion-panel-title class="expansion-panel-title">
        <NodePositionTitle :key="nodeSpatial.hash" :nodeSpatial="nodeSpatial" />
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
            (value: boolean | null) =>
              nodeSpatial.updatePositionParams({ numDimensions: value ? 3 : 2 })
          "
          v-model="state.numDimensions"
          label="number of dimensions"
        >
        </v-switch>

        <span v-if="nodeSpatial.positions.name === 'free'">
          <ValueSlider
            :thumb-color="nodeSpatial.node.view.color"
            @update:model-value="nodeSpatial.changes()"
            id="n"
            input-label="n"
            label="population size"
            v-model="nodeSpatial.node.size"
          />
        </span>

        <span v-if="nodeSpatial.positions.name === 'grid'">
          <v-row>
            <v-col class="ma-auto" cols="3">shape</v-col>
            <v-spacer />
            <v-col
              :key="idx"
              cols="3"
              v-for="(item, idx) of nodeSpatial.positions.shape"
            >
              <v-text-field
                :label="
                  (nodeSpatial.positions.numDimensions === 2
                    ? ['rows', 'columns']
                    : ['x', 'y', 'z'])[idx]
                "
                :min="1"
                :model-value="item"
                @update:model-value="
                  (value: string) => {
                    if (nodeSpatial.positions) {
                      const shape: number[] = nodeSpatial.positions.shape;
                      shape[idx] = parseInt(value);
                      nodeSpatial.updatePositionParams({ shape });
                    }
                  }
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
              v-for="(item, idx) of nodeSpatial.positions.center"
            >
              <v-text-field
                :label="['x', 'y', 'z'][idx]"
                :model-value="item"
                :step="0.1"
                @update:model-value="
                  (value: string) => {
                    if (nodeSpatial.positions) {
                      const center: number[] = nodeSpatial.positions.center;
                      center[idx] = parseFloat(value);
                      nodeSpatial.updatePositionParams({ center });
                    }
                  }
                "
                density="compact"
                hide-details
                type="number"
                variant="outlined"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col class="ma-auto" cols="3" title="">extent</v-col>
            <v-spacer />
            <v-col
              :key="idx"
              cols="3"
              v-for="(item, idx) of nodeSpatial.positions.extent"
            >
              <v-text-field
                :label="['x', 'y', 'z'][idx]"
                :min="0"
                :model-value="item"
                :step="0.1"
                @update:model-value="
                (value: string) => {
                  if (nodeSpatial.positions) {
                    const extent: number[] = nodeSpatial.positions.extent;
                    extent[idx] = parseFloat(value);
                    nodeSpatial.updatePositionParams({ extent });
                  }
                }
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
          <v-col class="py-0">
            <v-checkbox
              class="ma-0"
              color="accent"
              label="Edge wrap"
              v-model="nodeSpatial.positions.edgeWrap"
            />
          </v-col>
        </v-row>
        <v-btn @click="updatePositions()" size="small" variant="outlined">
          Update positions
        </v-btn>
        <!-- <v-spacer />
        <v-btn :title="state.nodeSpatial.positions.pos" icon>
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
import { NESTNodeSpatial } from "../../helpers/node/nodeSpatial/nodeSpatial";
import { IParamProps } from "@/helpers/common/parameter";

const props = defineProps<{ nodeSpatial: NESTNodeSpatial }>();
const nodeSpatial = computed(() => props.nodeSpatial);

const state = reactive<{
  numDimensions: boolean;
  positions: { title: string; value: string }[];
  selectedPositions: string;
  sizeOptions: IParamProps;
}>({
  numDimensions: false,
  positions: [
    { title: "Free positions", value: "free" },
    { title: "Grid positions", value: "grid" },
  ],
  selectedPositions: "free",
  sizeOptions: {
    component: "valueSlider",
    id: "size",
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
    nodeSpatial.value.init({
      positions: state.selectedPositions,
    });
  });
};

const updatePositions = () => {
  // node.value.spatial.positions?.generate();
  nodeSpatial.value.changes();
};

onMounted(() => {
  state.selectedPositions = nodeSpatial.value.positions?.name || "free";
});
</script>
