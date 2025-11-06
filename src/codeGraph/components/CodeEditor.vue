<template>
  <div class="code-editor" style="height: 100%">
    <div class="code-buttons">
      <button v-if="locked" class="baklava-button" title="The code is locked." @click="lockCode(false)">
        <LockCode />
      </button>
      <CopyToClipboard :text="modelValue" />
    </div>
    <codemirror v-model="model" :extensions class="codemirror" style="height: 100%" @keydown="lockCode(true)" />
  </div>
</template>

<script setup lang="ts">
import { LockCode } from "@babsey/code-graph";

import CopyToClipboard from "./CopyToClipboard.vue";
import { basicSetup } from "codemirror";
import { autocompletion, languagePython, oneDark } from "@/plugins/codemirror";

import { useAppStore } from "@/stores/appStore";
import { Extension } from "@codemirror/state";
import { darkMode } from "@/helpers/common/theme";
const appStore = useAppStore();

const model = defineModel({ required: true });
defineProps({ locked: Boolean });

const emit = defineEmits<{
  (e: "update:locked", v: boolean): void;
}>();

const lockCode = (v: boolean) => {
  emit("update:locked", v);
};

const extensions: Extension[] = [
  basicSetup,
  languagePython(),
  autocompletion({ override: appStore.currentWorkspace.completionSources }),
  // codeError(code.value.state),
];

if (darkMode()) {
  extensions.push(oneDark);
}

</script>

<style lang="scss">
.code-editor {
  position: relative;
  min-height: 60px;

  .code-buttons {
    position: absolute;
    display: flex;
    right: 0;
    z-index: 1;
    margin: 8px;

    .baklava-button {
      border-radius: 8px;
      margin: 0 2px;
    }
  }

  .codemirror {
    font-size: 13px !important;
    padding: 0;
    border: 0;
  }
}
</style>
