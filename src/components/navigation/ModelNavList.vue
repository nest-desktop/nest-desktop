<template>
  <div class="models">
    <!-- <v-toolbar dense flat dark color="secondary">
      Models
    </v-toolbar> -->

    <v-form>
      <v-container class="py-0">
        <v-text-field
          clearable
          hide-details
          label="Search model"
          prepend-inner-icon="mdi-magnify"
        />
      </v-container>
    </v-form>

    <v-list dense>
      <v-list-item
        :key="model.id"
        :to="'/model/' + model.id"
        v-for="model in state.models"
      >
        <v-list-item-content>
          <v-list-item-title v-text="model.label" />
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive } from '@vue/composition-api';

import core from '@/core';

export default Vue.extend({
  name: 'Models',
  setup() {
    const state = reactive({
      models: core.app.models,
    });
    return { state };
  },
});
</script>
