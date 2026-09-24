<template>
  <v-container class="fill-height d-flex align-center flex-wrap">
    <v-responsive class="align-center text-center">
      <div>
        <v-img
          alt="nest-desktop-logo"
          class="logo my-6"
          contain
          height="250"
          src="@/assets/img/logo/nest-desktop-logo-light.svg"
        />

        <!-- :src="
                $vuetify.theme.dark
                  ? require('@/assets/img/logo/nest-desktop-logo-dark.svg')
                  : require('@/assets/img/logo/nest-desktop-logo-light.svg')
              " -->

        <div class="text-title">NEST Desktop</div>
      </div>

      <div style="height: 40px" />

      <div>
        <div>Select a workspace</div>
        <v-row>
          <v-col>
            <v-btn
              v-for="(workspace, index) in appStore.workspaceItems"
              :key="index"
              :to="{ name: workspace.id + 'Home' }"
              class="ma-2"
              size="x-large"
            >
              <template #prepend>
                <v-icon :icon="workspace.id + ':logo'" />
              </template>
              {{ workspace.title }}
            </v-btn>
          </v-col>
        </v-row>
      </div>
    </v-responsive>
  </v-container>

  <app-footer />
</template>

<script setup lang="ts">
import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

import AppFooter from "@/components/app/AppFooter.vue";
</script>

<style lang="scss">
.text-title {
  font-size: 3.75rem !important;
  font-weight: 300;
  line-height: 1;
  letter-spacing: -0.0083333333em !important;
  font-family: Roboto, sans-serif;
  text-transform: none !important;
}
</style>
