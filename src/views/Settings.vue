<template>
  <v-container class="fill-height">
    <v-responsive class="align-center">
      <v-card class="ma-auto my-1" max-width="400">
        <v-card flat title="App settings">
          <v-checkbox
            hide-details
            label="Dark mode"
            v-model="appStore.darkMode"
            @update:model-value="() => appStore.setDarkMode(theme)"
          />
          <v-checkbox
            hide-details
            label="Dev mode"
            v-model="appStore.session.devMode"
          />
        </v-card>

        <v-card flat title="Simulator settings">
          <v-select
            :items="simulatorNames"
            label="Visible simulators"
            rounded="0"
            multiple
            v-model="appStore.simulatorVisible"
          />
        </v-card>

        <!-- <v-card-footer>
          <div class="ma-1">
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

import { useTheme } from "vuetify";
const theme = useTheme();

import { useAppStore } from "@/store/appStore";
const appStore = useAppStore();
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
