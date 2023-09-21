<template>
  <v-footer>
    <v-row justify="center" no-gutters>
      <v-col class="text-center">
        2023 — <strong>NEST Desktop</strong>
        <span v-if="appSessionStore.devMode">
          — <small>{{ appVersion }}</small>
        </span>
      </v-col>
    </v-row>
  </v-footer>
</template>

<script lang="ts" setup>
import { useAppSessionStore } from "@/store/appSessionStore";
const appSessionStore = useAppSessionStore();

const appVersion = process.env.APP_VERSION;
</script>
