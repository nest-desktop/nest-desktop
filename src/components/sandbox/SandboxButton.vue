<template>
  <v-card class="playground-button">
    <v-card-title>Button</v-card-title>
    <v-card-text>
      <v-row :key="index" class="my-3" v-for="(buttonGrp, index) in buttons">
        <v-btn
          :color="button.color || state.color"
          :key="index"
          :size="button.size"
          :text="button.text"
          :variant="button.variant as variantTypes"
          @click.stop="state.color = button.color as string"
          class="mx-1"
          v-for="(button, index) in buttons"
        />
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { reactive } from "vue";

const state = reactive({
  color: "primary",
});

type variantTypes = "elevated" | "flat" | "text" | "outlined" | "plain" | "tonal" | undefined;

const buttons = [
  { text: "blue", color: "blue", size: "x-small" },
  { text: "orange", color: "orange", size: "x-small" },
  { text: "green", color: "green", size: "x-small" },
  { text: "red", color: "red", size: "x-small" },
  { text: "purple", color: "purple", size: "x-small" },
  { text: "brown", color: "brown", size: "x-small" },
  { text: "rosa", color: "rosa", size: "x-small" },
  { text: "grey", color: "grey", size: "x-small" },
  { text: "yellow", color: "yellow", size: "x-small" },
  { text: "cyan", color: "cyan", size: "x-small" },
  { text: "blue", color: "blue-lighten-1", size: "x-small" },
  { text: "orange", color: "orange-lighten-1", size: "x-small" },
  { text: "green", color: "green-lighten-1", size: "x-small" },
  { text: "red", color: "red-lighten-1", size: "x-small" },
  { text: "purple", color: "purple-lighten-1", size: "x-small" },
  { text: "brown", color: "brown-lighten-1", size: "x-small" },
  { text: "rosa", color: "rosa-lighten-1", size: "x-small" },
  { text: "grey", color: "grey-lighten-1", size: "x-small" },
  { text: "yellow", color: "yellow-lighten-1", size: "x-small" },
  { text: "cyan", color: "cyan-lighten-1", size: "x-small" },
  { text: "elevated", variant: "elevated" },
  { text: "flat", variant: "flat" },
  { text: "text", variant: "text" },
  { text: "outlined", variant: "outlined" },
  { text: "plain", variant: "plain" },
  { text: "tonal", variant: "tonal" },
  { text: "x-small", size: "x-small" },
  { text: "small", size: "small" },
  { text: "large", size: "large" },
  { text: "x-large", size: "x-large" },
];
</script>
