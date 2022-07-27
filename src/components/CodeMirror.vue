<template>
  <div class="codeMirror" ref="codeMirrorWrapper">
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
import { onMounted, reactive, ref, watch } from '@vue/composition-api';
import { codemirror } from 'vue-codemirror';

export default Vue.extend({
  name: 'CodeMirror',
  components: {
    codemirror,
  },
  props: {
    data: Object,
  },
  setup(props, { root }) {
    const codeMirror = ref(null);
    const codeMirrorWrapper = ref(null);

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
      const height = codeMirrorWrapper.value.clientHeight;
      const width = codeMirrorWrapper.value.clientWidth;
      codeMirror.value.cminstance.setSize(width, height);
      updateTheme();
    };

    onMounted(() => {
      state.data = JSON.stringify(props.data, null, '\t');
      window.addEventListener('resize', resizeCodeMirror);
      setTimeout(resizeCodeMirror, 1);
    });

    watch(
      () => props.data,
      (data: any) => {
        state.data = JSON.stringify(data, null, '\t');
      }
    );

    return { codeMirror, codeMirrorWrapper, state };
  },
});
</script>

<style>
.codeMirror {
  height: calc(100vh - 48px - 24px);
}

.codeMirror .CodeMirror {
  border: 1px solid rgba(0, 0, 0, 0.12);
  font-family: monospace;
  font-size: 12px;
}
</style>
