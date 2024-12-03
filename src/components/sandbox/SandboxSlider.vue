<template>
  <v-card class="playground-slider">
    <v-card-title>
      <v-row no-gutters>
        Slider
        <v-spacer />
        <v-tabs
          v-model="state.tab"
          density="compact"
        >
          <v-tab value="components">
            Components
          </v-tab>
          <v-tab value="values">
            Values
          </v-tab>
        </v-tabs>
      </v-row>
    </v-card-title>

    <v-card-text>
      <v-window v-model="state.tab">
        <v-window-item
          reverse-transition="no-transition"
          transition="no-transition"
          value="components"
        >
          <v-list>
            <v-list-item
              v-for="(sliderItem, index) in items"
              :key="index"
            >
              <v-row no-gutters>
                <Slider
                  v-model="sliderItem.value"
                  :options="sliderItem"
                  :thumb-color="sliderItem.color"
                />
                <div style="width: 100px">
                  {{ typeof sliderItem.value }}
                  {{ sliderItem.value }}
                </div>
              </v-row>
            </v-list-item>
          </v-list>
        </v-window-item>

        <v-window-item
          reverse-transition="no-transition"
          transition="no-transition"
          value="values"
        >
          <pre>{{ items }}</pre>
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { reactive } from "vue";

import Slider from "../controls/Slider.vue";

const state = reactive<{
  tab: string;
}>({
  tab: "components",
});

const items = [
  { label: "default slider", value: 10 },
  {
    color: "blue",
    label: "custom slider",
    max: 10,
    min: -10,
    step: 0.1,
    unit: "ms",
    value: 0,
  },
  {
    component: "tickSlider",
    color: "orange",
    label: "default ticks",
    ticks: [1, 2, 3, 4],
    value: 2,
  },
  {
    component: "tickSlider",
    color: "green",
    label: "non-linear ticks",
    ticks: [1, 10, 100],
    unit: "ms",
    value: 10,
  },
  {
    component: "tickSlider",
    color: "red",
    label: "string ticks",
    ticks: ["bad", "okay", "superb"],
    value: "okay",
  },
  {
    component: "rangeSlider",
    color: "purple",
    inputLabel: ["id5l", "id5u"],
    label: "default rangeSlider",
    value: [20, 50],
  },
  {
    component: "rangeSlider",
    color: "brown",
    inputLabel: ["id6l", "id6u"],
    label: "custom rangeSlider",
    max: 10,
    min: -10,
    step: 0.1,
    unit: "ms",
    value: [-5, 5],
  },
];
</script>

<!-- <style lang="scss">
.playground-slider {
  .v-list {
    overflow: visible;
  }

  .v-list-item:nth-child(odd) {
    background-color: rgba(var(--v-theme-primary), 0.05);
  }

  v-list-item__content {
    overflow: visible;
  }
}
</style> -->
