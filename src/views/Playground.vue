<template>
  <v-container class="playground">
    <v-row no-gutters>
      <v-col class="pa-1" cols="12" md="6">
        <v-card>
          <v-card-title>
            <v-row no-gutters>
              Card
              <v-spacer />
              <v-tabs density="compact" v-model="state.card.tab">
                <v-tab value="components">Components</v-tab>
                <v-tab value="values">Values</v-tab>
              </v-tabs>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-window v-model="state.card.tab">
              <v-window-item
                reverse-transition="no-transition"
                transition="no-transition"
                value="components"
              >
                <card
                  class="my-1"
                  :color="node.color"
                  :key="index"
                  v-for="(node, index) in state.card.nodes"
                >
                  <v-card-title class="pa-0">
                    <v-row no-gutters>
                      <v-col cols="2">
                        <btn :color="node.color"> n1 </btn>
                      </v-col>
                      <v-col cols="10">
                        <v-menu
                          :close-on-content-click="false"
                          density="compact"
                        >
                          <template #activator="{ props }">
                            <btn :color="node.color" v-bind="props">
                              {{ node.model }}
                            </btn>
                          </template>

                          <v-card>
                            <list :items="menuItems" />
                          </v-card>
                        </v-menu>
                      </v-col>
                    </v-row>
                  </v-card-title>

                  <v-card-text class="pa-0">
                    <v-list>
                      <v-list-item>
                        <value-slider
                          :color="node.color"
                          label="Population"
                          v-model="node.size"
                        />
                      </v-list-item>
                      <v-list-item
                        :key="index"
                        v-for="(param, index) in node.params"
                      >
                        <slider
                          :color="node.color"
                          :options="param"
                          v-model="param.value"
                        />
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </card>
              </v-window-item>
              <v-window-item
                reverse-transition="no-transition"
                transition="no-transition"
                value="values"
              >
                <pre>{{ state.card.nodes }}</pre>
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col class="pa-1" cols="12" md="6">
        <v-card>
          <v-card-title>
            <v-row no-gutters>
              Slider
              <v-spacer />
              <v-tabs density="compact" v-model="state.slider.tab">
                <v-tab value="components">Components</v-tab>
                <v-tab value="values">Values</v-tab>
              </v-tabs>
            </v-row>
          </v-card-title>
          <v-card-text>
            <v-window v-model="state.slider.tab">
              <v-window-item
                reverse-transition="no-transition"
                transition="no-transition"
                value="components"
              >
                <v-list>
                  <v-list-item
                    :key="index"
                    v-for="(sliderItem, index) in state.slider.items"
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
                <pre>{{ state.slider.items }}</pre>
              </v-window-item>
            </v-window>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col class="pa-1" cols="12" md="6">
        <v-card>
          <v-card-title> Alerts </v-card-title>
          <v-card-text>
            <v-alert
              class="my-1"
              color="success"
              icon="$success"
              variant="flat"
            >
              The simulation was sucessfully finished.
            </v-alert>
            <v-alert class="my-1" color="info" icon="$info" variant="outlined">
              The updates are available.
            </v-alert>
            <v-alert
              class="my-1"
              color="warning"
              icon="$warning"
              variant="text"
            >
              The simulation might impact the performance.
            </v-alert>
            <v-alert class="my-1" color="error" icon="$error" variant="tonal">
              The backend was not found.
            </v-alert>
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
                        <div class="flex-grow-1 text-center">
                          {{ isSelected ? "Selected" : "Click Me!" }}
                        </div>
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
                        <div class="flex-grow-1 text-center">
                          {{ isSelected ? "Selected" : "Click Me!" }}
                        </div>
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
          <v-card-title> Tabs </v-card-title>
          <v-card-text>
            <v-card variant="text">
              <v-tabs v-model="state.tab" grow>
                <v-tab value="one">Item One</v-tab>
                <v-tab value="two">Item Two</v-tab>
                <v-tab value="three">Item Three</v-tab>
              </v-tabs>

              <v-card-text>
                <v-window v-model="state.tab">
                  <v-window-item
                    reverse-transition="no-transition"
                    transition="no-transition"
                    value="one"
                  >
                    One
                  </v-window-item>
                  <v-window-item
                    reverse-transition="no-transition"
                    transition="no-transition"
                    value="two"
                  >
                    Two
                  </v-window-item>
                  <v-window-item
                    reverse-transition="no-transition"
                    transition="no-transition"
                    value="three"
                  >
                    Three
                  </v-window-item>
                </v-window>
              </v-card-text>
            </v-card>
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
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { reactive } from "vue";

import Btn from "@/components/common/Btn.vue";
import Card from "@/components/common/Card.vue";
import ColorPicker from "@/components/common/ColorPicker.vue";
import List from "@/components/common/List.vue";
import Slider from "@/components/common/Slider.vue";
import ValueSlider from "@/components/common/ValueSlider.vue";

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

const admins = [
  {
    title: "Management",
    icon: "mdi-account-multiple-outline",
    value: "management",
  },
  { title: "Settings", icon: "mdi-cog-outline", value: "settings" },
];

const cruds = [
  { title: "Create", icon: "mdi-plus-outline", value: "create" },
  { title: "Read", icon: "mdi-file-outline", value: "read" },
  { title: "Update", icon: "mdi-update", value: "update" },
  { title: "Delete", icon: "mdi-delete", value: "delete" },
];

const clickMe = [
  { value: "1", title: "Click Me", icon: "mdi-numeric-1" },
  { value: "2", title: "Click Me", icon: "mdi-numeric-2" },
  { value: "3", title: "Click Me", icon: "mdi-numeric-3" },
  { value: "4", title: "Click Me", icon: "mdi-numeric-4" },
];

const menuItems = [
  {
    value: "admin",
    title: "admin",
    icon: "mdi-account-circle",
    items: admins,
  },
  {
    value: "actions",
    title: "actions",
    icon: "mdi-database-cog-outline",
    items: cruds,
  },
  {
    value: "clickMe",
    title: "clickMe",
    icon: "mdi-information",
    items: clickMe,
  },
];

const state = reactive({
  buttonToggle: {
    value: null,
  },
  colorScheme: "category10",
  listOpen: [],
  tab: null,
  card: {
    tab: "components",
    nodes: [
      {
        model: "dc_generator",
        color: "#1F77B4",
        size: 1,
        params: [{ label: "amplitude", value: 10 }],
      },
      {
        model: "iaf_psc_alpha",
        color: "#FF7F0E",
        size: 10,
        params: [
          {
            label: "initial membrane potentials",
            value: -70,
            min: -100,
            max: 0,
          },
          { label: "spike threshold", value: -55, min: -100, max: 0 },
          { label: "reversal potentials", value: -70, min: -100, max: 0 },
        ],
      },
    ],
  },
  slider: {
    tab: "components",
    items: [
      { label: "default slider", value: 10, variant: "value" },
      {
        color: "blue",
        label: "custom slider",
        max: 10,
        min: -10,
        step: 0.1,
        value: 0,
        variant: "value",
      },
      {
        label: "default tickslider",
        ticks: [1, 2, 3, 4],
        value: 2,
        variant: "ticks",
      },
      {
        color: "green",
        label: "custom tickslider",
        ticks: [1, 10, 100],
        value: 10,
        variant: "ticks",
      },
      { label: "default rangeslider", value: [20, 50], variant: "range" },
      {
        color: "orange",
        label: "custom rangeslider",
        max: 10,
        min: -10,
        step: 0.1,
        value: [-5, 5],
        variant: "range",
      },
    ],
  },
});
</script>

<style>
.playground .v-list {
  overflow: visible;
}

.playground .v-list-item:nth-child(even) {
  background: #eee;
}

.playground .v-list-item:nth-child(odd) {
  background: #fff;
}

.playground .v-list-item__content {
  overflow: visible;
}
</style>
