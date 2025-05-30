<template>
  <div class="baklava-toolbar" @contextmenu.stop.prevent>
    <button
      v-for="c in commands"
      :key="c.command"
      :disabled="!viewModel.commandHandler.canExecuteCommand(command)"
      class="baklava-toolbar-entry baklava-toolbar-button"
      @click="viewModel.commandHandler.executeCommand(command)"
    >
      <component :is="c.icon" v-if="c.icon" />
      <template v-else>
        {{ c.title }}
      </template>
    </button>
  </div>
</template>

<script setup lang="ts">
import { Editor } from "baklavajs";
import { computed } from "vue";

import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";
const codeGraphStore = useCodeGraphStore();

const viewModel = useBaklava(codeGraphStore.editor as Editor);

const commands = computed(() => viewModel.value.settings.toolbar.commands);
</script>
