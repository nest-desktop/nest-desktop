// codeGraphStore.ts

import { reactive, type UnwrapRef } from "vue";
import type { IEditorState } from "@baklavajs/core";
import type { RouteLocationNormalizedGeneric } from "vue-router";
import { defineStore } from "pinia";

import { useCodeGraph } from "@babsey/code-graph";

import { PythonCode } from "@/codeGraph/code";
import { registerNodeTypes } from "@/codeGraph/codeNodeTypes";

export const useCodeGraphStore = defineStore(
  "code-graph",
  () => {
    const state: UnwrapRef<{
      editorStates: Record<string, IEditorState>;
    }> = reactive({
      editorStates: {},
    });

    const token = Symbol("CodeGraphStore");

    const viewModel = useCodeGraph({ code: new PythonCode() });
    registerNodeTypes(viewModel);

    const loadEditor = (editorId?: string) => {
      // console.log('load editor', editorId?.slice(0,6))

      const editorIds = Object.keys(state.editorStates);
      if (!editorId || !editorIds.includes(editorId)) return newGraph();

      const editorState = state.editorStates[editorId];

      // load editor from editor state
      if (editorState) viewModel.loadEditor(editorState);

      return true;
    };

    const newGraph = () => {
      // console.log("create new graph")
      viewModel.newGraph();

      const editorId = saveEditor();
      return { name: "edit", params: { editorId } };
    };

    const removeEditorState = (editorId: string) => {
      delete state.editorStates[editorId];
    };

    const saveEditor = () => {
      // console.log('save editor', viewModel.editor.graph.shortId)
      state.editorStates[viewModel.editor.graph.id] = viewModel.editor.save();
      return viewModel.editor.graph.id;
    };

    const subscribe = () => {
      viewModel.engine?.events.afterRun.subscribe(token, saveEditor);
    };

    const unsubscribe = () => {
      viewModel.engine?.events.afterRun.unsubscribe(token);
    };

    return { loadEditor, newGraph, removeEditorState, state, subscribe, unsubscribe, viewModel };
  },
  {
    persist: {
      storage: sessionStorage, // localStorage
      pick: ["state.editorStates"],
    },
  },
);

export const initCodeGraph = (to: RouteLocationNormalizedGeneric): boolean => {
  if (!["new", "edit"].includes(to.name as string)) return true;

  const codeGraphStore = useCodeGraphStore();

  switch (to.name) {
    case "new":
      return codeGraphStore.newGraph();
    case "edit":
      return codeGraphStore.loadEditor(to.params.editorId as string);
  }

  return true;
};
