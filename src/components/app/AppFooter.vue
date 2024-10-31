<template>
  <v-footer>
    <v-row justify="center" no-gutters>
      <v-col class="text-center">
        2024 — <strong>NEST Desktop</strong>
        <span v-if="appStore.state.devMode">
          — <small>{{ appVersion }}</small>
        </span>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script lang="ts" setup>
import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

const appVersion = process.env.APP_VERSION;
</script>
