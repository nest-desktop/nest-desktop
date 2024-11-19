<template>
  <v-card class="my-1" width="800">
    <div class="text-center">
      <v-img
        alt="nest-desktop-logo"
        class="logo my-6"
        contain
        height="250"
        src="@/assets/img/logo/nest-desktop-logo-light.svg"
      />
      <p class="text-h2">NEST Desktop</p>
      <p class="text-subtitle-1">An educational GUI for neuroscience</p>
    </div>

    <v-card flat variant="text">
      <v-card-text class="text-justify">
        <div class="my-1">
          NEST Desktop is a web-based GUI application for multiple
          simulation tools with neuronal networks. The application enables
          the rapid construction, parametrization, and instrumentation of
          neuronal network models.
        </div>
        <div class="my-1">
          The primary objective is to provide an accessible classroom tool
          that allows users to rapidly explore neuroscience concepts without
          the need to learn a simulator control language at the same time.
        </div>
      </v-card-text>
    </v-card>

    <v-divider />
    <AppDetails flat />
    <v-divider />

    <v-card flat subtitle="Acknowledgement">
      <v-card-text class="text-justify">
        This project has received funding from the European Union’s Horizon
        2020 Framework Programme for Research and Innovation under Specific
        Grant Agreement No. 785907 (Human Brain Project SGA2) and No. 945539
        (Human Brain Project SGA3). This project was funded by the Helmholtz
        Association Initiative and Networking Fund under project number
        SO-092 (Advanced Computing Architectures, ACA). This work was
        supported by the DFG Excellence Cluster BrainLinks-BrainTools (grant
        EXC 1086).

        <v-row class="mt-4" justify="center" no-gutters>
          <v-col
            v-for="reference in references"
            :key="reference.title"
            cols="12"
            md="4"
            sm="6"
          >
            <v-img
              :src="reference.iconSrc"
              alt="reference-icon"
              contain
              height="32px"
            />
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-card>
</template>

<script lang="ts" setup>
import AppDetails from "@/components/app/AppDetails.vue";
import ebrainsLogo from "@/assets/img/logo/ebrains-logo.svg";
import euLogo from "@/assets/img/logo/eu-logo.png";
import hbpLogo from "@/assets/img/logo/hbp-logo.png";

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
];
</script>