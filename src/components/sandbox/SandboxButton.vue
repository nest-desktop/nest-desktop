<template>
  <v-card class="playground-button">
    <v-card-title>Button</v-card-title>
    <v-card-text>
      <v-row
        v-for="(buttonGrp, index) in buttons"
        :key="index"
        class="my-3"
      >
        <v-btn
          v-for="(button, btnIdx) in buttonGrp"
          :key="btnIdx"
          :color="button.color || state.color"
          :size="button.size || state.size"
          :text="button.text"
          :variant="(button.variant || state.variant) as variantTypes"
          class="mx-1"
          @click.stop="update(button)"
        />
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script lang="ts" setup>
import { reactive } from "vue";

const state = reactive<{
  color: string;
  size: string;
  variant: string;
}>({
  color: "primary",
  size: "default",
  variant: "elevated",
});

type variantTypes =
  | "elevated"
  | "flat"
  | "outlined"
  | "plain"
  | "text"
  | "tonal"
  | undefined;

const buttons: Record<string, string>[][] = [
  [
    { text: "blue", color: "blue" },
    { text: "orange", color: "orange" },
    { text: "green", color: "green" },
    { text: "red", color: "red" },
    { text: "purple", color: "purple" },
    { text: "brown", color: "brown" },
    { text: "rosa", color: "rosa" },
    { text: "grey", color: "grey" },
    { text: "yellow", color: "yellow" },
    { text: "cyan", color: "cyan" },
  ],
  [
    { text: "blue", color: "blue-lighten-1" },
    { text: "orange", color: "orange-lighten-1" },
    { text: "green", color: "green-lighten-1" },
    { text: "red", color: "red-lighten-1" },
    { text: "purple", color: "purple-lighten-1" },
    { text: "brown", color: "brown-lighten-1" },
    { text: "rosa", color: "rosa-lighten-1" },
    { text: "grey", color: "grey-lighten-1" },
    { text: "yellow", color: "yellow-lighten-1" },
    { text: "cyan", color: "cyan-lighten-1" },
  ],
  [
    { text: "elevated", variant: "elevated" },
    { text: "flat", variant: "flat" },
    { text: "text", variant: "text" },
    { text: "outlined", variant: "outlined" },
    { text: "plain", variant: "plain" },
    { text: "tonal", variant: "tonal" },
  ],
  [
    { text: "x-small", size: "x-small" },
    { text: "small", size: "small" },
    { text: "medium", size: "default" },
    { text: "large", size: "large" },
    { text: "x-large", size: "x-large" },
  ],
];

const update = (button: Record<string, string>) => {
  if (button.color) {
    state.color = button.color;
  }
  if (button.size) {
    state.size = button.size;
  }
  if (button.variant) {
    state.variant = button.variant;
  }
};
</script>
