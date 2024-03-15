<template>
  <v-container class="fill-height">
    <v-responsive class="align-center">
      <v-card class="ma-auto my-1" max-width="400">
        <v-card flat title="App settings">
          <v-card flat subtitle="Theme">
            <v-card-text>
              <v-radio-group
                @update:model-value="updateTheme"
                hint="Customize the app with light and dark themes."
                persistent-hint
                v-model="appStore.state.theme"
              >
                <v-radio
                  :key="idx"
                  :value="theme.value"
                  true-icon="mdi-checkbox-marked-circle-outline"
                  v-for="(theme, idx) in themes"
                >
                  <template #label>
                    <v-icon :icon="theme.icon" class="mx-2"></v-icon>
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
                false-icon="mdi-close-circle"
                hint="Developer mode enables features that are still in development."
                label="Developer mode"
                persistent-hint
                true-icon="mdi-checkbox-marked-circle"
                v-model="appStore.session.state.devMode"
              >
                <template #label="{ label }">
                  <div class="ma-2">{{ label }}</div>
                </template>
              </v-switch>
            </v-card-text>
          </v-card>

          <v-card flat subtitle="Simulators">
            <v-card-text>
              <v-select
                :items="simulatorItems"
                chips
                label="Visible simulators"
                multiple
                item-value="id"
                v-model="appStore.state.simulatorVisible"
                variant="outlined"
              >
                <template #chip="{ item }">
                  <v-chip
                    :prepend-icon="item.value + ':logo'"
                    color="grey"
                    label
                    variant="outlined"
                  >
                    {{ item.title }}
                  </v-chip>
                </template>
              </v-select>
            </v-card-text>
          </v-card>
        </v-card>

        <!-- <v-card-footer>
          <div class="ma-2">
            <v-btn size="small" variant="text">reset</v-btn>
          </div>
        </v-card-footer> -->
      </v-card>
    </v-responsive>
  </v-container>

  <app-footer />
</template>

<script lang="ts" setup>
import { capitalize, computed, nextTick } from "vue";

import AppFooter from "@/components/app/AppFooter.vue";
import { simulators } from "@/simulators";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

const updateTheme = () => {
  nextTick(() => appStore.updateTheme());
};

const simulatorItems = computed(() => Object.values(simulators));

const themes = [
  { icon: "mdi-white-balance-sunny", title: "light", value: "light" },
  { icon: "mdi-weather-night", title: "dark", value: "dark" },
  { icon: "mdi-desktop-tower-monitor", title: "system", value: "auto" },
];
</script>

<!-- <style lang="scss">
.logo {
  overflow: hidden;

  .v-img {
    transition: all 0.5s ease-in-out;
    transform: scale(1);
  }
}

.logo:hover .v-img {
  transition: all 0.5s ease-in-out;
  transform: scale(1.2);
}
</style> -->
