<template>
  <v-menu v-model="state.menuOpen" :close-on-content-click="false" :width="400" activator="parent">
    <v-card v-if="nodeSpatial.positions" :min-width="300">
      <v-card-text>
        <v-select
          v-model="state.selectedPositions"
          :items="state.positions"
          density="compact"
          hide-details
          @update:model-value="initPositions()"
        />

        <v-switch
          v-model="state.numDimensions"
          color="primary"
          false-icon="mdi:mdi-numeric-2"
          hide-details
          label="number of dimensions"
          max="3"
          min="2"
          show-ticks="always"
          step="1"
          true-icon="mdi:mdi-numeric-3"
          @update:model-value="
            (value: boolean | null) => nextTick(() => {
              nodeSpatial.updatePositionParams({ numDimensions: value ? 3 : 2 })
              nodeSpatial.changes()
            })
          "
        />

        <span v-if="nodeSpatial.positions.name === 'free'">
          <ValueSlider
            id="n"
            v-model="nodeSpatial.node.size"
            :thumb-color="nodeSpatial.node.view.color"
            input-label="n"
            label="population size"
            @update:model-value="nodeSpatial.changes()"
          />
        </span>

        <span v-if="nodeSpatial.positions.name === 'grid'">
          <v-row class="mt-0">
            <v-col class="ma-auto" cols="3">shape</v-col>
            <v-spacer />
            <v-col v-for="(item, idx) of nodeSpatial.positions.shape" :key="idx" cols="3">
              <v-text-field
                :label="(nodeSpatial.positions.numDimensions === 2 ? ['rows', 'columns'] : ['x', 'y', 'z'])[idx]"
                :min="1"
                :model-value="item"
                density="compact"
                hide-details
                type="number"
                @update:model-value="
                  (value: string) => {
                    if (nodeSpatial.positions) {
                      const shape: number[] = nodeSpatial.positions.shape;
                      shape[idx] = parseInt(value);
                      nodeSpatial.updatePositionParams({ shape });
                    }
                  }
                "
              />
            </v-col>
          </v-row>

          <v-row class="mt-0">
            <v-col class="ma-auto" cols="3">center</v-col>
            <v-spacer />
            <v-col v-for="(item, idx) of nodeSpatial.positions.center" :key="idx" cols="3">
              <v-text-field
                :label="['x', 'y', 'z'][idx]"
                :model-value="item"
                :step="0.1"
                density="compact"
                hide-details
                type="number"
                @update:model-value="
                  (value: string) => {
                    if (nodeSpatial.positions) {
                      const center: number[] = nodeSpatial.positions.center;
                      center[idx] = parseFloat(value);
                      nodeSpatial.updatePositionParams({ center });
                    }
                  }
                "
              />
            </v-col>
          </v-row>

          <v-row class="mt-0">
            <v-col class="ma-auto" cols="3" title="">extent</v-col>
            <v-spacer />
            <v-col v-for="(item, idx) of nodeSpatial.positions.extent" :key="idx" cols="3">
              <v-text-field
                :label="['x', 'y', 'z'][idx]"
                :min="0"
                :model-value="item"
                :step="0.1"
                density="compact"
                hide-details
                type="number"
                @update:model-value="
                  (value: string) => {
                    if (nodeSpatial.positions) {
                      const extent: number[] = nodeSpatial.positions.extent;
                      extent[idx] = parseFloat(value);
                      nodeSpatial.updatePositionParams({ extent });
                    }
                  }
                "
              />
            </v-col>
          </v-row>
        </span>

        <v-row class="mt-0">
          <v-col class="py-0">
            <v-checkbox
              v-model="nodeSpatial.positions.edgeWrap"
              class="ma-0"
              color="accent"
              label="Edge wrap"
              hide-details
            />
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn size="small" text="update positions" @click="updatePositions()" />
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, reactive } from "vue";

import ValueSlider from "@/components/controls/ValueSlider.vue";
import { NESTNodeSpatial } from "../../helpers/node/nodeSpatial/nodeSpatial";
import { IParamProps } from "@/helpers/common/parameter";

const props = defineProps<{ nodeSpatial: NESTNodeSpatial }>();
const nodeSpatial = computed(() => props.nodeSpatial);

const state = reactive<{
  menuOpen: boolean;
  numDimensions: boolean;
  positions: { title: string; value: string }[];
  selectedPositions: string;
  sizeOptions: IParamProps;
}>({
  menuOpen: false,
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
      ["value < 1000", "Large values generate many data points and can put quite a load on your browser.", "warning"],
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
  state.menuOpen = false;
  // node.value.spatial.positions?.generate();
  nodeSpatial.value.changes();
};

onMounted(() => {
  state.numDimensions = nodeSpatial.value.positions?.numDimensions === 3;
  state.selectedPositions = nodeSpatial.value.positions?.name || "free";
});
</script>
