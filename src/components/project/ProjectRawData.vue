<template>
  <div class="projectRawData" ref="projectRawData">
    <v-row class="full-height" no-gutters>
      <codemirror
        :options="state.options"
        :style="state.style"
        :value="state.data"
        ref="codeMirror"
      />
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive, watch, onMounted, ref } from '@vue/composition-api';
import { codemirror } from 'vue-codemirror';

import { Project } from '@/core/project/project';

export default Vue.extend({
  name: 'ProjectRawData',
  components: {
    codemirror,
  },
  props: {
    project: Project,
  },
  setup(props, { root }) {
    const codeMirror = ref(null);
    const projectRawData = ref(null);

    const state = reactive({
      data: '',
      options: {
        cursorBlinkRate: 700,
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        lineNumbers: true,
        lineWrapping: true,
        mode: { name: 'javascript', json: true },
        readOnly: true,
        theme: root.$vuetify.theme.dark ? 'base16-dark' : 'default',
      },
      style: {
        width: 300,
      },
    });

    /**
     * Update theme for CodeMirror.
     */
    const updateTheme = () => {
      state.options.theme = root.$vuetify.theme.dark
        ? 'base16-dark'
        : 'default';
    };

    /**
     * Resize CodeMirror.
     */
    const resizeCodeMirror = () => {
      const height = projectRawData.value.clientHeight;
      const width = projectRawData.value.clientWidth;
      codeMirror.value.cminstance.setSize(width, height);
      updateTheme();
    };

    onMounted(() => {
      const project = props.project as Project;
      state.data = JSON.stringify(project.doc, null, '\t');
      window.addEventListener('resize', resizeCodeMirror);
    });

    watch(
      () => props.project,
      (project: Project) => {
        state.data = JSON.stringify(project.doc, null, '\t');
      }
    );

    return { codeMirror, projectRawData, state };
  },
});
</script>

<style>
.ProjectRawData {
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
