<template>
  <v-card class="playground-tabs">
    <v-card-title>Tabs</v-card-title>
    <v-card-text>
      <v-card variant="text">
        <v-tabs
          v-model="state.tab"
          grow
        >
          <v-tab value="one">
            Item One
          </v-tab>
          <v-tab value="two">
            Item Two
          </v-tab>
          <v-tab value="three">
            Item Three
          </v-tab>
        </v-tabs>

        <v-card-text>
          <v-window v-model="state.tab">
            <v-window-item
              reverse-transition="no-transition"
              transition="no-transition"
              value="one"
            >
              One
            </v-window-item>
            <v-window-item
              reverse-transition="no-transition"
              transition="no-transition"
              value="two"
            >
              Two
            </v-window-item>
            <v-window-item
              reverse-transition="no-transition"
              transition="no-transition"
              value="three"
            >
              Three
            </v-window-item>
          </v-window>
        </v-card-text>
      </v-card>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { reactive } from "vue";

const state = reactive<{
  tab: string | null;
}>({
  tab: null,
});
</script>
