<template>
  <div class="simulationCodeEditor">
    <v-row class="full-height" no-gutters>
      <codemirror v-model="state.code.script" :options="options" />
    </v-row>
  </div>
</template>

<script>
import Vue from 'vue';
import { reactive, watch } from '@vue/composition-api';
import { codemirror } from 'vue-codemirror';

export default Vue.extend({
  name: 'SimulationCodeEditor',
  components: {
    codemirror,
  },
  props: {
    code: Object,
  },
  setup(props) {
    const state = reactive({
      code: props.code,
    });

    const options = {
      cursorBlinkRate: 700,
      foldGutter: true,
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
      hintOptions: {
        completeSingle: false,
        hintWords: [],
      },
      lineNumbers: true,
      lineWrapping: true,
      mode: 'python',
      styleActiveLine: true,
      extraKeys: {
        'Ctrl-Space': 'autocomplete',
        // '"."': this.showHint,
      },
    };

    watch(
      () => props.code,
      () => {
        state.code = props.code;
      }
    );

    return {
      options,
      state,
    };
  },
});
</script>

<style>
.simulationCodeEditor {
  overflow: hidden;
}

.CodeMirror {
  border: 1px solid #eee;
  font-family: monospace;
  font-size: 12px;
  width: 512px;
  height: calc(100vh - 48px);
}
</style>
