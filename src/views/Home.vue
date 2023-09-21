<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center">
      <div>
        <v-img
          src="@/assets/img/logo/nest-desktop-logo-light.svg"
          class="logo my-6"
          contain
          height="250"
        />

        <!-- :src="
                $vuetify.theme.dark
                  ? require('@/assets/img/logo/nest-desktop-logo-dark.svg')
                  : require('@/assets/img/logo/nest-desktop-logo-light.svg')
              " -->

        <h2 class="text-h2">NEST Desktop</h2>
      </div>

      <div style="height: 60px" />

      <div>
        <h5>Select a simulation tool</h5>
        <v-row>
          <v-col>
            <v-btn
              :to="{ name: simulator.routerName }"
              :key="index"
              class="ma-2"
              size="x-large"
              v-for="(simulator, index) in simulatorItems"
            >
              <template #prepend>
                <v-icon :icon="simulator.icon" />
              </template>
              {{ simulator.title }}
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-responsive>
  </v-container>

  <v-footer>
    <v-row justify="center" no-gutters>
      <v-col class="text-center"> 2023 — <strong>NEST Desktop</strong> </v-col>
    </v-row>
  </v-footer>
</template>

<script lang="ts" setup>
import { simulatorItems } from "@/simulators";
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
