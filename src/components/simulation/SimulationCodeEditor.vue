<template>
  <div class="simulationCodeEditor">
    <span
      style="position: absolute; right: 60px; top: 0; z-index: 1000"
      v-if="state.code.project.app.config.devMode"
    >
      <v-chip
        class="ma-1"
        label
        outlined
        small
        v-text="state.code.hash.slice(0, 6)"
      />
    </span>
    <v-row class="full-height" no-gutters>
      <codemirror v-model="state.code.script" :options="options" />
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive, watch } from '@vue/composition-api';
import { codemirror } from 'vue-codemirror';

import { ProjectCode } from '@/core/project/projectCode';

export default Vue.extend({
  name: 'SimulationCodeEditor',
  components: {
    codemirror,
  },
  props: {
    code: ProjectCode,
  },
  setup(props) {
    const state = reactive({
      code: props.code as ProjectCode,
    });

    const options: any = {
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
      code => {
        state.code = code as ProjectCode;
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
