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
                  <v-card-title class="py-0">
                    <v-select
                      :items="nodeModels"
                      hide-details
                      density="compact"
                      v-model="node.model"
                      variant="underlined"
                    >
                      <template #prepend>
                        <v-btn :color="node.color" variant="text" size="small">
                          n1
                        </v-btn>
                      </template>

                      <template #append>
                        <v-btn
                          icon="mdi-order-bool-ascending-variant"
                          size="x-small"
                          @click="node.edit = !node.edit"
                          variant="text"
                        />
                        <v-menu
                          :close-on-content-click="false"
                          density="compact"
                        >
                          <template #activator="{ props }">
                            <v-btn
                              icon="mdi-dots-vertical"
                              size="x-small"
                              v-bind="props"
                              variant="text"
                            />
                          </template>

                          <v-card>
                            <list :items="menuItems" />
                          </v-card>
                        </v-menu>
                      </template>
                    </v-select>
                  </v-card-title>

                  <v-card-text class="pa-0">
                    <v-list>
                      <v-list-item>
                        <slider
                          :color="node.color"
                          :options="{ id: 'n', label: 'Population' }"
                          v-model="node.size"
                        />
                      </v-list-item>
                      <template
                        :key="index"
                        v-for="(param, index) in node.params"
                      >
                        <v-list-item
                          v-if="
                            node.edit || node.paramsVisible.includes(param.id)
                          "
                        >
                        <v-checkbox
                            v-if="node.edit"
                            hide-details
                            density="compact"
                            v-model="node.paramsVisible"
                            :value="param.id"
                            :label="param.label"
                          >
                            <template #append>
                              {{ param.value }} {{ param.unit }}
                            </template>
                          </v-checkbox>
                          <slider
                            :color="node.color"
                            :options="param"
                            v-model="param.value"
                            v-else-if="node.paramsVisible.includes(param.id)"
                          />

                        </v-list-item>
                      </template>
                    </v-list>
                  </v-card-text>
                  <v-card-actions v-if="node.edit">
                    <v-spacer />
                    <v-btn @click="node.edit=false">save</v-btn>
                  </v-card-actions>
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
          <v-card-title>Buttons</v-card-title>
          <v-card-text>
            <v-row
              class="my-3"
              :key="index"
              v-for="(buttonGrp, index) in buttons"
            >
              <v-btn
                :key="index"
                :text="button.text"
                :variant="button.variant"
                :size="button.size"
                :color="button.color || state.buttons.color"
                @click.stop="state.buttons.color = button.color"
                v-for="(button, index) in buttonGrp"
                class="mx-1"
              />
            </v-row>
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

const nodeModels = [
  { value: "dc_generator", title: "DC generator" },
  { value: "ac_generator", title: "AC generator" },
  { value: "gauss_generator", title: "Noise generator" },
  { value: "poisson_generator", title: "Poisson generator" },
];

const buttons = [
  [
    { text: "blue", color: "blue", size: "x-small" },
    { text: "orange", color: "orange", size: "x-small" },
    { text: "green", color: "green", size: "x-small" },
    { text: "red", color: "red", size: "x-small" },
    { text: "purple", color: "purple", size: "x-small" },
    { text: "brown", color: "brown", size: "x-small" },
    { text: "rosa", color: "rosa", size: "x-small" },
    { text: "grey", color: "grey", size: "x-small" },
    { text: "yellow", color: "yellow", size: "x-small" },
    { text: "cyan", color: "cyan", size: "x-small" },
  ],
  [
    { text: "blue", color: "blue-lighten-1", size: "x-small" },
    { text: "orange", color: "orange-lighten-1", size: "x-small" },
    { text: "green", color: "green-lighten-1", size: "x-small" },
    { text: "red", color: "red-lighten-1", size: "x-small" },
    { text: "purple", color: "purple-lighten-1", size: "x-small" },
    { text: "brown", color: "brown-lighten-1", size: "x-small" },
    { text: "rosa", color: "rosa-lighten-1", size: "x-small" },
    { text: "grey", color: "grey-lighten-1", size: "x-small" },
    { text: "yellow", color: "yellow-lighten-1", size: "x-small" },
    { text: "cyan", color: "cyan-lighten-1", size: "x-small" },
  ],
  [
    { text: "elevated", variant: "elevated" },
    { text: "flat", variant: "flat" },
    { text: "text", variant: "text" },
    { text: "outlined", variant: "outlined" },
    { text: "plain", variant: "plain" },
    { text: "tonal", variant: "tonal" },
  ],
  [
    { text: "x-small", size: "x-small" },
    { text: "small", size: "small" },
    { text: "large", size: "large" },
    { text: "x-large", size: "x-large" },
  ],
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
    value: "parameter",
    title: "parameter",
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
  buttons: {
    color: null,
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
        edit: false,
        paramsVisible: ["amplitude"],
        params: [
          {
            id: "amplitude",
            label: "amplitude",
            value: 10,
            unit: "pA",
          },
          { id: "start", label: "start (ms)", value: 0 },
          { id: "stop", label: "stop (ms)", value: 10 },
        ],
      },
      {
        model: "iaf_psc_alpha",
        color: "#FF7F0E",
        size: 10,
        edit: false,
        paramsVisible: ["V_m"],
        params: [
          {
            id: "V_m",
            label: "initial membrane potentials",
            value: -70,
            min: -100,
            max: 0,
            unit: "mV",
          },
          {
            id: "V_th",
            label: "spike threshold",
            value: -55,
            min: -100,
            max: 0,
            unit: "mV",
          },
          {
            id: "E_L",
            label: "reversal potentials",
            value: -70,
            min: -100,
            max: 0,
            unit: "mV",
          },
        ],
      },
    ],
  },
  slider: {
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
        value: [-5, 5],
        variant: "range",
      },
    ],
  },
});
</script>

<style lang="scss">
.playground {
  .v-list {
    overflow: visible;
  }

  .v-list-item:nth-child(odd) {
    background-color: rgba(var(--v-theme-primary), 0.2);
  }

  v-list-item__content {
    overflow: visible;
  }
}
</style>
