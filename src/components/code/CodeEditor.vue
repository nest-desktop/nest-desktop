<template>
  <div style="height: 100%; position: relative; width: 100%">
    <v-snackbar v-model="code.state.locked" :timeout="-1">
      <v-icon color="warning" icon="mdi:mdi-exclamation-thick" />
      The code script has been edited and is locked from the generation.

      <template #actions>
        <v-btn variant="outlined" style="--v-btn-height: 36px" @click="lockCode(false)">reset</v-btn>
      </template>
    </v-snackbar>

    <div style="position: absolute; right: 12px; top: 8px; z-index: 1000">
      <CopyToClipboard :text="code.script" />
    </div>

    <codemirror
      v-model="code.script"
      :extensions
      style="font-size: 0.75rem; width: 100%; height: 100%"
      @blur="() => (state.focused = false)"
      @focus="() => (state.focused = true)"
      @ready="handleReady"
      @update="updateView($event)"
      @keydown="lockCode(true)"
    />
  </div>
</template>

<script setup lang="ts">
import { EditorView } from "@codemirror/view";
import { Extension } from "@codemirror/state";
import { computed, nextTick, reactive, shallowRef, watch } from "vue";

import { TCode } from "@/types";
import { autocompletion, basicSetup, languagePython, oneDark, codeError } from "@/plugins/codemirror";
import { darkMode } from "@/helpers/common/theme";
import CopyToClipboard from "./CopyToClipboard.vue";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

const props = defineProps<{ code: TCode }>();
const code = computed(() => props.code);

const view = shallowRef();
const state = reactive({
  cursor: { from: 0 },
  focused: false,
});

const extensions: Extension[] = [
  basicSetup,
  languagePython(),
  autocompletion({ override: appStore.currentWorkspace.completionSources }),
  // codeError(code.value.state),
];

if (darkMode()) {
  extensions.push(oneDark);
}

const handleReady = (payload: MouseEvent) => {
  view.value = payload.view;
};

const updateView = (event: EditorView) => {
  state.cursor = event.state.selection.ranges[0];
};

const lockCode = (value: boolean) => {
  code.value.state.locked = value;
  if (!value) code.value.generate();
};

watch(
  () => code.value.script,
  () => {
    // if (!state.focused && state.cursor.from > 0) {
    nextTick(() => {
      view.value.dispatch({
        selection: state.cursor,
      });
    });
    // }
  },
);

watch(
  () => code.value.state.error,
  () => view.value.dispatch(),
);
</script>

<style lang="scss">
.cm-errorLine {
  background-color: rgba(var(--v-theme-red), var(--v-disabled-opacity)) !important;
}

.cm-panels-bottom {
  padding: 0 4px;
}
</style>
