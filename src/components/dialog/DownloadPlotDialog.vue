<template>
  <v-card>
    <v-card-title>Download plot as image</v-card-title>

    <v-card-text>
      <v-text-field
        v-model="state.toImageButtonOptions.filename"
        density="compact"
        label="filename"
      />

      <v-row>
        <v-col cols="6">
          <v-text-field
            v-model="state.toImageButtonOptions.width"
            density="compact"
            label="width"
          >
            <template #prepend>
              size:
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="6">
          <v-text-field
            v-model="state.toImageButtonOptions.height"
            density="compact"
            label="height"
          >
            <template #prepend>
              x
            </template>
            <template #append>
              px
            </template>
          </v-text-field>
        </v-col>
      </v-row>

      <v-select
        v-model="state.toImageButtonOptions.format"
        :items="state.imageFormats"
        density="compact"
        hide-details
        label="Image format"
      />
    </v-card-text>

    <v-card-actions>
      <v-spacer />
      <v-btn
        text="download"
        @click="closeDialog(state.toImageButtonOptions)"
      />
      <v-btn
        text="close"
        @click="closeDialog()"
      />
    </v-card-actions>
  </v-card>
</template>

<script setup lang="ts">
import { reactive } from "vue";
// @ts-expect-error Could not find a declaration file for module 'plotly.js-basic-dist-min'.
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