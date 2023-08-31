<template>
  <v-container class="fill-height">
    <v-responsive class="align-center text-center fill-height">
      <div class="mb-10">
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

        <p class="text-h2">NEST Desktop</p>
        <p class="text-subtitle-1">An educational GUI for neuroscience</p>
      </div>

      <h5>Select a simulation tool</h5>
      <v-row>
        <v-col>
          <v-btn
            :to="'/' + simulator.id"
            :key="index"
            class="ma-2"
            v-for="(simulator, index) in simulatorItems"
          >
            <template #prepend>
              <v-icon :icon="simulator.icon" />
            </template>
            {{ simulator.title }}
          </v-btn>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>

  <v-footer>
    <v-row justify="center" no-gutters>
      <v-col
        :key="reference.title"
        cols="12"
        md="4"
        sm="6"
        v-for="reference in references"
      >
        <v-img :src="reference.iconSrc" contain height="32px" />
      </v-col>

      <v-col class="text-center mt-4" cols="12">
        2023 — <strong>NEST Desktop</strong>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script lang="ts" setup>
import ebrainsLogo from "@/assets/img/logo/ebrains-logo.svg";
import euLogo from "@/assets/img/logo/eu-logo.png";
import hbpLogo from "@/assets/img/logo/hbp-logo.png";

import { simulatorItems } from "@/store/appStore";

const references = [
  {
    color: "rgba(16, 188, 220, 0.1)",
    iconSrc: hbpLogo,
    iconSrcDark: "hbp-logo-white-text.png",
    title: "Human Brain Project",
    url: "https://www.humanbrainproject.eu",
  },
  {
    color: "rgba(178, 245, 23, 0.1)",
    iconSrc: ebrainsLogo,
    iconSrcDark: "ebrains-logo-white-text.svg",
    title: "EBRAINS",
    url: "https://www.ebrains.eu",
  },
  {
    color: "rgba(17,31,138,0.1)",
    iconSrc: euLogo,
    iconSrcDark: "eu-logo-white-text.png",
    title: "European Union",
    url: "https://europa.eu/european-union/index_en",
  },
  // {
  //   color: "rgba(255,102,51,0.1)",
  //   iconSrc: nestLogo,
  //   iconSrcDark: "nest.svg",
  //   title: "NEST Simulator",
  //   url: "https://www.nest-simulator.org",
  // },
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
