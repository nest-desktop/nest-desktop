<template>
  <CodeEditor :extensions />
</template>

<script setup lang="ts">
import { Extension } from "@codemirror/state";
import { basicSetup } from "codemirror";
import { computed, UnwrapRef } from "vue";

import { components } from "@babsey/code-graph";
const { CodeEditor } = components;

import type { IAxiosErrorData } from "@/backends";
import { autocompletion, codeError, languagePython, oneDark } from "@/plugins/codemirror";
import { darkMode } from "@/theme";

import { getCurrentWorkspace } from "@/app";
const currentWorkspace = getCurrentWorkspace();

const props = defineProps<{ error?: UnwrapRef<IAxiosErrorData> }>();
const error = computed(() => props.error);

const extensions: Extension[] = [basicSetup, languagePython()];

if (currentWorkspace && currentWorkspace.completionSources)
  extensions.push(autocompletion({ override: currentWorkspace.completionSources }));

if (darkMode()) extensions.push(oneDark);

if (error.value) extensions.push(codeError(error.value));
</script>
