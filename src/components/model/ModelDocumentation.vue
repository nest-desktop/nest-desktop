<template>
  <div class="model" v-if="state.modelId">
    <v-toolbar dense flat>
      <v-toolbar-title v-text="state.modelId" />
      <span
        class="px-2"
        v-if="state.subtitle"
        v-text="' – ' + state.subtitle"
      />
      <v-spacer />
      <v-btn
        :href="`https://nest-simulator.readthedocs.io/en/v3.0/models/${state.modelId}.html`"
        :title="`https://nest-simulator.readthedocs.io/en/v3.0/models/${state.modelId}.html`"
        outlined
        small
        target="_blank"
        text
        class="mx-1"
      >
        <v-icon left v-text="'mdi-open-in-new'" />
        More
      </v-btn>
    </v-toolbar>

    <v-card flat tile style="max-height: calc(100vh - 64px); overflow-y: auto">
      <v-card :key="block.title" flat tile v-for="block of state.blocks">
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
import { onMounted, reactive, watch } from '@vue/composition-api';
import axios from 'axios';

import core from '@/core';

export default Vue.extend({
  name: 'ModelDocumentation',
  props: {
    id: String,
  },
  setup(props) {
    const titles = [
      'Short description',
      'Description',
      'Remarks',
      'Parameters',
      'Examples',
      'Problems/Todo',
      'Receives',
      'Sends',
      'Transmits',
      'References',
      'See also',
      'EndUserDocs */',
    ];

    const state = reactive({
      blocks: [],
      helptext: '',
      modelId: props.id,
      subtitle: '',
      url: '',
    });

    /**
     * Reset model documentation.
     */
    const reset = () => {
      state.blocks = [];
      state.helptext = '';
      state.subtitle = '';
      state.url = '';
    };

    /**
     * Update model documentation.
     */
    const updateModelDoc = () => {
      reset();
      if (!state.modelId) {
        return;
      }
      state.url = `${core.app.nestServer.url}/api/help?return_text=true&obj=${state.modelId}`;
      axios
        .get(state.url)
        .then(resp => {
          if (resp.status !== 200) {
            return;
          }
          state.helptext = resp.data;
          const lines: string[] = state.helptext.split('\n');
          state.subtitle = lines[0].split(' – ')[1] || '';
          let blocks: any[] = titles.map(title => [
            lines.indexOf(title),
            title,
          ]);
          blocks = blocks.sort((a: any[], b: any[]) => a[0] - b[0]);
          blocks = blocks.filter(block => block[0] !== -1);
          const content: any = {};
          blocks.map((block: any, i: number) => {
            const start: number = parseInt(block[0], 0) + 2;
            const end: number =
              i < blocks.length - 1
                ? parseInt(blocks[i + 1][0], 0) - 1
                : lines.length;
            content[block[1]] = lines.slice(start, end).join('\n');
          });

          state.blocks = titles
            .filter((title: string) => content[title])
            .map((title: string) => {
              return {
                title,
                content: content[title],
              };
            });
        })
        .catch(() => {
          state.blocks.push({
            content: `Sorry, there is no help for '${state.modelId}'.`,
          });
        });
    };

    onMounted(() => {
      state.modelId = props.id;
      updateModelDoc();
    });

    watch(
      () => props.id,
      (id: string) => {
        state.modelId = id;
        updateModelDoc();
      }
    );
    return { state };
  },
});
</script>
