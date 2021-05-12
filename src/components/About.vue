<template>
  <div class="about">
    <v-list dense>
      <v-list-item>
        <v-row>
          <v-col class="font-weight-bold" cols="4" v-text="'Documentation'" />
          <v-col cols="8">
            <a :href="state.doc" target="_blank" v-text="state.doc" />
          </v-col>
        </v-row>
      </v-list-item>
      <v-list-item>
        <v-row>
          <v-col class="font-weight-bold" cols="4" v-text="'Source code'" />
          <v-col cols="8">
            <a :href="state.repo" target="_blank" v-text="state.repo" />
          </v-col>
        </v-row>
      </v-list-item>
      <v-list-item>
        <v-row>
          <v-col class="font-weight-bold" cols="4" v-text="'License'" />
          <v-col cols="8" v-text="state.license" />
        </v-row>
      </v-list-item>
      <v-list-item>
        <v-row>
          <v-col class="font-weight-bold" cols="4" v-text="'Current version'" />
          <v-col cols="8" v-text="state.version" />
        </v-row>
      </v-list-item>
      <v-list-item>
        <v-row>
          <v-col class="font-weight-bold" cols="4" v-text="'Contact'" />
          <v-col cols="8">
            <a :href="state.mail" v-text="state.name" />
          </v-col>
        </v-row>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import { reactive } from '@vue/composition-api';

import core from '@/core';

export default {
  name: 'About',
  setup() {
    const state = reactive({
      doc: 'https://nest-desktop.readthedocs.io',
      license: 'MIT License',
      mail: 'mailto:spreizer@uni-trier.de?subject=[NEST Desktop]',
      name: 'Sebastian Spreizer',
      repo: 'https://github.com/nest-desktop/nest-desktop',
      version: core.app.version,
    });

    return {
      state,
    };
  },
};
</script>

<style>
.about .v-list {
  font-size: 12px;
}
.about .v-list-item {
  height: 28px !important;
  min-height: 28px !important;
}
.about a {
  text-decoration: none;
  color: black !important;
}
.about .col-4,
.about .col-8 {
  padding: 4px;
}
</style>
