<template>
  <div class="simulationCodeEditor" ref="simulationCodeEditor">
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
    <v-card flat tile>
      <v-row class="full-height" no-gutters>
        <v-col>
          <codemirror
            :options="options"
            :style="state.width"
            ref="codeMirror"
            v-model="state.code.script"
          />
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { ref, reactive, watch, onMounted } from '@vue/composition-api';
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
    const simulationCodeEditor = ref(null);
    const codeMirror = ref(null);

    const state = reactive({
      code: props.code as ProjectCode,
      width: 300,
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

    /**
     * Resize CodeMirror.
     */
    const resizeCodeMirror = () => {
      const height = simulationCodeEditor.value.clientHeight;
      const width = simulationCodeEditor.value.clientWidth;
      codeMirror.value.cminstance.setSize(width, height);
    };

    onMounted(() => {
      window.addEventListener('resize', resizeCodeMirror);
      setTimeout(resizeCodeMirror, 1);
    });

    watch(
      () => props.code,
      code => {
        state.code = code as ProjectCode;
      }
    );

    return {
      codeMirror,
      options,
      simulationCodeEditor,
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
}
</style>
