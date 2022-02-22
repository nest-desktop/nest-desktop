<template>
  <div
    class="simulationCodeEditor"
    ref="simulationCodeEditor"
    style="height: calc(100vh - 48px)"
  >
    <v-toolbar dense flat height="42">
      <v-row>
        <v-btn-toggle
          @change="state.code.generate()"
          class="ma-2px"
          color="light"
          dense
          group
          multiple
          v-model="state.code.state.blocks"
        >
          <v-tooltip :key="item.value" bottom v-for="item of state.blockItems">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                :disabled="item.disabled"
                :value="item.value"
                dense
                text
                v-bind="attrs"
                v-on="on"
              >
                <span class="d-flex flex-column">
                  <v-icon small style="width: auto" v-text="item.icon" />
                  <span style="font-size: 7px" v-text="item.icontext" />
                </span>
              </v-btn>
            </template>
            <span v-text="item.text" />
          </v-tooltip>
        </v-btn-toggle>

        <v-spacer />

        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn fab small text v-bind="attrs" v-on="on">
              <v-icon small v-text="'mdi-download'" />
            </v-btn>
          </template>
          <v-list dense>
            <v-list-item
              :key="item.value"
              @click="state.code.export(item.value)"
              v-for="item in state.fileFormatItems"
            >
              <v-list-item-icon class="mx-1 py-1">
                <Icon :icon="item.icon" />
              </v-list-item-icon>
              <v-list-item-title v-text="item.title" />
            </v-list-item>
          </v-list>
        </v-menu>
      </v-row>
    </v-toolbar>

    <v-card flat tile>
      <span
        style="position: absolute; right: 18px; top: 0; z-index: 1000"
        v-if="state.code.project.app.config.devMode"
      >
        <v-chip
          class="ma-1"
          label
          outlined
          small
          v-text="state.code.shortHash"
        />
      </span>

      <codemirror
        :key="$vuetify.theme.dark"
        :options="state.options"
        :style="state.style"
        @ready="onCmReady"
        class="ma-0"
        ref="codeMirror"
        v-model="state.code.script"
      />
    </v-card>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {
  onBeforeUnmount,
  onMounted,
  reactive,
  ref,
  watch,
} from '@vue/composition-api';
import { codemirror } from 'vue-codemirror';
import 'codemirror/addon/hint/show-hint';
import '@/assets/codemirror/addon/hint/pyNEST-hint';

import { ProjectCode } from '@/core/project/projectCode';

import { Icon } from '@iconify/vue2';
import jupyterIcon from '@iconify-icons/logos/jupyter';
import pythonIcon from '@iconify-icons/logos/python';

export default Vue.extend({
  name: 'SimulationCodeEditor',
  components: {
    codemirror,
    Icon,
  },
  props: {
    code: ProjectCode,
  },
  setup(props, { root }) {
    const simulationCodeEditor = ref(null);
    const codeMirror = ref(null);

    const state = reactive({
      code: props.code as ProjectCode,
      blockItems: [
        {
          disabled: false,
          icon: 'mdi-delete-empty-outline',
          icontext: 'reset',
          text: 'Reset kernel',
          value: 'resetKernel',
        },
        {
          disabled: false,
          icon: 'mdi-debug-step-into',
          icontext: 'insite',
          text: 'Run simulation with Insite',
          value: 'runSimulationInsite',
        },
        {
          disabled: false,
          icon: 'mdi-engine-outline',
          icontext: 'kernel',
          text: 'Set simulation kernel',
          value: 'setKernel',
        },
        {
          disabled: false,
          icon: 'mdi-shape',
          icontext: 'create',
          text: 'Create nodes',
          value: 'createNodes',
        },
        {
          disabled: false,
          icon: '$network',
          icontext: 'connect',
          text: 'Connect nodes',
          value: 'connectNodes',
        },
        {
          disabled: false,
          icon: 'mdi-play',
          icontext: 'simulate',
          text: 'Run simulation',
          value: 'runSimulation',
        },
      ],
      fileFormatItems: [
        {
          icon: pythonIcon,
          title: 'Python',
          value: 'py',
        },
        {
          icon: jupyterIcon,
          title: 'Jupyter',
          value: 'ipynb',
        },
      ],
      options: {
        autoCloseBrackets: true,
        cursorBlinkRate: 700,
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        hintOptions: {
          completeSingle: false,
          hintWords: [],
        },
        lineNumbers: true,
        lineWrapping: true,
        matchBrackets: true,
        mode: 'python',
        styleActiveLine: true,
        extraKeys: {
          'Ctrl-Space': 'autocomplete',
        },
        theme: root.$vuetify.theme.dark ? 'base16-dark' : 'default',
      },
      style: {
        width: 300,
      },
    });

    /**
     * Initialize hint (only for NEST commands!) after CodeMirror is ready.
     */
    const onCmReady = (cm: any) => {
      cm.on('keypress', () => {
        const currentCursorPosition: any = cm.getCursor();
        const backwardCursorPosition: any = {
          line: currentCursorPosition.line,
          ch: currentCursorPosition.ch - 4,
        };
        const backwardCharacter: string = cm.getRange(
          backwardCursorPosition,
          currentCursorPosition
        );
        if (backwardCharacter === 'nest') {
          cm.showHint();
        }
      });
    };

    /**
     * Update theme for CodeMirror.
     */
    const updateTheme = () => {
      state.options.theme = root.$vuetify.theme.dark
        ? 'base16-dark'
        : 'default';
    };

    /**
     * Check if Insite is running as backend.
     */
    const checkInsite = () => {
      state.blockItems[1].disabled = !state.code.isInsiteReady;
    };

    /**
     * Resize CodeMirror.
     */
    const resizeCodeMirror = () => {
      const height = simulationCodeEditor.value.clientHeight - 43;
      const width = simulationCodeEditor.value.clientWidth;
      codeMirror.value.cminstance.setSize(width, height);
      updateTheme();
    };

    onMounted(() => {
      checkInsite();
      window.addEventListener('resize', resizeCodeMirror);
      setTimeout(resizeCodeMirror, 1);
    });

    onBeforeUnmount(() => {
      window.removeEventListener('resize', resizeCodeMirror);
    });

    watch(
      () => props.code,
      code => {
        state.code = code as ProjectCode;
      }
    );

    return {
      codeMirror,
      onCmReady,
      simulationCodeEditor,
      state,
    };
  },
});
</script>

<style>
.CodeMirror {
  border: 1px solid rgba(0, 0, 0, 0.12);
  font-family: monospace;
  font-size: 12px;
}
</style>
