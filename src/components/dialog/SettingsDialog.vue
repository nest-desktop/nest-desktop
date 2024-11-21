<template>
  <v-card flat title="Settings" width="400">
    <v-card flat subtitle="Theme">
      <v-card-text>
        <v-radio-group
          @update:model-value="updateTheme()"
          hint="Customize the app with light and dark themes."
          persistent-hint
          v-model="appStore.state.theme"
        >
          <v-radio
            :key="idx"
            :value="theme.value"
            true-icon="mdi:mdi-checkbox-marked-circle-outline"
            v-for="(theme, idx) in themes"
          >
            <template #label>
              <v-icon :icon="theme.icon" class="mx-2" />
              {{ capitalize(theme.title) }}
            </template>
          </v-radio>
        </v-radio-group>
      </v-card-text>
    </v-card>

    <v-card flat subtitle="General">
      <v-card-text>
        <v-switch
          density="compact"
          false-icon="mdi:mdi-close-circle"
          hint="Developer mode enables features that are still in development."
          label="Developer mode"
          persistent-hint
          true-icon="mdi:mdi-checkbox-marked-circle"
          v-model="appStore.state.devMode"
        >
          <template #label="{ label }">
            <div class="ma-2">
              {{ label }}
            </div>
          </template>
        </v-switch>
      </v-card-text>
    </v-card>

    <v-card flat subtitle="Simulators">
      <v-card-text>
        <v-select
          :items="simulatorItems"
          chips
          hide-details
          item-value="id"
          label="Visible simulators"
          multiple
          v-model="appStore.state.simulatorVisible"
        >
          <template #chip="{ item }">
            <v-chip
              :prepend-icon="item.value + ':logo'"
              color="grey"
              label
            >
              {{ item.title }}
            </v-chip>
          </template>
        </v-select>
      </v-card-text>
    </v-card>
    <AppFooter />

  </v-card>
</template>

<script lang="ts" setup>
import { capitalize, computed, nextTick } from "vue";

import { simulators } from "@/simulators";
import AppFooter from "../app/AppFooter.vue";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

// const appVersion = process.env.APP_VERSION;

const simulatorItems = computed(() => Object.values(simulators));

const themes = [
  { icon: "mdi:mdi-white-balance-sunny", title: "light", value: "light" },
  { icon: "mdi:mdi-weather-night", title: "dark", value: "dark" },
  { icon: "mdi:mdi-desktop-tower-monitor", title: "system", value: "auto" },
];

const updateTheme = () => nextTick(() => appStore.updateTheme());
</script>