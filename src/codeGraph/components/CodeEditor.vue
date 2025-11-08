<template>
  <CodeEditor :extensions />
</template>

<script setup lang="ts">
import { Extension } from "@codemirror/state";
import { basicSetup } from "codemirror";
import { computed, UnwrapRef } from "vue";

import { CodeEditor } from "@babsey/code-graph";

import type { IErrorState } from "@/plugins/codeMirrorExtensions/codeError";
import { autocompletion, codeError, languagePython, oneDark } from "@/plugins/codemirror";
import { darkMode } from "@/helpers/common/theme";

import { useAppStore } from "@/stores/appStore";
const appStore = useAppStore();

const props = defineProps<{ error?: UnwrapRef<IErrorState> }>();
const error = computed(() => props.error);

const extensions: Extension[] = [
  basicSetup,
  languagePython(),
  autocompletion({ override: appStore.currentWorkspace.completionSources }),
];

if (darkMode()) extensions.push(oneDark);

if (error.value) extensions.push(codeError(error.value));
</script>
