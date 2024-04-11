<template>
  <v-container class="fill-height">
    <v-responsive class="align-center">
      <v-card
        class="ma-auto my-1"
        max-width="400"
      >
        <v-card
          flat
          title="App settings"
        >
          <v-card
            flat
            subtitle="Theme"
          >
            <v-card-text>
              <v-radio-group
                v-model="appStore.state.theme"
                hint="Customize the app with light and dark themes."
                persistent-hint
                @update:model-value="updateTheme"
              >
                <v-radio
                  v-for="(theme, idx) in themes"
                  :key="idx"
                  :value="theme.value"
                  true-icon="mdi:mdi-checkbox-marked-circle-outline"
                >
                  <template #label>
                    <v-icon
                      :icon="theme.icon"
                      class="mx-2"
                    />
                    {{ capitalize(theme.title) }}
                  </template>
                </v-radio>
              </v-radio-group>
            </v-card-text>
          </v-card>

          <v-card
            flat
            subtitle="General"
          >
            <v-card-text>
              <v-switch
                v-model="appStore.session.state.devMode"
                density="compact"
                false-icon="mdi:mdi-close-circle"
                hint="Developer mode enables features that are still in development."
                label="Developer mode"
                persistent-hint
                true-icon="mdi:mdi-checkbox-marked-circle"
              >
                <template #label="{ label }">
                  <div class="ma-2">
                    {{ label }}
                  </div>
                </template>
              </v-switch>
            </v-card-text>
          </v-card>

          <v-card
            flat
            subtitle="Simulators"
          >
            <v-card-text>
              <v-select
                v-model="appStore.state.simulatorVisible"
                :items="simulatorItems"
                chips
                label="Visible simulators"
                multiple
                item-value="id"
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
  { icon: "mdi:mdi-white-balance-sunny", title: "light", value: "light" },
  { icon: "mdi:mdi-weather-night", title: "dark", value: "dark" },
  { icon: "mdi:mdi-desktop-tower-monitor", title: "system", value: "auto" },
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
