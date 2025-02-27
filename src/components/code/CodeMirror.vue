<template>
  <codemirror
    v-model="code.script"
    :extensions
    style="font-size: 0.75rem; width: 100%"
    @blur="() => (state.focused = false)"
    @focus="() => (state.focused = true)"
    @ready="handleReady"
    @update="updateView($event)"
  />
</template>

<script setup lang="ts">
import { EditorView } from "@codemirror/view";
import { Extension } from "@codemirror/state";
import { computed, nextTick, reactive, shallowRef, watch } from "vue";

import { TCode } from "@/types";
import { autocompletion, basicSetup, languagePython, oneDark, codeError } from "@/plugins/codemirror";
import { darkMode } from "@/helpers/common/theme";

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
  codeError(code.value.state),
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

watch(
  () => code.value.script,
  () => {
    if (!state.focused && state.cursor.from > 0) {
      nextTick(() => {
        view.value.dispatch({
          selection: state.cursor,
        });
      });
    }
  },
);

watch(
  () => code.value.state.error,
  () => view.value.dispatch(),
);
</script>

<style lang="scss">
.px-1px {
  padding-left: 1px;
  padding-right: 1px;
}

.cm-errorLine {
  background-color: rgba(var(--v-theme-red), var(--v-disabled-opacity)) !important;
}

.cm-panels-bottom {
  padding: 4px;
}
</style>
