<template>
  <v-container>
    <v-card class="my-1">
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
        <v-slider color="blue" label="Blue" thumb-label />
        <v-slider color="orange" label="Orange" thumb-label />

        <v-slider
          v-model="state.slider.value"
          class="align-center"
          :max="state.slider.max"
          :min="state.slider.min"
          hide-details
          thumb-label
        >
          <template v-slot:append>
            <v-text-field
              v-model="state.slider.value"
              hide-details
              single-line
              density="compact"
              type="number"
              style="width: 80px"
            />
          </template>
        </v-slider>

        <v-range-slider
          v-model="state.rangeSlider.range"
          :max="10"
          :min="-10"
          :step="1"
          hide-details
          class="align-center"
        >
          <template v-slot:prepend>
            <v-text-field
              :model-value="state.rangeSlider.range[0]"
              hide-details
              single-line
              type="number"
              variant="outlined"
              density="compact"
              style="width: 70px"
              @change="$set(state.rangeSlider.range, 0, $event)"
            ></v-text-field>
          </template>
          <template v-slot:append>
            <v-text-field
              :model-value="state.rangeSlider.range[1]"
              hide-details
              single-line
              type="number"
              variant="outlined"
              style="width: 70px"
              density="compact"
              @change="$set(state.rangeSlider.range, 1, $event)"
            ></v-text-field>
          </template>
        </v-range-slider>
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
        <v-color-picker
          :hide-canvas="state.colorPicker.hideCanvas"
          :hide-inputs="state.colorPicker.hideInputs"
          :hide-sliders="state.colorPicker.hideSliders"
          :show-swatches="state.colorPicker.showSwatches"
          :swatches="swatches"
          elevation="0"
        />
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
import { reactive } from "vue";

const buttons = [
  { text: "flat", variant: "flat" },
  { text: "text", variant: "text" },
  { text: "outlined", variant: "outlined" },
  { text: "plain", variant: "plain" },
  { text: "evelated", variant: "evelated" },
  { text: "tonal", variant: "tonal" },
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
  },
});

const swatches = [
  ["#1f77b4", "#ff7f0e", "#ffffff"],
  ["#2ca02c", "#d62728", "#f00"],
  ["#9467bd", "#8c564b"],
  ["#e377c2", "#7f7f7f"],
  ["#bcbd22", "#17becf"],
];
</script>
