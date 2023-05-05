<template>
  <v-container>
    <v-card class="my-1" color="primary">
      <v-card-title>Buttons</v-card-title>
      <v-card-text>
        <v-btn
          :key="index"
          :text="button.text"
          :variant="button.variant"
          v-for="(button, index) in buttons"
          class="mx-1"
        />
      </v-card-text>
    </v-card>

    <v-card class="my-1">
      <v-card-title>Slider</v-card-title>
      <v-card-text>
        <slider
          :step="1"
          :value="2"
          :max="10"
          hide-details
          label="membrane capacitance"
          show-ticks="always"
        />
        <slider
          :max="2"
          :min="-2"
          :step="0.1"
          :value="0.5"
          color="blue"
          hide-details
          label="blue"
          show-ticks="always"
          thumb-label
        />
        <slider
          :max="4"
          :ticks="[0, 1, 2, 3, 4]"
          :step="1"
          :value="3"
          color="orange"
          hide-details
          label="ticks"
          show-ticks="always"
        />
        <range-slider
          :max="10"
          :min="-10"
          :step="1"
          :value="[-5, 5]"
          hide-details
          label="Range"
        />
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title>Item groups</v-card-title>
      <v-card-text>
        <v-item-group mandatory>
          <v-container>
            <v-row>
              <v-col v-for="n in 6" :key="n" cols="12" md="2">
                <v-item v-slot="{ isSelected, toggle }">
                  <v-card
                    :color="isSelected ? 'primary' : ''"
                    class="d-flex align-center"
                    dark
                    height="50"
                    @click="toggle"
                  >
                    <v-scroll-y-transition>
                      <div class="text-h5 flex-grow-1 text-center">
                        {{ isSelected ? "Selected" : "Click Me!" }}
                      </div>
                    </v-scroll-y-transition>
                  </v-card>
                </v-item>
              </v-col>
            </v-row>
          </v-container>
        </v-item-group>

        <v-item-group multiple>
          <v-container>
            <v-row>
              <v-col v-for="n in 6" :key="n" cols="12" md="2">
                <v-item v-slot="{ isSelected, toggle }">
                  <v-card
                    :color="isSelected ? 'primary' : ''"
                    class="d-flex align-center"
                    dark
                    height="50"
                    @click="toggle"
                  >
                    <v-scroll-y-transition>
                      <div class="text-h5 flex-grow-1 text-center">
                        {{ isSelected ? "Selected" : "Click Me!" }}
                      </div>
                    </v-scroll-y-transition>
                  </v-card>
                </v-item>
              </v-col>
            </v-row>
          </v-container>
        </v-item-group>
      </v-card-text>
    </v-card>

    <v-card class="my-1">
      <v-card-title>Color picker</v-card-title>
      <v-card-text>
        <v-row no-gutters="">
          <v-col cols="12" md="2">
            <v-select
              :items="colorSchemes"
              item-title="text"
              item-value="colors"
              label="Select a scheme"
              persistent-hint
              return-object
              density="compact"
              variant="outlined"
              v-model="state.colorPicker.colorScheme"
              @update:model-value="updateSwatches"
            >
            </v-select>
          </v-col>
          <v-col cols="12" md="10">
            <v-color-picker
              :hide-canvas="state.colorPicker.hideCanvas"
              :hide-inputs="state.colorPicker.hideInputs"
              :hide-sliders="state.colorPicker.hideSliders"
              :show-swatches="state.colorPicker.showSwatches"
              :swatches="state.colorPicker.swatches"
              disabled
              elevation="0"
              width="100%"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-card>
      <v-card-title> Button toggle </v-card-title>
      <v-card-text>
        <v-btn-toggle v-model="state.buttonToggle.value" divided>
          <v-btn icon="mdi-format-align-left"></v-btn>
          <v-btn icon="mdi-format-align-center"></v-btn>
          <v-btn icon="mdi-format-align-right"></v-btn>
          <v-btn icon="mdi-format-align-justify"></v-btn>
        </v-btn-toggle>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import { reactive } from "vue";

import RangeSlider from "@/components/common/RangeSlider.vue";
import Slider from "@/components/common/Slider.vue";

const buttons = [
  { text: "flat", variant: "flat" },
  { text: "text", variant: "text" },
  { text: "outlined", variant: "outlined" },
  { text: "plain", variant: "plain" },
  { text: "evelated", variant: "evelated" },
  { text: "tonal", variant: "tonal" },
];

const colorSchemes = [
  {
    text: "category 10",
    value: "category10",
    colors: [
      ["#1f77b4"],
      ["#ff7f0e"],
      ["#2ca02c"],
      ["#d62728"],
      ["#9467bd"],
      ["#8c564b"],
      ["#e377c2"],
      ["#7f7f7f"],
      ["#bcbd22"],
      ["#17becf"],
    ],
  },
  {
    text: "category 20",
    value: "category20",
    colors: [
      ["#1f77b4"],
      ["#aec7e8"],
      ["#ff7f0e"],
      ["#ffbb78"],
      ["#2ca02c"],
      ["#98df8a"],
      ["#d62728"],
      ["#ff9896"],
      ["#9467bd"],
      ["#c5b0d5"],
      ["#8c564b"],
      ["#c49c94"],
      ["#e377c2"],
      ["#f7b6d2"],
      ["#7f7f7f"],
      ["#c7c7c7"],
      ["#bcbd22"],
      ["#dbdb8d"],
      ["#17becf"],
      ["#9edae5"],
    ],
  },
  {
    text: "paired",
    value: "paired",
    colors: [
      ["#a6cee3"],
      ["#1f78b4"],
      ["#b2df8a"],
      ["#33a02c"],
      ["#fb9a99"],
      ["#e31a1c"],
      ["#fdbf6f"],
      ["#ff7f00"],
      ["#cab2d6"],
      ["#6a3d9a"],
      ["#ffff99"],
      ["#b15928"],
    ],
  },
  {
    text: "set1",
    value: "set1",
    colors: [
      ["#e41a1c"],
      ["#377eb8"],
      ["#4daf4a"],
      ["#984ea3"],
      ["#ff7f00"],
      ["#ffff33"],
      ["#a65628"],
      ["#f781bf"],
      ["#999999"],
    ],
  },
  {
    text: "set2",
    value: "set2",
    colors: [
      ["#66c2a5"],
      ["#fc8d62"],
      ["#8da0cb"],
      ["#e78ac3"],
      ["#a6d854"],
      ["#ffd92f"],
      ["#e5c494"],
      ["#b3b3b3"],
    ],
  },
  {
    text: "set3",
    value: "set3",
    colors: [
      ["#8dd3c7"],
      ["#ffffb3"],
      ["#bebada"],
      ["#fb8072"],
      ["#80b1d3"],
      ["#fdb462"],
      ["#b3de69"],
      ["#fccde5"],
      ["#d9d9d9"],
      ["#bc80bd"],
      ["#ccebc5"],
      ["#ffed6f"],
    ],
  },
  {
    text: "tableau10",
    value: "stableau10",
    colors: [
      ["#4e79a7"],
      ["#f28e2c"],
      ["#e15759"],
      ["#76b7b2"],
      ["#59a14f"],
      ["#edc949"],
      ["#af7aa1"],
      ["#ff9da7"],
      ["#9c755f"],
      ["#bab0ab"],
    ],
  },
  {
    text: "google 10c",
    value: "google10c",
    colors: [
      ["#3366cc"],
      ["#dc3912"],
      ["#ff9900"],
      ["#109618"],
      ["#990099"],
      ["#0099c6"],
      ["#dd4477"],
      ["#66aa00"],
      ["#b82e2e"],
      ["#316395"],
    ],
  },
  {
    text: "google 20c",
    value: "google20c",
    colors: [
      ["#3366cc"],
      ["#dc3912"],
      ["#ff9900"],
      ["#109618"],
      ["#990099"],
      ["#0099c6"],
      ["#dd4477"],
      ["#66aa00"],
      ["#b82e2e"],
      ["#316395"],
      ["#994499"],
      ["#22aa99"],
      ["#aaaa11"],
      ["#6633cc"],
      ["#e67300"],
      ["#8b0707"],
      ["#651067"],
      ["#329262"],
      ["#5574a6"],
      ["#3b3eac"],
    ],
  },
];

const state = reactive({
  buttonToggle: {
    value: null,
  },
  slider: {
    min: -50,
    max: 90,
    value: 40,
  },
  rangeSlider: {
    range: [-5, 5],
  },
  colorPicker: {
    hideSliders: true,
    hideCanvas: true,
    showSwatches: true,
    hideInputs: true,
    colorScheme: colorSchemes[0],
    swatches: [],
  },
});

const updateSwatches = (item: any = undefined) => {
  state.colorPicker.swatches = item
    ? item.colors
    : state.colorPicker.colorScheme.colors;
};

const decrement = () => {
  state.slider.value--;
};

const increment = () => {
  state.slider.value++;
};

onMounted(() => {
  updateSwatches();
});
</script>
