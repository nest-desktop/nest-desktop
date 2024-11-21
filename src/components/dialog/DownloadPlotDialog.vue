<template>
  <v-card>
    <v-card-title>Download plot as image</v-card-title>

    <v-card-text>
      <v-text-field density="compact" label="filename" v-model="state.toImageButtonOptions.filename" />

      <v-row>
        <v-col cols="6">
          <v-text-field density="compact" label="width" v-model="state.toImageButtonOptions.width">
            <template #prepend>size:</template>
          </v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field density="compact" label="height" v-model="state.toImageButtonOptions.height">
            <template #prepend>x</template>
            <template #append>px</template>
          </v-text-field>
        </v-col>
      </v-row>

      <v-select
        :items="state.imageFormats"
        density="compact"
        hide-details
        label="Image format"
        v-model="state.toImageButtonOptions.format"
      />
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn @click="closeDialog(state.toImageButtonOptions)" text="download" />
      <v-btn @click="closeDialog()" text="close" />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { reactive } from "vue";
// @ts-ignore
import {  DownloadImgopts } from "plotly.js-basic-dist-min";

const props = defineProps<{ filename: string }>()

const emit = defineEmits(["closeDialog"]);
const closeDialog = (value?: DownloadImgopts | boolean) => emit("closeDialog", value);

const state = reactive<{
  imageFormats: string[];
  toImageButtonOptions: DownloadImgopts
}>({
  imageFormats: ["jpeg", "png", "svg", "webp"],
  toImageButtonOptions: {
    filename: (props.filename || "nest_desktop"),
    format: "png", // png, svg, jpeg, webp
    height: 720,
    width: 1280,
  },
});
</script>