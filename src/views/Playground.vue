<template>
  <v-container>
    <v-row no-gutters>
      <v-col class="pa-1" cols="12" md="6">
        <v-card>
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
      </v-col>

      <v-col class="pa-1" cols="12" md="6">
        <v-card>
          <v-card-title>Slider</v-card-title>
          <v-card-text>
            <slider
              :step="1"
              :value="2"
              :max="10"
              hide-details
              color="blue"
              label="membrane capacitance"
              show-ticks="always"
              class="bg-primary"
            />
            <slider
              :max="2"
              :min="-2"
              :step="0.1"
              :value="0.5"
              color="blue"
              hide-details
              label="blue"
              class="bg-secondary"
            />
            <slider
              :max="4"
              :ticks="[0, 1, 2, 3, 4]"
              :value="3"
              color="orange"
              hide-details
              label="ticks"
              show-ticks="always"
              class="bg-primary"
            />
            <tick-slider
              :ticks="[1, 2, 3, 4]"
              :value="3"
              color="green"
              hide-details
              label="ticks"
              class="bg-secondary"
            />
            <tick-slider
              :ticks="[1, 10, 100]"
              :value="3"
              color="green"
              hide-details
              label="ticks"
              class="bg-primary"
            />
            <range-slider
              :max="10"
              :min="-10"
              :step="1"
              :value="[-5, 5]"
              hide-details
              label="range"
              class="bg-secondary"
            />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col class="pa-1" cols="12" md="6">
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
                          <div class="flex-grow-1 text-center">
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
                          <div class="flex-grow-1 text-center">
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
      </v-col>

      <v-col class="pa-1" cols="12" md="6">
        <v-card>
          <v-card-title>Color picker</v-card-title>
          <v-card-text>
            <v-select
              :items="colorSchemes"
              label="Select a color scheme"
              persistent-hint
              density="compact"
              variant="outlined"
              v-model="state.colorScheme"
            />
            <color-picker :colorScheme="state.colorScheme" />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col class="pa-1" cols="12" md="6">
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
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { reactive } from "vue";

import TickSlider from "@/components/common/TickSlider.vue";
import RangeSlider from "@/components/common/RangeSlider.vue";
import Slider from "@/components/common/Slider.vue";
import ColorPicker from "@/components/common/ColorPicker.vue";

const buttons = [
  { text: "flat", variant: "flat" },
  { text: "text", variant: "text" },
  { text: "outlined", variant: "outlined" },
  { text: "plain", variant: "plain" },
  { text: "evelated", variant: "evelated" },
  { text: "tonal", variant: "tonal" },
];

const colorSchemes = [
  { value: "default", title: "default" },
  { value: "category10", title: "category 10" },
  { value: "category20", title: "category 20" },
  { value: "paired", title: "paired" },
  { value: "set1", title: "set 1" },
  { value: "set2", title: "set 2" },
  { value: "set3", title: "set 3" },
  { value: "tableau10", title: "tableau 10" },
  { value: "google10c", title: "google 10c" },
  { value: "google20c", title: "google 20c" },
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
  colorScheme: "category10",
});
</script>
