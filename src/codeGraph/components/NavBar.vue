<template>
  <nav class="navbar">
    <NavItem
      v-for="editor in codeGraphStore.state.editorStates"
      :key="editor.graph.id"
      :to="{ name: 'edit', params: { editorId: editor.graph.id } }"
      :class="{ active: editor.graph.id === codeGraphStore.viewModel.displayedGraph.id }"
    >
      {{ editor.graph.id.slice(0, 6) }}

      <template #appendIcon>
        <button class="remove" @click.prevent="codeGraphStore.removeEditorState(editor.graph.id)">
          <X />
        </button>
      </template>
    </NavItem>

    <NavItem :to="{ name: 'new' }" class="navItem">
      <Plus class="plus" />
    </NavItem>
  </nav>
</template>

<script setup lang="ts">
import { Plus, X } from "../icons";

import NavItem from "./NavItem.vue";

import { useCodeGraphStore } from "@/stores/graph/codeGraphStore";
const codeGraphStore = useCodeGraphStore();
</script>

<style lang="scss">
.navbar {
  display: flex;
  margin: 0;
  padding: 0;

  .appendIcon {
    button.remove {
      background-color: transparent;
      border: 0;
      margin-right: -8px;
      padding: 2px 8px;
      cursor: pointer;

      svg {
        color: var(--baklava-toolbar-foreground);
      }

      &:hover svg {
        stroke-width: var(--icon-stroke, 4);
      }
    }
  }
}
</style>
