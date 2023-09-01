<template>
  <v-app>
    <v-system-bar class="d-print-none" color="systembar" flat>
      <app-bar />
    </v-system-bar>

    <router-view />
  </v-app>
</template>

<script lang="ts" setup>
import AppBar from "@/components/app/AppBar.vue";
</script>
