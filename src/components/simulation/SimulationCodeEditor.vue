<template>
  <div class="simulationCodeEditor" ref="simulationCodeEditor">
    <v-toolbar dense flat height="40" style="width: 100%">
      <v-row>
        <v-btn-toggle
          :color="state.color"
          @change="state.code.generate()"
          dense
          group
          multiple
          style="width: calc(100% - 160px)"
          v-model="state.code.state.blocks"
        >
          <v-btn
            :disabled="item.disabled"
            :key="item.value"
            :title="item.text"
            :value="item.value"
            class="flex-grow-1 ma-0"
            height="40"
            text
            v-for="item of state.blockItems"
          >
            <span class="d-flex flex-column">
              <v-icon small style="width: auto" v-text="item.icon" />
              <span style="font-size: 7px" v-text="item.icontext" />
            </span>
          </v-btn>
        </v-btn-toggle>

        <v-spacer />

        <v-menu offset-y>
          <template #activator="{ on, attrs }">
            <v-btn height="40" small text tile v-bind="attrs" v-on="on">
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

        <v-menu :close-on-content-click="false" offset-y>
          <template #activator="{ on, attrs }">
            <v-btn height="40" small text tile v-bind="attrs" v-on="on">
              <v-icon small v-text="'mdi-dots-vertical'" />
            </v-btn>
          </template>

          <v-list dense>
            <v-list-item>
              <v-radio-group
                @change="state.code.generate()"
                class="ma-0"
                hide-details
                label="Script language"
                v-model="state.code.state.version"
              >
                <v-radio
                  :key="item.value"
                  :label="item.text"
                  :value="item.value"
                  class="text-no-wrap"
                  hide-details
                  v-for="item in state.nestVersions"
                />
              </v-radio-group>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-row>
    </v-toolbar>

    <v-card flat tile>
      <span
        style="position: absolute; right: 18px; top: 0; z-index: 1"
        v-if="state.code.simulation.project.app.config.devMode"
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

import { SimulationCode } from '@/core/simulation/simulationCode';

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
    code: SimulationCode,
    color: String,
  },
  setup(props, { root }) {
    const simulationCodeEditor = ref(null);
    const codeMirror = ref(null);

    const state = reactive({
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
      code: props.code as SimulationCode,
      color: props.color,
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
      nestVersions: [
        // { text: 'NEST dev', value: 'nest-master' },
        { text: 'NEST v3.4', value: 'nest-v3.4' },
        { text: 'NEST v3.3', value: 'nest-v3.3' },
        // { text: 'NEST v3.2', value: 'nest-v3.2' },
        // { text: 'NEST v3.1', value: 'nest-v3.1' },
        // { text: 'NEST v3.0', value: 'nest-v3.0' },
        { text: 'PyNN v0.10', value: 'pyNN-v0.10' },
      ],
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
      const height = simulationCodeEditor.value.clientHeight - 40;
      const width = simulationCodeEditor.value.clientWidth;
      codeMirror.value.cminstance.setSize(width, height);
      updateTheme();
    };

    onMounted(() => {
      state.color = props.color;
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
        state.code = code as SimulationCode;
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
.simulationCodeEditor {
  height: calc(100vh - 48px - 24px);
}

.simulationCodeEditor .CodeMirror {
  border: 1px solid rgba(0, 0, 0, 0.12);
  font-family: monospace;
  font-size: 12px;
}
</style>
