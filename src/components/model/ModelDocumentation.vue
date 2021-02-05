<template>
  <div class="model" v-if="state.modelId">
    <v-card flat tile style="height:calc(100vh - 64px); overflow-y:auto">
      <v-card :key="block.title" flat tile v-for="block of state.blocks">
        <v-card-title v-text="block.title" />
        <v-card-text>
          <pre>
            {{ block.content }}
          </pre>
        </v-card-text>
      </v-card>
    </v-card>
  </div>
</template>

<script>
import Vue from 'vue';
import { onMounted, reactive, watch } from '@vue/composition-api';
import axios from 'axios';

export default Vue.extend({
  name: 'ModelDocumentation',
  props: {
    id: String,
  },
  setup(props) {
    const titles = [
      'Short description',
      'Description',
      'Parameters',
      'Examples',
      'Problems/Todo',
      'Receives',
      'Sends',
      'References',
      'See also',
      'EndUserDocs */',
    ];

    const state = reactive({
      modelId: props.id,
      helptext: '',
      blocks: [],
      url: '',
    });

    const reset = () => {
      state.url = '';
      state.helptext = '';
      state.blocks = [];
    };

    const updateModelDoc = () => {
      reset();
      if (!state.modelId) {
        return;
      }
      state.url = `https://raw.githubusercontent.com/nest/nest-simulator/master/models/${state.modelId}.h`;
      (async () => {
        let resp = null;
        try {
          resp = await axios.get(state.url);
          if (resp.status !== 200) {
            return;
          }
          state.helptext = resp.data;
          const lines = state.helptext.split('\n');
          let blocks = titles.map(title => [lines.indexOf(title), title]);
          blocks = blocks.sort((a, b) => a[0] - b[0]);
          blocks = blocks.filter(block => block[0] !== -1);
          const content = {};
          blocks.map((block, i) => {
            const start = parseInt(block[0], 0) + 2;
            const end =
              i < blocks.length - 1
                ? parseInt(blocks[i + 1][0], 0) - 1
                : blocks.length;
            content[block[1]] = lines.slice(start, end).join('\n');
          });

          state.blocks = titles
            .filter(title => content[title])
            .map(title => {
              return {
                title,
                content: content[title],
              };
            });
        } catch (error) {
          reset();
        }
      })();
    };

    onMounted(() => {
      state.modelId = props.id;
      updateModelDoc();
    });

    watch(
      () => props.id,
      id => {
        state.modelId = id;
        updateModelDoc();
      }
    );
    return { state };
  },
});
</script>
