<template>
  <div class="modelDocumentation">
    <v-toolbar dense flat>
      <v-toolbar-title>
        {{ modelView.state.doc.title || modelView.state.modelId }}
        <v-chip
          class="mx-4"
          small
          outlined
          v-if="modelView.state.defaults.element_type"
          v-text="modelView.state.defaults.element_type"
        />
        <v-chip
          class="mx-4"
          small
          outlined
          v-if="'synapse_model' in modelView.state.defaults"
          v-text="'synapse'"
        />
      </v-toolbar-title>
      <v-spacer />
      <v-btn
        :href="NESTDocURL()"
        :title="NESTDocURL()"
        class="mx-1"
        outlined
        small
        target="_blank"
        text
      >
        <v-icon left v-text="'mdi-open-in-new'" />
        More
      </v-btn>
    </v-toolbar>

    <v-card flat style="max-height: calc(100vh - 96px); overflow-y: auto" tile>
      <v-card-subtitle
        v-if="modelView.state.doc.subtitle"
        v-text="modelView.state.doc.subtitle"
      />
      <v-card
        :key="block.title"
        flat
        tile
        v-for="block of modelView.state.doc.blocks"
      >
        <v-card-title v-text="block.title" />
        <v-card-text>
          <pre v-text="block.content" />
        </v-card-text>
      </v-card>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { onMounted, watch } from '@vue/composition-api';

import core from '@/core';

/**
 * Model ducoumenation shows documentation of a model.
 */
export default Vue.extend({
  name: 'ModelDocumentation',
  props: {
    id: String,
  },
  setup(props) {
    const modelView = core.app.model.view;
    const NESTVersion = 'v3.1';
    const NESTDocURL = () => {
      return `https://nest-simulator.readthedocs.io/en/${NESTVersion}/models/${modelView.state.modelId}.html`;
    };

    onMounted(() => {
      modelView.state.modelId = props.id;
      modelView.updateModelDoc();
    });

    watch(
      () => props.id,
      (id: string) => {
        modelView.state.modelId = id;
        modelView.updateModelDoc();
      }
    );

    return { NESTDocURL, modelView };
  },
});
</script>
