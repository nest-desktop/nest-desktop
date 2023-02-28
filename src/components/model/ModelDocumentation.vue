<template>
  <div
    :style="modelView.config.getDocFromBackend ? '{overflow-y: auto}' : '{}'"
    class="modelDocumentation"
  >
    <div v-if="modelView.config.getDocFromBackend">
      <v-toolbar dense flat>
        <v-toolbar-title>
          {{ modelView.state.doc.title || modelView.state.modelId }}
          <v-chip
            class="mx-4"
            outlined
            small
            v-if="modelView.state.defaults.element_type"
            v-text="modelView.state.defaults.element_type"
          />
          <v-chip
            class="mx-4"
            outlined
            small
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

      <v-card class="modelDocumentationContent" flat tile>
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

    <iframe
      :src="`https://nest-simulator.readthedocs.io/en/latest/models/${
        modelView.state.modelId
      }.html#models-${parseKebabCase(modelView.state.modelId)}--page-root`"
      frameborder="0"
      height="100%"
      v-else
      width="100%"
    />
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
    const NESTVersion = core.app.backends.nestSimulator.state.version.nest;
    const RTDVersion = /^\d{1}\.\d{1,2}$/.test(NESTVersion)
      ? 'v' + NESTVersion
      : 'latest';
    const NESTDocURL = () => {
      return `https://nest-simulator.readthedocs.io/en/${RTDVersion}/models/${modelView.state.modelId}.html`;
    };

    const parseKebabCase = (text: string) => {
      return text.replaceAll('_', '-');
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

    return { NESTDocURL, modelView, parseKebabCase };
  },
});
</script>

<style>
.modelDocumentation {
  height: calc(100vh - 48px - 24px);
}
</style>
