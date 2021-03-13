<template>
  <div class="ProjectRawData">
    <v-row class="full-height" no-gutters>
      <codemirror :options="options" :value="state.data" />
    </v-row>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { reactive, watch, onMounted } from '@vue/composition-api';
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
  setup(props) {
    const state = reactive({
      data: '',
    });

    const options: any = {
      cursorBlinkRate: 700,
      foldGutter: true,
      gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
      lineNumbers: true,
      lineWrapping: true,
      mode: { name: 'javascript', json: true },
      readOnly: true,
    };

    onMounted(() => {
      const project = props.project as Project;
      state.data = JSON.stringify(project.toJSON(), null, '\t');
    });

    watch(
      () => props.project,
      (project: Project) => {
        state.data = JSON.stringify(project.toJSON(), null, '\t');
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
