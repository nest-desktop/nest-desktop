<template>
  <v-container class="fill-height">
    <v-responsive class="align-center">
      <v-card class="ma-auto my-1" max-width="400">
        <v-card flat title="App settings">
          <v-card flat subtitle="Theme">
            <v-card-text>
              <v-radio-group
                @update:modelValue="updateTheme"
                hint="Customize the app with light and dark themes."
                persistentHint
                v-model="appStore.state.theme"
              >
                <v-radio
                  :key="idx"
                  :value="theme.value"
                  trueIcon="mdi-checkbox-marked-circle-outline"
                  v-for="(theme, idx) in themes"
                >
                  <template #label>
                    <v-icon :icon="theme.icon" class="mr-2"></v-icon>
                    {{ capitalize(theme.title) }}
                  </template>
                </v-radio>
              </v-radio-group>
            </v-card-text>
          </v-card>

          <v-card flat subtitle="General">
            <v-card-text>
              <v-switch
                hint="Developer mode enables new features and functionality within the documentation that are still in development."
                inset
                label="Developer mode"
                falseIcon="mdi-close-circle"
                trueIcon="mdi-checkbox-marked-circle"
                persistentHint
                v-model="appStore.session.state.devMode"
              />
            </v-card-text>
          </v-card>

          <v-card flat subtitle="Simulators">
            <v-card-text>
              <v-select
                :items="simulatorNames"
                label="Visible simulators"
                rounded="0"
                multiple
                v-model="appStore.state.simulatorVisible"
              />
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
import AppFooter from "@/components/app/AppFooter.vue";
import { simulatorNames } from "@/simulators";

import { useAppStore } from "@/stores/appStore";
import { capitalize } from "vue";
const appStore = useAppStore();

const updateTheme = () => {
  setTimeout(() => appStore.updateTheme());
};

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
