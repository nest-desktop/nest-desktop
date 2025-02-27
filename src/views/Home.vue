<template>
  <v-container class="fill-height">
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

        <h2 class="text-h2">NEST Desktop</h2>
      </div>

      <div style="height: 60px" />

      <div>
        <h5>Select a workspace</h5>
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
