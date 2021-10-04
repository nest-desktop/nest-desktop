<template>
  <div class="models">
    <!-- <v-toolbar dense flat dark color="secondary">
      Models
    </v-toolbar> -->

    <v-form>
      <v-container class="py-0">
        <v-text-field
          :prepend-icon="
            implementedModels.length === state.models.length
              ? 'mdi-filter-outline'
              : 'mdi-filter-off-outline'
          "
          @click:append="clearSearch"
          @click:prepend="filterModels"
          clearable
          hide-details
          label="Search model"
          prepend-inner-icon="mdi-magnify"
          v-model="state.searchTerm"
        />
      </v-container>
    </v-form>

    <v-list dense :style="{ fontSize: '14px' }">
      <v-list-item
        :class="{ 'font-weight-bold': implementedModels.includes(model) }"
        :key="model"
        :to="'/model/' + model"
        v-for="model in state.models"
        v-show="state.searchTerm ? model.includes(state.searchTerm) : true"
        v-text="model"
      />
    </v-list>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive } from '@vue/composition-api';
import axios from 'axios';

import core from '@/core';

export default Vue.extend({
  name: 'Models',
  setup() {
    const implementedModels = core.app.models.map(model => model.id);

    const state = reactive({
      models: implementedModels,
      searchTerm: '',
    });

    /**
     * Clear search term.
     */
    const clearSearch = () => {
      state.searchTerm = '';
    };

    /**
     * Show implemented or all models
     */
    const filterModels = () => {
      if (state.models.length !== implementedModels.length) {
        // Use implemented models
        state.models = implementedModels;
      } else {
        // Fetch models from NEST Simulator.
        const url = `${core.app.NESTSimulator.url}/api/Models`;
        axios.get(url).then(resp => {
          state.models = resp.data;
        });
      }
    };

    return { clearSearch, filterModels, implementedModels, state };
  },
});
</script>
