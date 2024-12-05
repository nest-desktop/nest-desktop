<template>
  <v-card class="my-1" width="800">
    <v-card flat subtitle="An exploratory app for neuroscience" title="NEST Desktop" variant="text">
      <v-card-text class="text-justify">
        NEST Desktop is a web-based GUI application for multiple simulation tools with spiking neuronal networks. The
        application enables the rapid construction, parametrization, and instrumentation of neuronal network models. The
        primary objective is to provide an accessible classroom tool that allows users to rapidly explore neuroscience
        concepts without the need to learn a simulator control language at the same time.
        <a href="https://nest-desktop.readthedocs.io/en/latest/about/index.html#abstract" target="_blank">
          Read more
        </a>
        <AppDetails />
      </v-card-text>
    </v-card>

    <v-tabs v-model="aboutTab" density="compact">
      <v-tab value="links">Links</v-tab>
      <v-tab value="acknowledgements">Acknowledgements</v-tab>
    </v-tabs>

    <v-window v-model="aboutTab">
      <v-window-item value="links">
        <AppLinks />
      </v-window-item>
      <v-window-item value="acknowledgements">
        <v-card flat>
          <v-card-text class="text-justify">
            This project has received funding from the European Union’s Horizon 2020 Framework Programme for Research
            and Innovation under Specific Grant Agreement No. 785907 (Human Brain Project SGA2) and No. 945539 (Human
            Brain Project SGA3), the European Union’s Horizon Europe Programme under the Specific Grant Agreement No.
            101147319 (EBRAINS 2.0), the Helmholtz Association Initiative and Networking Fund under project number
            SO-092 (Advanced Computing Architectures, ACA) and the "Bundesministeriums für Bildung und Forschung" (BMBF)
            for the grant DATIPilot. This work was supported by the DFG Excellence Cluster BrainLinks-BrainTools (grant
            EXC 1086).
          </v-card-text>

          <v-card-footer>
            <v-row class="mb-2" justify="center" no-gutters>
              <v-col v-for="reference in references" :key="reference.title" class="pa-1" cols="12" sm="4">
                <v-img :src="reference.iconSrc" alt="reference-icon" contain height="40px" />
              </v-col>
            </v-row>
          </v-card-footer>
        </v-card>
      </v-window-item>
    </v-window>

    <v-card-footer>
      <AppFooter />
    </v-card-footer>
  </v-card>
</template>

<script lang="ts" setup>
import { ref } from "vue";

import AppDetails from "@/components/app/AppDetails.vue";
import AppLinks from "../app/AppLinks.vue";
import ebrainsLogo from "@/assets/img/logo/ebrains-logo.svg";
import euLogo from "@/assets/img/logo/eu-logo.png";
import hbpLogo from "@/assets/img/logo/hbp-logo.png";
import AppFooter from "../app/AppFooter.vue";

const aboutTab = ref("links");

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
