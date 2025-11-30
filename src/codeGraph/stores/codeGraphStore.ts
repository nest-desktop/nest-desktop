// codeGraphStore.ts

import { reactive, type UnwrapRef } from "vue";
import type { IEditorState } from "@baklavajs/core";
import type { RouteLocationNormalizedGeneric } from "vue-router";
import { defineStore } from "pinia";

import { PythonCode, useCodeGraph } from "@babsey/code-graph";

import { registerNodeTypes } from "@/codeGraph/codeNodeTypes";

export const useCodeGraphStore = defineStore(
  "code-graph",
  () => {
    const state: UnwrapRef<{ editorStates: Record<string, IEditorState> }> = reactive({ editorStates: {} });

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
      viewModel.newGraph();

      const editorId = saveEditor();
      // TODO: change route name for all workspaces.
      return { name: "nestCodeGraphEdit", params: { editorId } };
    };

    const removeEditorState = (editorId: string) => delete state.editorStates[editorId];

    const saveEditor = () => {
      state.editorStates[viewModel.editor.graph.id] = viewModel.editor.save();
      return viewModel.editor.graph.id;
    };

    const subscribe = () => viewModel.engine?.events.afterRun.subscribe(token, saveEditor);

    const unsubscribe = () => viewModel.engine?.events.afterRun.unsubscribe(token);

    return { loadEditor, newGraph, removeEditorState, state, subscribe, unsubscribe, viewModel };
  },
  {
    persist: {
      storage: localStorage, // localStorage, sessionStorage
      pick: ["state.editorStates"],
    },
  },
);

export const initCodeGraph = (to: RouteLocationNormalizedGeneric): boolean => {
  const routeName = to.name as string;
  if (!routeName.includes("CodeGraphNew") && !routeName.includes("CodeGraphEdit")) return true;

  const codeGraphStore = useCodeGraphStore();

  if (routeName.includes("CodeGraphNew")) {
    return codeGraphStore.newGraph();
  } else if (routeName.includes("CodeGraphEdit")) {
    return codeGraphStore.loadEditor(to.params.editorId as string);
  }

  return true;
};
