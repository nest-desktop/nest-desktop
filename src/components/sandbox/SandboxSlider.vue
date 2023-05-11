<template>
  <v-card class="playground-slider">
    <v-card-title>
      <v-row no-gutters>
        Slider
        <v-spacer />
        <v-tabs density="compact" v-model="state.tab">
          <v-tab value="components">Components</v-tab>
          <v-tab value="values">Values</v-tab>
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
              :key="index"
              v-for="(sliderItem, index) in state.items"
            >
              <v-row>
                <v-col cols="10">
                  <slider
                    :color="sliderItem.color"
                    :options="sliderItem"
                    v-model="sliderItem.value"
                  />
                </v-col>
                <v-col cols="2">
                  {{ typeof sliderItem.value }}
                  {{ sliderItem.value }}
                </v-col>
              </v-row>
            </v-list-item>
          </v-list>
        </v-window-item>
        <v-window-item
          reverse-transition="no-transition"
          transition="no-transition"
          value="values"
        >
          <pre>{{ state.items }}</pre>
        </v-window-item>
      </v-window>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { reactive } from "vue";

import Slider from "@/components/common/Slider.vue";

const state = reactive({
  tab: "components",
  items: [
    { id: "id1", label: "default slider", value: 10 },
    {
      id: "id2",
      color: "blue",
      label: "custom slider",
      max: 10,
      min: -10,
      step: 0.1,
      unit: "ms",
      value: 0,
    },
    {
      id: "id3",
      color: "orange",
      label: "default ticks",
      ticks: [1, 2, 3, 4],
      value: 2,
      variant: "ticks",
    },
    {
      id: "id4",
      color: "green",
      label: "non-linear ticks",
      ticks: [1, 10, 100],
      unit: "ms",
      value: 10,
      variant: "ticks",
    },
    {
      id: "id4",
      color: "red",
      label: "string ticks",
      ticks: ["bad", "okay", "superb"],
      value: "okay",
      variant: "ticks",
    },
    {
      id: ["id5l", "id5u"],
      color: "purple",
      label: "default rangeslider",
      value: [20, 50],
      variant: "range",
    },
    {
      id: ["id6l", "id6u"],
      color: "brown",
      label: "custom rangeslider",
      max: 10,
      min: -10,
      step: 0.1,
      unit: "ms",
      value: [-5, 5],
      variant: "range",
    },
  ],
});
</script>

<style lang="scss">
.playground-slider {
  .v-list {
    overflow: visible;
  }

  .v-list-item:nth-child(odd) {
    background-color: rgba(var(--v-theme-primary), 0.1);
  }

  v-list-item__content {
    overflow: visible;
  }
}
</style>
