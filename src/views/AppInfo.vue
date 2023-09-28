<template>
  <v-container class="fill-height" maxWidth="1400">
    <v-col align="center">
      <!-- :src="
                $vuetify.theme.dark
                  ? require('@/assets/img/logo/nest-desktop-logo-dark.svg')
                  : require('@/assets/img/logo/nest-desktop-logo-light.svg')
              " -->
      <v-img
        src="@/assets/img/logo/nest-desktop-logo-light.svg"
        class="logo my-6"
        contain
        height="250"
      />

      <p class="text-h2" v-text="'NEST Desktop'" />
      <p
        class="text-subtitle-1"
        v-text="'An educational GUI for neuroscience'"
      />
    </v-col>

    <v-col :cols="12" :md="12" :xl="8" :offset-xl="2">
      <v-row v-if="state.includeProjectButtons">
        <v-col :lg="4" :xs="6" :offset-lg="2">
          <v-btn
            class="project"
            block
            dark
            size="large"
            to="project"
            variant="text"
          >
            <v-icon icon="'mdi-plus'" left />
            Start a new project
          </v-btn>
        </v-col>
        <v-col :lg="4" :xs="6">
          <v-menu>
            <template #activator="{ on, attrs }">
              <v-btn
                @click="loadProjects"
                class="project"
                block
                dark
                size="large"
                variant="text"
                v-bind="attrs"
                v-on="on"
              >
                <v-spacer />
                <v-icon icon="'mdi-upload-outline'" left />
                Load a project
                <v-spacer />
                <v-icon icon="'mdi-dots-vertical'" right />
              </v-btn>
            </template>
            <v-list dense>
              <!-- :to="`project/${project.id}`" -->
              <v-list-item
                :key="index"
                v-for="(project, index) in state.projects"
              >
                <v-list-item-title text="project.name" />
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
      </v-row>

      <v-row>
        <v-col :cols="12" :md="6">
          <v-card flat height="100%" rounded="0" variant="text">
            <v-card-text>
              <p class="text-justify">
                NEST Desktop is a web-based GUI application for NEST Simulator,
                an advanced simulation tool for computational neuroscience. The
                application enables the rapid construction, parametrization, and
                instrumentation of neuronal network models.
              </p>
              <p class="text-justify">
                The primary objective is to provide an accessible classroom tool
                that allows users to rapidly explore neuroscience concepts
                without the need to learn a simulator control language at the
                same time.
              </p>
            </v-card-text>
          </v-card>
        </v-col>

        <v-col :cols="12" :md="6">
          <v-card flat height="100%" rounded="0" variant="text">
            <v-layout fill-height="true">
              <v-row align="center">
                <v-col align="center" cols="12">
                  <v-card flat>
                    <v-card-text>
                      <AppDetails />
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-layout>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col
          :cols="6"
          :key="reference.title"
          :lg="3"
          :sm="3"
          v-for="reference in references"
        >
          <v-img :src="reference.iconSrc" contain height="32px" />
        </v-col>
      </v-row>
    </v-col>
  </v-container>
</template>

<script lang="ts" setup>
import { onMounted, reactive, watch } from "vue";
import { useTheme } from "vuetify";

import AppDetails from "@/components/app/AppDetails.vue";

import ebrainsLogo from "@/assets/img/logo/ebrains-logo.svg";
import euLogo from "@/assets/img/logo/eu-logo.png";
import hbpLogo from "@/assets/img/logo/hbp-logo.png";
import nestLogo from "@/assets/img/logo/nest.svg";

const theme = useTheme();

// import core from '@/core';

const props = defineProps({
  includeProjectButtons: Boolean,
});

const isDark = theme.global.current.value.dark;

const references = [
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
  {
    color: "rgba(16, 188, 220, 0.1)",
    iconSrc: hbpLogo,
    iconSrcDark: "hbp-logo-white-text.png",
    title: "Human Brain Project",
    url: "https://www.humanbrainproject.eu",
  },
  {
    color: "rgba(255,102,51,0.1)",
    iconSrc: nestLogo,
    iconSrcDark: "nest.svg",
    title: "NEST Simulator",
    url: "https://www.nest-simulator.org",
  },
];

const state = reactive({
  includeProjectButtons: props.includeProjectButtons,
  projects: [],
});

onMounted(() => {
  state.includeProjectButtons =
    (props.includeProjectButtons as boolean) || false;
});

watch(
  () => [props.includeProjectButtons],
  () => {
    state.includeProjectButtons = props.includeProjectButtons as boolean;
  }
);

/**
 * Load projects from app core component
 */
const loadProjects = () => {
  // state.projects = core.app.project.state.projects;
};
</script>

<style scoped>
.appInfo {
  height: 100%;
}
.appInfo .logo {
  overflow: hidden;
}
.appInfo .logo .v-image {
  transition: all 0.5s ease-in-out;
  transform: scale(1);
}
.appInfo .logo:hover .v-image {
  transform: scale(1.5);
}
</style>
